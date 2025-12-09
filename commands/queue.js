const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'queue',
  description: 'Xem danh sách nhạc hiện tại',
  slashData: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Xem danh sách nhạc hiện tại'),

  // Prefix: !queue
  async execute(message, client, player) {
    const queue = player.getQueue(message.guildId);
    if (!queue || !queue.playing) {
      return message.channel.send('❌ Không có bài hát nào trong queue.');
    }

    const tracks = queue.tracks.slice(0, 10).map((t, i) => {
      return `${i + 1}. ${t.title} | ${t.requestedBy.username}`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🎶 Danh sách nhạc')
      .setDescription(`Đang phát: **${queue.current.title}**\n\n${tracks}`);

    return message.channel.send({ embeds: [embed] });
  },

  // Slash: /queue
  async slashExecute(interaction, client, player) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply('❌ Không có bài hát nào trong queue.');
    }

    const tracks = queue.tracks.slice(0, 10).map((t, i) => {
      return `${i + 1}. ${t.title} | ${t.requestedBy.username}`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🎶 Danh sách nhạc')
      .setDescription(`Đang phát: **${queue.current.title}**\n\n${tracks}`);

    return interaction.editReply({ embeds: [embed] });
  }
};