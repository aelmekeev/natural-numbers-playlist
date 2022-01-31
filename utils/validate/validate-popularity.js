const fs = require('fs')
const spotifyAuth = require('../spotify/auth')
const spotify = require('../spotify/spotify')
const config = require('../spotify/config')

AUTH_TOKEN = ''

const validatePopularity = artists => {
  let hasErrors = false;
  for (const artist of artists) {
    if (artist.popularity < config.popularityThreshold) {
      hasErrors = true
      console.log(`Artist '${artist.name}' has a Spotify popularity of ${artist.popularity}.`)
    }
  }

  if (hasErrors) {
    throw new Error('Playlist is breaking popularity rule. Please check errors above.')
  }
}

const getArtists = tracks => {
  tracks = tracks.filter(t => t != null)
  const artistsIds = tracks.flatMap(t => t.artists).map(a => a.id)
  spotify.getArtists(AUTH_TOKEN, artistsIds, validatePopularity)
}

const validate = token => {
  const data = fs.readFileSync(`${process.env.GITHUB_WORKSPACE}/playlist.json`, 'utf8')
  const playlist = JSON.parse(data)

  spotify.getTracks(token, playlist.map(t => t.id), getArtists)
}

spotifyAuth.auth(token => {
  AUTH_TOKEN = token
  validate(AUTH_TOKEN)
})