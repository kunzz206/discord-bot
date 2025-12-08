// deploy-commands.js
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Chào slash command'),

  new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Hôn một người')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn kiss')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Ôm một người')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn hug')
        .setRequired(true)
    ),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🚀 Bắt đầu đăng ký slash commands...');

    // Xóa toàn bộ global commands
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] },
    );

    // Đăng ký lại guild commands trong server của bạn
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, '1249175249820581960'),
      { body: commands },
    );

    console.log('✅ Slash commands đã được đăng ký thành công trong server!');
  } catch (error) {
    console.error(error);
  }
})();