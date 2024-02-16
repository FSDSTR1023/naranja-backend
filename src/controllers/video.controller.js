import { AccessToken } from 'livekit-server-sdk'
import 'dotenv/config'

const apiKey = process.env.LIVEKIT_API_KEY
const apiSecret = process.env.LIVEKIT_API_SECRET
const wsUrl = process.env.PUBLIC_LIVEKIT_URL

export const videoRequest = (req, res) => {
  const { room, username } = req.params
  console.log('room', room)
  console.log('username', username)

  if (!room) {
    res.json({ error: 'Missing "room" query parameter' }, { status: 400 })
  } else if (!username) {
    res.json({ error: 'Missing "username" query parameter' }, { status: 400 })
  }

  if (!apiKey || !apiSecret || !wsUrl) {
    res.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: username })

  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  })

  res.json({ videoToken: at.toJwt() })
}
