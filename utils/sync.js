const fs = require('fs')
const spotify = require('./spotify')

const root = process.env.GITHUB_WORKSPACE
const PLAYLIST_ID = '3aMXF1tA7L1ml1XrEqpa0s'

const add = () => {
  const data = fs.readFileSync(`${root}/playlist.json`, 'utf8')
  const trackIds = JSON.parse(data).map(t => t.id)

  spotify.addTracksToPlaylist(AUTH_TOKEN, PLAYLIST_ID, trackIds, () => console.log('Playlist is synced.'))
}

const clear = tracks => {
  spotify.deleteTracksFromPlaylist(AUTH_TOKEN, PLAYLIST_ID, tracks.map(t => t.track.id), add)
}

const auth = fs.readFileSync(`${root}/auth.json`, 'utf8')
const AUTH_TOKEN = JSON.parse(auth).access_token
spotify.getPlaylistTracks(AUTH_TOKEN, PLAYLIST_ID, clear)
