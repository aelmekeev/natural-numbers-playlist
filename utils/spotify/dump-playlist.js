/**
 * This script allows to dump an existing spotify playlist to playlist.json in the repo root.
 * Usage: SPOTIFY_CLIENT_ID=<client id> SPOTIFY_CLIENT_SECRET=<client secret> node ./utils/spotify/dump-playlist.js <playlist id>
 */

const fs = require('fs')
const spotifyAuth = require('./auth')
const spotify = require('./spotify')
const utils = require('../utils')

const savePlaylist = data => {
  const tracks = data.map(i => utils.dehydrateTrack(i.track))
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