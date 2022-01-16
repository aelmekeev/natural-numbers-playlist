const https = require('https')

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET

const options = {
  hostname: 'accounts.spotify.com',
  path: '/api/token',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(client_id + ':' + client_secret).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const data = encodeURI('grant_type=client_credentials')

const req = https.request(options, res => {
  res.on('data', res => {
    process.stdout.write(JSON.parse(res).access_token)
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()