const { SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Chào slash command'),
  new SlashCommandBuilder()
    .setName('time')
    .setDescription('Xem giờ hiện tại'),
 
  new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Hôn một người')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn kiss')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Ôm một người')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người bạn muốn hug')
        .setRequired(true)),
].map(command => command.toJSON());
