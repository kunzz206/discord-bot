const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
  name: 'play',
  description: 'Phát nhạc từ YouTube (link hoặc tên bài hát)',
  slashData: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Phát nhạc từ YouTube')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Link YouTube hoặc tên bài hát + tác giả')
        .setRequired(true)
    ),

  // Prefix: !play <link hoặc tên bài hát>
  async execute(message, args) {
    const query = args.join(' ');
    if (!query) return message.reply('❌ Bạn cần nhập link hoặc tên bài hát sau lệnh `!play <query>`');

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) return message.reply('❌ Bạn phải vào voice channel trước!');

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      let url = query;
      if (!play.yt_validate(query)) {
        const results = await play.search(query, { limit: 1 });
        if (!results || results.length === 0) return message.reply('❌ Không tìm thấy bài hát nào!');
        url = results[0].url;
      }

      // Lấy info + stream từ info
      const info = await play.video_info(url);
      const stream = await play.stream_from_info(info);
      const resource = createAudioResource(stream.stream, { inputType: stream.type });

      const player = createAudioPlayer();
      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        message.reply(`🎶 Đang phát: ${info.video_details.title}`);
      });

      player.on('error', error => {
        console.error(error);
        message.reply('❌ Có lỗi khi phát nhạc!');
      });
    } catch (err) {
      console.error(err);
      message.reply('❌ Không thể phát nhạc từ query này.');
    }
  },

  // Slash: /play query:<link hoặc tên bài hát>
  async slashExecute(interaction) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member?.voice.channel;
    if (!voiceChannel) return interaction.editReply('❌ Bạn phải vào voice channel trước!');

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      let url = query;
      if (!play.yt_validate(query)) {
        const results = await play.search(query, { limit: 1 });
        if (!results || results.length === 0) return interaction.editReply('❌ Không tìm thấy bài hát nào!');
        url = results[0].url;
      }

      const info = await play.video_info(url);
      const stream = await play.stream_from_info(info);
      const resource = createAudioResource(stream.stream, { inputType: stream.type });

      const player = createAudioPlayer();
      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        interaction.editReply(`🎶 Đang phát: ${info.video_details.title}`);
      });

      player.on('error', error => {
        console.error(error);
        interaction.editReply('❌ Có lỗi khi phát nhạc!');
      });
    } catch (err) {
      console.error(err);
      interaction.editReply('❌ Không thể phát nhạc từ query này.');
    }
  }
};