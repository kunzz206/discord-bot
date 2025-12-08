const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder().setName('hello').setDescription('Chào bot bằng slash command'),
  new SlashCommandBuilder().setName('random').setDescription('Bot trả lời ngẫu nhiên'),
  new SlashCommandBuilder().setName('time').setDescription('Xem giờ hiện tại')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🚀 Đang đăng ký slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('✅ Slash commands đã đăng ký thành công!');
  } catch (error) {
    console.error(error);
  }
})();