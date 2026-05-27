import crypto from 'node:crypto'
import jwt, { type SignOptions } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me'
const EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN ?? 3600)

export interface AccessTokenPayload {
  sub: number
  email: string
}

export interface IssuedTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export function issueTokens(payload: AccessTokenPayload): IssuedTokens {
  const options: SignOptions = { expiresIn: EXPIRES_IN, algorithm: 'HS256' }
  const access_token = jwt.sign(payload, SECRET, options)
  const refresh_token = crypto.randomBytes(32).toString('hex')
  return { access_token, refresh_token, expires_in: EXPIRES_IN }
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as AccessTokenPayload
    return decoded
  } catch {
    return null
  }
}
