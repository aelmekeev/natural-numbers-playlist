/**
 * This script allows to find tracks for a specific position.
 * Usage: SPOTIFY_CLIENT_ID=<client id> SPOTIFY_CLIENT_SECRET=<client secret> node ./utils/spotify/find-track.js <number to find track for>
 */
const config = require('./config')
const spotifyAuth = require('./auth')
const spotify = require('./spotify')
const spotifyUtils = require('./utils')
const utils = require('../utils')

let AUTH_TOKEN = ''
let tracks = []

const number = process.argv[2]
const numberAsText = utils.convertNumberToWords(number)
const dehydratedNumberAsText = utils.dehydrateTitle(numberAsText)

const dedupe = tracks => {
  const uniqueArtists = [...new Set(tracks.map(t => t.artists))];

  let dedupedTracks = []
  for (const uniqueArtist of uniqueArtists) {
    dedupedTracks.push(tracks.find(t => t.artists == uniqueArtist))
  }

  return dedupedTracks
}

const analyseResults = foundTracks => {
  tracks.push(...foundTracks)
  const filteredTracks = dedupe(tracks
    .map(t => ({
      id: t.id,
      name: t.name,
      popularity: t.popularity,
      artists: t.artists.map(a => a.id).join(',')
    }))
    .filter(t => t.popularity >= 25)
    .filter(t => [number, dehydratedNumberAsText].includes(utils.dehydrateTitle(t.name)))
    .sort((a, b) => b.popularity - a.popularity)
  )

  spotify.getArtists(AUTH_TOKEN, filteredTracks.flatMap(t => t.artists.split(',')), artists => {
    const popularArtists = artists.filter(a => a.popularity > config.popularityThreshold).map(a => a.id)

    if (popularArtists.length) {
      console.log('The following tracks were found:')
    }
    
    filteredTracks.map(track => {
      if (track.artists.split(',').every(a => popularArtists.includes(a))) {
        console.log(JSON.stringify(spotifyUtils.dehydrateTrack(tracks.find(t => t.id == track.id)), null, 2))
        console.log(`Link to track: https://open.spotify.com/track/${track.id}`)
      }
    })
  })
}

const searchForTracksWordVersion = foundTracks => {
  tracks.push(...foundTracks)
  spotify.searchForTracks(AUTH_TOKEN, numberAsText, analyseResults)
}

const searchForTracks = token => {
  AUTH_TOKEN = token
  spotify.searchForTracks(AUTH_TOKEN, number, searchForTracksWordVersion)
}

spotifyAuth.auth(searchForTracks)