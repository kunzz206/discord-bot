const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Unban một thành viên',
  slashData: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban một thành viên')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('ID của người bạn muốn unban')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Bạn không có quyền unban!');
    }
    const userId = args[0];
    if (!userId) return message.reply('Bạn phải nhập ID người muốn unban!');
    await message.guild.members.unban(userId);
    message.reply(`🔓 Đã unban ID ${userId}`);
  },

  async slashExecute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.editReply('❌ Bạn không có quyền unban!');
    }
    const userId = interaction.options.getString('userid');
    await interaction.guild.members.unban(userId);
    await interaction.editReply(`🔓 Đã unban ID ${userId}`);
  }
};