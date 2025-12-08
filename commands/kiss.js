const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const kissGifs = [
  'https://media.tenor.com/6dBdEsXHESAAAAAm/kiss.webp',
  'https://media.tenor.com/bvXwJ4I19ZQAAAAm/cat-cat-meme.webp',
  'https://media.tenor.com/zSeVsEsjtugAAAAm/peach-and-goma.webp'
];

module.exports = {
  name: 'kiss',
  description: 'Hôn một người',
  slashData: new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Hôn một người')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn kiss')
        .setRequired(true)
    ),

  // Prefix: !kiss @username
  async execute(message, args) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn hãy mention người muốn kiss nhé, ví dụ: `!kiss @username`');
    const gif = kissGifs[Math.floor(Math.random() * kissGifs.length)];
    const embed = new EmbedBuilder()
      .setDescription(`${message.author} 😘 hôn ${target}!`)
      .setImage(gif);
    return message.channel.send({ embeds: [embed] });
  },

  // Slash: /kiss target:@username
  async slashExecute(interaction) {
    const target = interaction.options.getUser('target');
    const gif = kissGifs[Math.floor(Math.random() * kissGifs.length)];
    const embed = new EmbedBuilder()
      .setDescription(`${interaction.user} 😘 hôn ${target}!`)
      .setImage(gif);
    return interaction.reply({ embeds: [embed] });
  }
};