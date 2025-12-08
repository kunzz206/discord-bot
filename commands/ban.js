const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban một thành viên khỏi server',
  slashData: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban một thành viên khỏi server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn ban')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Bạn không có quyền ban!');
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn phải mention người muốn ban!');
    const member = message.guild.members.cache.get(target.id);
    await member.ban();
    message.reply(`🚫 Đã ban ${target.tag}`);
  },

  async slashExecute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.editReply('❌ Bạn không có quyền ban!');
    }
    const target = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(target.id);
    await member.ban();
    await interaction.editReply(`🚫 Đã ban ${target.tag}`);
  }
};