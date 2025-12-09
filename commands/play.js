const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue, QueryType } = require('discord-player');

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
    try {
      const guild = await client.guilds.fetch(message.guildId);
      const author = await guild.members.fetch(message.author.id);

      if (!author.voice.channelId) {
        return message.channel.send('❌ Bạn chưa vào voice channel.');
      }

      const queryText = args.join(' ');
      const mainPlayer = useMainPlayer();
      let queue = useQueue(message.guildId);

      if (!queue) {
        queue = mainPlayer.nodes.create(message.guildId, {
          metadata: { channel: message.channel },
          leaveOnEnd: false,
          leaveOnStop: false,
          leaveOnEmpty: true
        });
      }

      try {
        if (!queue.connection) await queue.connect(author.voice.channelId);
      } catch (e) {
        console.error('[PLAY PREFIX] connect error:', e);
        queue.delete();
        return message.channel.send('❌ Không thể join voice channel!');
      }

      const searchResult = await mainPlayer.search(queryText, {
        requestedBy: message.author,
        searchEngine: QueryType.AUTO
      });

      if (!searchResult || !searchResult.tracks.length) {
        return message.channel.send(`❌ Không tìm thấy bài hát nào với: ${queryText}`);
      }

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`🎶 | Đã thêm ${searchResult.playlist ? 'playlist' : 'bài hát'} vào queue`);

      if (!searchResult.playlist) {
        const tr = searchResult.tracks[0];
        embed.setThumbnail(tr.thumbnail);
        embed.setDescription(tr.title);
      }

      if (!queue.node.isPlaying()) {
        if (searchResult.playlist) {
          queue.addTracks(searchResult.tracks);
          await queue.node.play(queue.tracks[0]);
        } else {
          await queue.node.play(searchResult.tracks[0]);
        }
        console.log('[PLAY PREFIX] started playing');
      } else {
        searchResult.playlist
          ? queue.addTracks(searchResult.tracks)
          : queue.addTrack(searchResult.tracks[0]);
        console.log('[PLAY PREFIX] added to existing queue');
      }

      return message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('[PLAY PREFIX] fatal error:', err);
      return message.channel.send(`❌ Lỗi khi chạy play: ${err?.message || 'Unknown error'}`);
    }
  },

  // Slash: /play query:<link hoặc tên bài hát>
  async slashExecute(interaction, client, player) {
    try {
      const query = interaction.options.getString('query');
      const guild = await client.guilds.fetch(interaction.guildId);
      const author = await guild.members.fetch(interaction.user.id);

      if (!author.voice.channelId) {
        return interaction.editReply('❌ Bạn chưa vào voice channel.');
      }

      const mainPlayer = useMainPlayer();
      let queue = useQueue(interaction.guildId);

      if (!queue) {
        queue = mainPlayer.nodes.create(interaction.guildId, {
          metadata: { channel: interaction.channel },
          leaveOnEnd: false,
          leaveOnStop: false,
          leaveOnEmpty: true
        });
      }

      try {
        if (!queue.connection) await queue.connect(author.voice.channelId);
      } catch (e) {
        console.error('[PLAY SLASH] connect error:', e);
        queue.delete();
        return interaction.editReply('❌ Không thể join voice channel!');
      }

      const searchResult = await mainPlayer.search(query, {
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

      if (!queue.node.isPlaying()) {
        if (searchResult.playlist) {
          queue.addTracks(searchResult.tracks);
          await queue.node.play(queue.tracks[0]);
        } else {
          await queue.node.play(searchResult.tracks[0]);
        }
        console.log('[PLAY SLASH] started playing');
      } else {
        searchResult.playlist
          ? queue.addTracks(searchResult.tracks)
          : queue.addTrack(searchResult.tracks[0]);
        console.log('[PLAY SLASH] added to existing queue');
      }

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[PLAY SLASH] fatal error:', err);
      return interaction.editReply(`❌ Lỗi khi chạy play: ${err?.message || 'Unknown error'}`);
    }
  }
};