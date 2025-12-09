const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'stop',
  description: 'Dừng nhạc và thoát voice channel',
  slashData: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Dừng nhạc và thoát voice channel'),

  // Prefix: !stop
  async execute(message, client, player) {
    const queue = player.getQueue(message.guildId);
    if (!queue || !queue.playing) {
      return message.channel.send('❌ Không có nhạc nào đang phát.');
    }

    queue.destroy();
    return message.channel.send('🛑 Đã dừng nhạc và thoát voice channel.');
  },

  // Slash: /stop
  async slashExecute(interaction, client, player) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply('❌ Không có nhạc nào đang phát.');
    }

    queue.destroy();
    return interaction.editReply('🛑 Đã dừng nhạc và thoát voice channel.');
  }
};