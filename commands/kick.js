const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick một thành viên khỏi server',
  slashData: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick một thành viên khỏi server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn kick')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  // Prefix: !kick @username
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ Bạn không có quyền kick!');
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn phải mention người muốn kick!');
    const member = message.guild.members.cache.get(target.id);
    await member.kick();
    message.reply(`👢 Đã kick ${target.tag}`);
  },

  // Slash: /kick target:@username
  async slashExecute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.editReply('❌ Bạn không có quyền kick!');
    }
    const target = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(target.id);
    await member.kick();
    await interaction.editReply(`👢 Đã kick ${target.tag}`);
  }
};