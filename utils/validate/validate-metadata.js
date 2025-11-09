const fs = require('fs')
const spotifyAuth = require('../spotify/auth')
const spotify = require('../spotify/spotify')

const data = fs.readFileSync(`${process.env.GITHUB_WORKSPACE}/playlist.json`, 'utf8')
const playlist = JSON.parse(data)

const validateMetadata = tracks => {
  let hasErrors = false;
  for (const spotifyTrack of tracks) {
    const localTrack = playlist.find(t => t.id == spotifyTrack.id)
    const spotifyTrackArtists = spotifyTrack.artists.map(a => a.name).join(', ')
    if (localTrack.name != spotifyTrack.name || localTrack.artist != spotifyTrackArtists) {
      hasErrors = true
      console.log(`For song 'https://open.spotify.com/track/${spotifyTrack.id}' name per Spotify is '${spotifyTrack.name}' and artists are '${spotifyTrackArtists}'`)
    }
  }

  if (hasErrors) {
    throw new Error('Spotify metadata is not in sync. Please check errors above.')
  }
}


const validate = (token) => {
  spotify.getTracks(token, playlist.map(t => t.id), validateMetadata)
}

spotifyAuth.auth(validate)