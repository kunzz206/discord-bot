const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Unmute một thành viên',
  slashData: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute một thành viên')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn unmute')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply('❌ Bạn không có quyền unmute!');
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn phải mention người muốn unmute!');
    const member = message.guild.members.cache.get(target.id);
    await member.timeout(null); // bỏ timeout
    message.reply(`🔊 Đã unmute ${target.tag}`);
  },

  async slashExecute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return interaction.editReply('❌ Bạn không có quyền unmute!');
    }
    const target = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(target.id);
    await member.timeout(null); // bỏ timeout
    await interaction.editReply(`🔊 Đã unmute ${target.tag}`);
  }
};