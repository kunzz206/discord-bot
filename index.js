const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const { Player } = require('discord-player');

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

// Khởi tạo player và gắn vào client
const player = new Player(client);
client.player = player;

// Auto load tất cả file trong folder commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const { DefaultExtractors } = require('@discord-player/extractor'); // thêm dòng này

client.once('ready', async () => {
  console.log(`✅ Bot đã đăng nhập với tên: ${client.user.tag}`);
  await player.extractors.loadMulti(DefaultExtractors); // ✅ đúng với v7
  console.log('🎧 Extractors loaded.');
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
    await command.execute(message, client, player, args);
  } catch (error) {
    console.error(error);
    message.channel.send('❌ Có lỗi khi chạy lệnh này!');
  }
});

// Slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply();
    }
    await command.slashExecute(interaction, client, player);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.editReply('❌ Có lỗi khi chạy slash command!');
    }
  }
});

client.login(process.env.TOKEN);