const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'disconnect',
  description: 'Cho bot rời khỏi voice channel',
  slashData: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Cho bot rời khỏi voice channel'),

  // Prefix: !disconnect
  async execute(message) {
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) return message.reply('❌ Bot không ở trong voice channel!');
    connection.destroy();
    message.reply('👋 Bot đã rời voice channel');
  },

  // Slash: /disconnect
  async slashExecute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) return interaction.editReply('❌ Bot không ở trong voice channel!');
    connection.destroy();
    await interaction.editReply('👋 Bot đã rời voice channel');
  }
};