const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  name: 'stop',
  description: 'Dừng nhạc và thoát voice channel',
  slashData: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Dừng nhạc và thoát voice channel'),

  // Prefix: !stop
  async execute(message) {
    const queue = useQueue(message.guildId);
    if (!queue || !queue.node.isPlaying()) {
      return message.channel.send('❌ Không có nhạc nào đang phát.');
    }

    queue.delete();
    return message.channel.send('🛑 Đã dừng nhạc và thoát voice channel.');
  },

  // Slash: /stop
  async slashExecute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.node.isPlaying()) {
      return interaction.editReply('❌ Không có nhạc nào đang phát.');
    }

    queue.delete();
    return interaction.editReply('🛑 Đã dừng nhạc và thoát voice channel.');
  }
};