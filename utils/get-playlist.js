const https = require('https')

const token = process.env.SPOTIFY_TOKEN
const playlistId = process.env.SPOTIFY_PLAYLIST_ID

const options = {
  hostname: 'api.spotify.com',
  path: `/v1/playlists/${playlistId}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
}

const req = https.request(options, res => {
  let json = '';

  res.on('data', chunk => {
    json += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      let data = JSON.parse(json);
      process.stdout.write(JSON.stringify(data.tracks.items.map(i => ({
        id: i.track.id,
        name: i.track.name,
        artist: i.track.artists.reduce((acc, cur) => acc + cur.name, '')
      }))), null, 2)
    } else {
      console.log('Error. Status: ', res.statusCode);
    }
  });
})

req.on('error', error => {
  // do nothing
})

req.end()