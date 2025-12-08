const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Unmute một thành viên trong voice channel',
  slashData: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute một thành viên trong voice channel')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn unmute')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  // Prefix: !unmute @user
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply('❌ Bạn không có quyền unmute!');
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn phải mention người muốn unmute!');
    const member = message.guild.members.cache.get(target.id);
    await member.voice.setMute(false);
    message.reply(`🔊 Đã unmute ${target.tag}`);
  },

  // Slash: /unmute target:@user
  async slashExecute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return interaction.reply('❌ Bạn không có quyền unmute!');
    }
    const target = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(target.id);
    await member.voice.setMute(false);
    interaction.reply(`🔊 Đã unmute ${target.tag}`);
  }
};