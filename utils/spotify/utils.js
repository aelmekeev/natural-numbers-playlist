const dehydrateTrack = track => ({
  id: track.id,
  name: track.name,
  artist: track.artists.map(a => a.name).join(', ')
})

module.exports = {
  dehydrateTrack
}