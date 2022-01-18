const https = require('https')

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const auth_code = process.env.SPOTIFY_AUTH_CODE

const options = {
  hostname: 'accounts.spotify.com',
  path: '/api/token',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(client_id + ':' + client_secret).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const data = encodeURI(`grant_type=authorization_code&code=${auth_code}&redirect_uri=http://localhost:8888/callback`)

const auth = async (callback) => {
  const req = https.request(options, res => {
    let json = ''
    res.on('data', chunk => {
      json += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        callback(JSON.parse(json).access_token)
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

module.exports = {
  auth
}