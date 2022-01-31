const https = require('https')

const baseOptions = () => ({
  hostname: 'youtube.googleapis.com',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})

const getPlaylistItems = (token, playlistId, callback, tracks = [], next = null) => {
  const LIMIT = 50

  const req = https.request({
    ...baseOptions(token),
    path: `/youtube/v3/playlistItems?part=contentDetails&maxResults=${LIMIT}&playlistId=${playlistId}&key=${token}${next ? `&pageToken=${next}` : ""}`
  }, res => {
    let json = ''

    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        const data = JSON.parse(json)

        const accumulatedTracks = tracks.concat(data.items)
        if (data.nextPageToken) {
          getPlaylistItems(token, playlistId, callback, accumulatedTracks, data.nextPageToken)
        } else {
          console.log(`Received ${accumulatedTracks.length} playlist items.`)
          callback(accumulatedTracks)
        }

      } else {
        throw new Error('Error while getting playlist items. Status: ', res.statusCode, ' ', JSON.stringify(JSON.parse(json), null, 2))
      }
    })
  })

  req.on('error', error => {
    // do nothing
  })
  req.end()
}

module.exports = {
  getPlaylistItems
}