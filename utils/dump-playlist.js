/**
 * This script allows to dump an existing spotify playlist to playlist.json in the repo root.
 * Usage: SPOTIFY_CLIENT_ID=<client id> SPOTIFY_CLIENT_SECRET=<client secret> node ./utils/dump-playlist.js <playlist id>
 */

const fs = require('fs')
const https = require('https')
const spotifyAuth = require('../utils/auth')

dumpPlaylist = token => {
  const options = {
    hostname: 'api.spotify.com',
    path: `/v1/playlists/${process.argv[2]}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  }

  const req = https.request(options, res => {
    let json = ''

    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        let data = JSON.parse(json)
        const playlist = data.tracks.items.map(i => ({
          id: i.track.id,
          name: i.track.name,
          artist: i.track.artists.reduce((acc, cur) => acc + cur.name, '')
        }))
        fs.writeFile('./playlist.json', JSON.stringify(playlist, null, 2), err => {
          if (err) {
            console.error(err)
          }
        })
      } else {
        console.error('Error. Status: ', res.statusCode)
      }
    })
  })

  req.on('error', error => {
    // do nothing
  })
  req.end()
}

spotifyAuth.auth(dumpPlaylist)