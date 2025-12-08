// index.js
const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const PREFIX = '!';
client.commands = new Collection();

// Auto load tất cả file trong folder commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`✅ Bot đã đăng nhập với tên: ${client.user.tag}`);
});

// Prefix commands
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('❌ Có lỗi khi chạy lệnh này!');
  }
});

// Slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    // Auto defer cho tất cả slash command nếu chưa trả lời
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply();
    }

    await command.slashExecute(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.editReply('❌ Có lỗi khi chạy slash command!');
    }
  }
});

client.login(process.env.TOKEN);