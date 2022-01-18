const fs = require('fs')
const https = require('https')

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const authFile = `${process.env.GITHUB_WORKSPACE}/auth.json`

const refreshAuthToken = refreshToken => {
  const data = encodeURI(`grant_type=refresh_token&refresh_token=${refreshToken}`)

  const options = {
    hostname: 'accounts.spotify.com',
    path: '/api/token',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(client_id + ':' + client_secret).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const req = https.request(options, res => {
    let json = ''
    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        let auth = JSON.parse(json)
        if (!auth.refresh_token) {
          auth.refresh_token = refreshToken
        }
        fs.writeFile(authFile, JSON.stringify(auth, null, 2), err => {
          if (err) { console.error(err) }
        })
      } else {
        console.error('Error during auth. Status: ', res.statusCode, ' ', JSON.stringify(JSON.parse(json), null, 2))
      }
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.write(data)
  req.end()
}

try {
  const auth = fs.readFileSync(authFile, 'utf8')
  refreshAuthToken(JSON.parse(auth).refresh_token)
} catch {
  console.log('Unable to read the cached auth.json.')
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
  if (refreshToken) {
    refreshAuthToken(refreshToken)
  } else {
    throw new Error('Unable to refresh the token.')
  }
}


// TODO