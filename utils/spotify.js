const https = require('https')

const baseOptions = token => ({
  hostname: 'api.spotify.com',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
})

const getTracks = (token, trackIds, callback) => {
  const req = https.request({
    ...baseOptions(token),
    path: `/v1/tracks?ids=${trackIds.join(',')}`
  }, res => {
    let json = ''

    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        let data = JSON.parse(json)
        callback(trackIds, data.tracks)
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

const getPlaylist = (token, playlistId, callback) => {
  const req = https.request({
    ...baseOptions(token),
    path: `/v1/playlists/${playlistId}`
  }, res => {
    let json = ''

    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        callback(JSON.parse(json))
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

module.exports = {
  getTracks,
  getPlaylist,
  // deleteTracks,
  // addTracks
}