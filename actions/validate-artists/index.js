const core = require('@actions/core')
const fs = require('fs')

const count = names =>
  names.reduce((a, b) => ({ ...a,
    [b]: (a[b] || 0) + 1
  }), {})

const duplicates = dict =>
  Object.keys(dict).filter((a) => dict[a] > 1)

try {
  let root = process.env.GITHUB_WORKSPACE

  const data = fs.readFileSync(`${root}/playlist.json`, 'utf8')
  const playlist = JSON.parse(data)

  const allArtists = playlist.map(t => t.artist.split(',')).flat()
  const duplicatedArtists = duplicates(count(allArtists))
  if (duplicatedArtists.length > 0) {
    throw new Error(`The following artists are duplicated in the playlist: ${duplicatedArtists.join(', ')}`)
  }
} catch (error) {
  core.setFailed(error.message)
}