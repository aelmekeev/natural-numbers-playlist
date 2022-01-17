const fs = require('fs')
const spotifyAuth = require('./auth')
const spotify = require('./spotify')

const root = process.env.GITHUB_WORKSPACE

const PLAYLIST_ID = '3aMXF1tA7L1ml1XrEqpa0s'
let AUTH_TOKEN = ''

const data = fs.readFileSync(`${root}/playlist.json`, 'utf8')
const playlist = JSON.parse(data)

const add = (tracks = playlist.map(t => t.id)) => {
  if (tracks.length) {
    spotify.addTracks(AUTH_TOKEN, PLAYLIST_ID, tracks, () => console.log('Playlist is synced.'))
  }
}

const clear = tracks => {
  if (tracks.length) {
    spotify.deleteTracks(AUTH_TOKEN, PLAYLIST_ID, tracks.map(t => t.id), get)
  } else {
    add(AUTH_TOKEN, PLAYLIST_ID)
  }
}

const get = () => {
  spotify.getPlaylist(AUTH_TOKEN, PLAYLIST_ID, clear)
}

const sync = token => {
  AUTH_TOKEN = token
  get(AUTH_TOKEN)
}

spotifyAuth.auth(sync)