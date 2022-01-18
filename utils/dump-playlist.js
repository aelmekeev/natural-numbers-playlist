/**
 * This script allows to dump an existing spotify playlist to playlist.json in the repo root.
 * Usage: SPOTIFY_CLIENT_ID=<client id> SPOTIFY_CLIENT_SECRET=<client secret> node ./utils/dump-playlist.js <playlist id>
 */

const fs = require('fs')
const spotifyAuth = require('./auth')
const spotify = require('./spotify')

const savePlaylist = data => {
  const tracks = data.map(i => ({
    id: i.track.id,
    name: i.track.name,
    artist: i.track.artists.reduce((acc, cur) => acc + cur.name, '')
  }))
  fs.writeFile('./playlist.json', JSON.stringify(tracks, null, 4), err => {
    if (err) {
      console.error(err)
    }
  })
}

const dumpPlaylist = token => {
  spotify.getPlaylistTracks(token, process.argv[2], savePlaylist)
}

spotifyAuth.auth(dumpPlaylist)