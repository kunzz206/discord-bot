const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Mute một thành viên',
  slashData: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute một thành viên')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn mute')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply('❌ Bạn không có quyền mute!');
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn phải mention người muốn mute!');
    const member = message.guild.members.cache.get(target.id);
    await member.timeout(10 * 60 * 1000); // mute 10 phút
    message.reply(`🔇 Đã mute ${target.tag} trong 10 phút`);
  },

  async slashExecute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return interaction.editReply('❌ Bạn không có quyền mute!');
    }
    const target = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(target.id);
    await member.timeout(10 * 60 * 1000); // mute 10 phút
    await interaction.editReply(`🔇 Đã mute ${target.tag} trong 10 phút`);
  }
};