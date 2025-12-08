const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  name: 'join',
  description: 'Cho bot vào voice channel của bạn',
  slashData: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Cho bot vào voice channel của bạn'),

  // Prefix: !join
  async execute(message) {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply('❌ Bạn phải vào voice channel trước!');
    joinVoiceChannel({
      channelId: channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
    message.reply(`✅ Đã join voice channel: ${channel.name}`);
  },

  // Slash: /join
  async slashExecute(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.editReply('❌ Bạn phải vào voice channel trước!');
    joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    await interaction.editReply(`✅ Đã join voice channel: ${channel.name}`);
  }
};