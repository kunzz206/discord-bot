const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  name: 'queue',
  description: 'Xem danh sách nhạc hiện tại',
  slashData: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Xem danh sách nhạc hiện tại'),

  // Prefix: !queue
  async execute(message) {
    const queue = useQueue(message.guildId);
    if (!queue || !queue.node.isPlaying()) {
      return message.channel.send('❌ Không có bài hát nào trong queue.');
    }

    const now = queue.currentTrack;
    const tracks = queue.tracks.toArray().slice(0, 10).map((t, i) => {
      return `${i + 1}. ${t.title} | ${t.requestedBy?.username ?? 'Unknown'}`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🎶 Danh sách nhạc')
      .setDescription(
        `Đang phát: **${now.title}**\n\n${tracks || 'Không có bài hát nào tiếp theo.'}`
      );

    return message.channel.send({ embeds: [embed] });
  },

  // Slash: /queue
  async slashExecute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.node.isPlaying()) {
      return interaction.editReply('❌ Không có bài hát nào trong queue.');
    }

    const now = queue.currentTrack;
    const tracks = queue.tracks.toArray().slice(0, 10).map((t, i) => {
      return `${i + 1}. ${t.title} | ${t.requestedBy?.username ?? 'Unknown'}`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🎶 Danh sách nhạc')
      .setDescription(
        `Đang phát: **${now.title}**\n\n${tracks || 'Không có bài hát nào tiếp theo.'}`
      );

    return interaction.editReply({ embeds: [embed] });
  }
};