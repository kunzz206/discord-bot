const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';

client.once('ready', () => {
  console.log(`✅ Bot đã đăng nhập với tên: ${client.user.tag}`);
});

/**
 * Prefix commands: !hello, !time, !kiss, !hug
 */
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  const kissGifs = [
    'https://media.tenor.com/6dBdEsXHESAAAAAm/kiss.webp',
    'https://media.tenor.com/bvXwJ4I19ZQAAAAm/cat-cat-meme.webp',
    'https://media.tenor.com/zSeVsEsjtugAAAAm/peach-and-goma.webp'
  ];
  const hugGifs = [
    'https://media.tenor.com/X6YT2FsV3bAAAAAM/cat.gif',
    'https://media.tenor.com/dZnXXorasI0AAAAm/hug.webp',
    'https://media.tenor.com/ofD02MeILMwAAAAm/hug-love.webp'
  ];

  if (command === 'hello') {
    return message.reply('Xin chào 👋');
  }

  if (command === 'time') {
    const now = new Date();
    return message.reply(`⏰ Bây giờ là ${now.toLocaleTimeString()}`);
  }

  if (command === 'kiss') {
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn hãy mention người muốn kiss nhé, ví dụ: `!kiss @username`');
    const gif = kissGifs[Math.floor(Math.random() * kissGifs.length)];
    const embed = new EmbedBuilder()
      .setDescription(`${message.author} 😘 hôn ${target}!`)
      .setImage(gif);
    return message.channel.send({ embeds: [embed] });
  }

  if (command === 'hug') {
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn hãy mention người muốn hug nhé, ví dụ: `!hug @username`');
    const gif = hugGifs[Math.floor(Math.random() * hugGifs.length)];
    const embed = new EmbedBuilder()
      .setDescription(`${message.author} 🤗 ôm ${target}!`)
      .setImage(gif);
    return message.channel.send({ embeds: [embed] });
  }
});

/**
 * Slash commands: /hello, /time, /kiss, /hug
 */
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const kissGifs = [
    'https://i.imgur.com/wOmoeF8.gif',
    'https://i.imgur.com/0D0Mmek.gif'
  ];
  const hugGifs = [
    'https://i.imgur.com/r9aU2xv.gif',
    'https://i.imgur.com/6qYOUQF.gif'
  ];

  if (interaction.commandName === 'hello') {
    return interaction.reply('Xin chào 👋 slash command!');
  }

  if (interaction.commandName === 'time') {
    const now = new Date();
    return interaction.reply(`⏰ Bây giờ là ${now.toLocaleTimeString()}`);
  }

  if (interaction.commandName === 'kiss') {
    const target = interaction.options.getUser('target');
    const gif = kissGifs[Math.floor(Math.random() * kissGifs.length)];
    const embed = new EmbedBuilder()
      .setDescription(`${interaction.user} 😘 hôn ${target}!`)
      .setImage(gif);
    return interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'hug') {
    const target = interaction.options.getUser('target');
    const gif = hugGifs[Math.floor(Math.random() * hugGifs.length)];
    const embed = new EmbedBuilder()
      .setDescription(`${interaction.user} 🤗 ôm ${target}!`)
      .setImage(gif);
    return interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);