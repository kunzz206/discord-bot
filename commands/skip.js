const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'skip',
  description: 'Chuyển sang bài hát tiếp theo',
  slashData: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Chuyển sang bài hát tiếp theo'),

  // Prefix: !skip
  async execute(message, client, player) {
    const queue = player.getQueue(message.guildId);
    if (!queue || !queue.playing) {
      return message.channel.send('❌ Không có bài hát nào đang phát.');
    }

    const currentTrack = queue.current;
    const success = queue.skip();
    return message.channel.send(success
      ? `⏭️ Đã chuyển bài: **${currentTrack.title}**`
      : '❌ Không thể chuyển bài.');
  },

  // Slash: /skip
  async slashExecute(interaction, client, player) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply('❌ Không có bài hát nào đang phát.');
    }

    const currentTrack = queue.current;
    const success = queue.skip();
    return interaction.editReply(success
      ? `⏭️ Đã chuyển bài: **${currentTrack.title}**`
      : '❌ Không thể chuyển bài.');
  }
};