const https = require('https')

const baseHeaders = token => ({
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
})

const baseOptions = token => ({
  hostname: 'api.spotify.com',
  method: 'GET',
  headers: baseHeaders(token)
})

const getTracks = (token, trackIds, callback, tracks = []) => {
  const LIMIT = 50

  const requestedTracksIds = trackIds.slice(0, LIMIT)
  const req = https.request({
    ...baseOptions(token),
    path: `/v1/tracks?ids=${requestedTracksIds.join(',')}`
  }, res => {
    let json = ''

    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        let data = JSON.parse(json)

        if (requestedTracksIds.length != data.tracks.length) {
          const missingTracksIds = requestedTracksIds.filter(tId => !data.tracks.map(t => t.id).includes(tId));
          throw new Error(`Not all the tracks can be found in Spotify. Missing tracks ids: ${missingTracksIds.join(', ')}`)
        }

        const accumulatedTracks = tracks.concat(data.tracks)
        if (trackIds.length > requestedTracksIds.length) {
          getTracks(token, trackIds.slice(LIMIT), callback, accumulatedTracks)
        } else {
          console.log(`Received ${accumulatedTracks.length} tracks.`)
          callback(accumulatedTracks)
        }
      } else {
        throw new Error('Error while getting tracks. Status: ', res.statusCode, ' ', JSON.stringify(JSON.parse(json), null, 2))
      }
    })
  })

  req.on('error', error => {
    // do nothing
  })
  req.end()
}

const getArtists = (token, artistIds, callback, artists = []) => {
  const LIMIT = 50

  const requestedArtistsIds = artistIds.slice(0, LIMIT)
  const req = https.request({
    ...baseOptions(token),
    path: `/v1/artists?ids=${requestedArtistsIds.join(',')}`
  }, res => {
    let json = ''

    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        let data = JSON.parse(json)

        if (requestedArtistsIds.length != data.artists.length) {
          const missingArtistsIds = requestedArtistsIds.filter(aId => !data.artists.map(t => t.id).includes(aId));
          throw new Error(`Not all the artists were found in Spotify. Missing artist ids: ${missingArtistsIds.join(', ')}`)
        }      

        const accumulatedArtists = artists.concat(data.artists)
        if (artistIds.length > requestedArtistsIds.length) {
          getArtists(token, artistIds.slice(LIMIT), callback, accumulatedArtists)
        } else {
          console.log(`Received ${accumulatedArtists.length} artists.`)
          callback(accumulatedArtists)
        }
      } else {
        console.error('Error while getting artists. Status: ', res.statusCode, ' ', JSON.stringify(JSON.parse(json), null, 2))
      }
    })
  })

  req.on('error', error => {
    // do nothing
  })
  req.end()
}

const getPlaylistTracks = (token, playlistId, callback, tracks = [], next = null) => {
  const LIMIT = 50

  const req = https.request({
    ...baseOptions(token),
    path: next ? next : `/v1/playlists/${playlistId}/tracks?fields=items(track(id,name,artists(id,name))),next`
  }, res => {
    let json = ''

    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        const data = JSON.parse(json)

        const accumulatedTracks = tracks.concat(data.items)
        if (data.next) {
          getPlaylistTracks(token, playlistId, callback, accumulatedTracks, data.next)
        } else {
          console.log(`Received ${accumulatedTracks.length} tracks.`)
          callback(accumulatedTracks)
        }
      } else {
        throw new Error('Error while getting playlist tracks. Status: ', res.statusCode, ' ', JSON.stringify(JSON.parse(json), null, 2))
      }
    })
  })

  req.on('error', error => {
    // do nothing
  })
  req.end()
}

const deleteTracksFromPlaylist = (token, playlistId, trackIds, callback) => {
  const LIMIT = 100

  const data = JSON.stringify({
    tracks: trackIds.slice(0, LIMIT).map(t => ({
      uri: `spotify:track:${t}`
    }))
  })

  const req = https.request({
    ...baseOptions(token),
    path: `/v1/playlists/${playlistId}/tracks`,
    method: 'DELETE',
    headers: {
      ...baseHeaders(token),
      'Content-Length': data.length
    }
  }, res => {
    let json = ''

    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        const moreTracks = trackIds.slice(LIMIT)
        if (moreTracks.length) {
          deleteTracksFromPlaylist(token, playlistId, moreTracks, callback)
        } else {
          callback()
        }
      } else {
        throw new Error('Error while deleting tracks from playlist. Status: ', res.statusCode, ' ', JSON.stringify(JSON.parse(json), null, 2))
      }
    })
  })

  req.on('error', error => {
    // do nothing
  })
  req.write(data)
  req.end()
}


const addTracksToPlaylist = (token, playlistId, trackIds, callback) => {
  const LIMIT = 100

  const data = JSON.stringify({
    uris: trackIds.slice(0, LIMIT).map(t => `spotify:track:${t}`)
  })

  const req = https.request({
    ...baseOptions(token),
    path: `/v1/playlists/${playlistId}/tracks`,
    method: 'POST'
  }, res => {
    let json = ''

    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 201) {
        const moreTracks = trackIds.slice(LIMIT)
        if (moreTracks.length) {
          addTracksToPlaylist(token, playlistId, moreTracks, callback)
        } else {
          callback()
        }
      } else {
        throw new Error('Error while adding tracks to playlist. Status: ', res.statusCode, ' ', JSON.stringify(JSON.parse(json), null, 2))
      }
    })
  })

  req.on('error', error => {
    // do nothing
  })
  req.write(data)
  req.end()
}

module.exports = {
  getTracks,
  getArtists,
  getPlaylistTracks,
  deleteTracksFromPlaylist,
  addTracksToPlaylist
}