const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
  name: 'play',
  description: 'Phát nhạc từ YouTube',
  slashData: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Phát nhạc từ YouTube')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Link YouTube cần phát')
        .setRequired(true)
    ),

  // Prefix command: !play <url>
  async execute(message, args) {
    const url = args[0];
    if (!url) return message.reply('❌ Bạn cần nhập link YouTube sau lệnh `!play <url>`');

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) return message.reply('❌ Bạn phải vào voice channel trước!');

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      const stream = await play.stream(url);
      const resource = createAudioResource(stream.stream, { inputType: stream.type });

      const player = createAudioPlayer();
      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        message.reply(`🎶 Đang phát: ${url}`);
      });

      player.on('error', error => {
        console.error(error);
        message.reply('❌ Có lỗi khi phát nhạc!');
      });
    } catch (err) {
      console.error(err);
      message.reply('❌ Không thể phát nhạc từ link này.');
    }
  },

  // Slash command: /play url:<link>
  async slashExecute(interaction) {
    const url = interaction.options.getString('url');
    const voiceChannel = interaction.member?.voice.channel;
    if (!voiceChannel) return interaction.reply('❌ Bạn phải vào voice channel trước!');

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const stream = await play.stream(url);
      const resource = createAudioResource(stream.stream, { inputType: stream.type });

      const player = createAudioPlayer();
      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        interaction.reply(`🎶 Đang phát: ${url}`);
      });

      player.on('error', error => {
        console.error(error);
        interaction.reply('❌ Có lỗi khi phát nhạc!');
      });
    } catch (err) {
      console.error(err);
      interaction.reply('❌ Không thể phát nhạc từ link này.');
    }
  }
};