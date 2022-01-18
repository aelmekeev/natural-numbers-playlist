const fs = require('fs')
const spotifyAuth = require('../auth')
const spotify = require('../spotify')

let root = process.env.GITHUB_WORKSPACE

const data = fs.readFileSync(`${root}/playlist.json`, 'utf8')
const playlist = JSON.parse(data)

const validateMetadata = (trackIds, tracks) => {
  tracks = tracks.filter(t => t != null)
  if (trackIds.length != tracks.length) {
    const missingTracksIds = trackIds.filter(tId => !tracks.map(t => t.id).includes(tId));
    throw new Error(`Not all the tracks can be found in Spotify. Missing tracks ids: ${missingTracksIds.join(', ')}`)
  }

  let batchHasErrors = false;
  for (const trackId of trackIds) {
    const localTrack = playlist.find(t => t.id == trackId)
    const spotifyTrack = tracks.find(t => t.id == trackId)
    const spotifyTrackArtists = spotifyTrack.artists.reduce((acc, cur) => acc + cur.name, '')
    if (localTrack.name != spotifyTrack.name || localTrack.artist != spotifyTrackArtists) {
      batchHasErrors = true
      console.log(`For song 'https://open.spotify.com/track/${trackId}' name per Spotify is '${spotifyTrack.name}' and artists are '${spotifyTrackArtists}'`)
    }
  }

  if (batchHasErrors) {
    throw new Error('Spotify metadata is not in sync. Please check errors above.')
  }
}


const validate = (token) => {
  for (let i = 0; i < Math.ceil(playlist.length / 50); i++) {
    spotify.getTracks(token, playlist.map(t => t.id).slice(50 * i, 50 * (i + 1)), validateMetadata)
  }
}

spotifyAuth.auth(validate)