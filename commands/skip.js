const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  name: 'skip',
  description: 'Chuyển sang bài hát tiếp theo',
  slashData: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Chuyển sang bài hát tiếp theo'),

  // Prefix: !skip
  async execute(message) {
    const queue = useQueue(message.guildId);
    if (!queue || !queue.node.isPlaying()) {
      return message.channel.send('❌ Không có bài hát nào đang phát.');
    }

    const currentTrack = queue.currentTrack;
    const success = queue.node.skip();

    return message.channel.send(
      success
        ? `⏭️ Đã chuyển bài: **${currentTrack.title}**`
        : '❌ Không thể chuyển bài.'
    );
  },

  // Slash: /skip
  async slashExecute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.node.isPlaying()) {
      return interaction.editReply('❌ Không có bài hát nào đang phát.');
    }

    const currentTrack = queue.currentTrack;
    const success = queue.node.skip();

    return interaction.editReply(
      success
        ? `⏭️ Đã chuyển bài: **${currentTrack.title}**`
        : '❌ Không thể chuyển bài.'
    );
  }
};