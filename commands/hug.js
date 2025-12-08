const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const hugGifs = [
  'https://media.tenor.com/X6YT2FsV3bAAAAAM/cat.gif',
  'https://media.tenor.com/dZnXXorasI0AAAAm/hug.webp',
  'https://media.tenor.com/ofD02MeILMwAAAAm/hug-love.webp'
];

module.exports = {
  name: 'hug',
  description: 'Ôm một người',
  slashData: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Ôm một người')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn hug')
        .setRequired(true)
    ),

  // Prefix: !hug @username
  async execute(message, args) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn hãy mention người muốn hug nhé, ví dụ: `!hug @username`');
    const gif = hugGifs[Math.floor(Math.random() * hugGifs.length)];
    const embed = new EmbedBuilder()
      .setDescription(`${message.author} 🤗 ôm ${target}!`)
      .setImage(gif);
    return message.channel.send({ embeds: [embed] });
  },

  // Slash: /hug target:@username
  async slashExecute(interaction) {
    const target = interaction.options.getUser('target');
    const gif = hugGifs[Math.floor(Math.random() * hugGifs.length)];
    const embed = new EmbedBuilder()
      .setDescription(`${interaction.user} 🤗 ôm ${target}!`)
      .setImage(gif);
    return interaction.reply({ embeds: [embed] });
  }
};