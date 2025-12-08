const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Mute một thành viên trong voice channel',
  slashData: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute một thành viên trong voice channel')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn mute')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  // Prefix: !mute @user
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply('❌ Bạn không có quyền mute!');
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply('Bạn phải mention người muốn mute!');
    const member = message.guild.members.cache.get(target.id);
    await member.voice.setMute(true);
    message.reply(`🔇 Đã mute ${target.tag}`);
  },

  // Slash: /mute target:@user
  async slashExecute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return interaction.reply('❌ Bạn không có quyền mute!');
    }
    const target = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(target.id);
    await member.voice.setMute(true);
    interaction.reply(`🔇 Đã mute ${target.tag}`);
  }
};