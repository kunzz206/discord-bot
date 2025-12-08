const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'stop',
  description: 'Dừng nhạc và thoát voice channel',
  slashData: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Dừng nhạc và thoát voice channel'),

  async execute(message, args) {
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) return message.reply('❌ Bạn phải vào voice channel trước!');
    try {
      voiceChannel.leave?.(); // fallback nếu cần
      message.reply('🛑 Đã dừng nhạc và thoát voice channel.');
    } catch (err) {
      console.error(err);
      message.reply('❌ Không thể dừng nhạc.');
    }
  },

  async slashExecute(interaction) {
    const voiceChannel = interaction.member?.voice.channel;
    if (!voiceChannel) return interaction.reply('❌ Bạn phải vào voice channel trước!');
    try {
      voiceChannel.leave?.();
      interaction.reply('🛑 Đã dừng nhạc và thoát voice channel.');
    } catch (err) {
      console.error(err);
      interaction.reply('❌ Không thể dừng nhạc.');
    }
  }
};