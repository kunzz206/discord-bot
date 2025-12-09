const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
  name: 'play',
  description: 'Phát nhạc từ YouTube (link hoặc tên bài hát)',
  slashData: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Phát nhạc từ YouTube')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Link hoặc tên bài hát + tác giả')
        .setRequired(true)
    ),

  // Prefix: !play <query>
  async execute(message, client, player, args) {
    const guild = await client.guilds.fetch(message.guildId);
    const author = await guild.members.fetch(message.author.id);

    if (!author.voice.channelId) {
      return message.channel.send('❌ Bạn chưa vào voice channel.');
    }

    const queue = player.createQueue(message.guildId, {
      metadata: { channel: message.channel },
      leaveOnEnd: false,
      leaveOnStop: false,
      leaveOnEmpty: true
    });

    try {
      if (!queue.connection) await queue.connect(author.voice.channelId);
    } catch {
      queue.destroy();
      return message.channel.send('❌ Không thể join voice channel!');
    }

    const searchResult = await player.search(args.join(' '), {
      requestedBy: message.author,
      searchEngine: QueryType.AUTO
    });

    if (!searchResult || !searchResult.tracks.length) {
      return message.channel.send(`❌ Không tìm thấy bài hát nào với: ${args.join(' ')}`);
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`🎶 | Đã thêm ${searchResult.playlist ? 'playlist' : 'bài hát'} vào queue`);

    if (!searchResult.playlist) {
      const tr = searchResult.tracks[0];
      embed.setThumbnail(tr.thumbnail);
      embed.setDescription(tr.title);
    }

    if (!queue.playing) {
      if (searchResult.playlist) {
        queue.addTracks(searchResult.tracks);
        await queue.play(queue.tracks[0]);
      } else {
        await queue.play(searchResult.tracks[0]);
      }
    } else {
      searchResult.playlist
        ? queue.addTracks(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0]);
    }

    return message.channel.send({ embeds: [embed] });
  },

  // Slash: /play query:<link hoặc tên bài hát>
  async slashExecute(interaction, client, player) {
    const query = interaction.options.getString('query');
    const guild = await client.guilds.fetch(interaction.guildId);
    const author = await guild.members.fetch(interaction.user.id);

    if (!author.voice.channelId) {
      return interaction.editReply('❌ Bạn chưa vào voice channel.');
    }

    const queue = player.createQueue(interaction.guildId, {
      metadata: { channel: interaction.channel },
      leaveOnEnd: false,
      leaveOnStop: false,
      leaveOnEmpty: true
    });

    try {
      if (!queue.connection) await queue.connect(author.voice.channelId);
    } catch {
      queue.destroy();
      return interaction.editReply('❌ Không thể join voice channel!');
    }

    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO
    });

    if (!searchResult || !searchResult.tracks.length) {
      return interaction.editReply(`❌ Không tìm thấy bài hát nào với: ${query}`);
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`🎶 | Đã thêm ${searchResult.playlist ? 'playlist' : 'bài hát'} vào queue`);

    if (!searchResult.playlist) {
      const tr = searchResult.tracks[0];
      embed.setThumbnail(tr.thumbnail);
      embed.setDescription(tr.title);
    }

    if (!queue.playing) {
      if (searchResult.playlist) {
        queue.addTracks(searchResult.tracks);
        await queue.play(queue.tracks[0]);
      } else {
        await queue.play(searchResult.tracks[0]);
      }
    } else {
      searchResult.playlist
        ? queue.addTracks(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0]);
    }

    return interaction.editReply({ embeds: [embed] });
  }
};