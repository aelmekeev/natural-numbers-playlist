/**
 * This script allows to dump an existing youtube playlist to playlist.json in the repo root.
 * Usage: YOUTUBE_API_KEY=<youtube api key> node ./utils/youtube/enrich-playlist.js <playlist id>
 */

const fs = require('fs')
const youtube = require('./youtube')

const playlistPath = './playlist.json'
const playlistId = process.argv[2]

const data = fs.readFileSync(playlistPath, 'utf8')
const playlist = JSON.parse(data)

const enrichPlaylist = data => {
  const videoIds = data.map(v => v.contentDetails.videoId)
  if (videoIds.length != playlist.length) {
    throw new Error('Youtube playlist size is different from current playlist size.')
  }

  const enrichedPlaylist = playlist.map((t, i) => ({
    ...t,
    youtube: videoIds[i]
  }))
  fs.writeFile(playlistPath, JSON.stringify(enrichedPlaylist, null, 4), err => {
    if (err) {
      console.error(err)
    }
  })
}

youtube.getPlaylistItems(process.env.YOUTUBE_API_KEY, playlistId, enrichPlaylist)
