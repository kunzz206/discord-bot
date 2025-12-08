const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'stop',
  description: 'Dừng nhạc và thoát voice channel',
  slashData: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Dừng nhạc và thoát voice channel'),

  // Prefix: !stop
  async execute(message) {
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) return message.reply('❌ Bot không ở trong voice channel!');
    try {
      connection.destroy();
      message.reply('🛑 Đã dừng nhạc và thoát voice channel.');
    } catch (err) {
      console.error(err);
      message.reply('❌ Không thể dừng nhạc.');
    }
  },

  // Slash: /stop
  async slashExecute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) return interaction.editReply('❌ Bot không ở trong voice channel!');
    try {
      connection.destroy();
      await interaction.editReply('🛑 Đã dừng nhạc và thoát voice channel.');
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Không thể dừng nhạc.');
    }
  }
};