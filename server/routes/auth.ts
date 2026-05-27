import { Router, type Request, type Response } from 'express'
import { validateLoginPayload } from '../lib/validation.js'
import { findUserByEmail, publicUser, verifyPassword } from '../lib/users.js'
import { issueTokens } from '../lib/jwt.js'
import { clearAttempts, isLocked, recordFailure } from '../lib/lockout.js'

function clientIp(req: Request): string {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim()
  return req.ip ?? req.socket.remoteAddress ?? 'unknown'
}

export const authRouter: Router = Router()

authRouter.post('/login', async (req: Request, res: Response) => {
  const ip = clientIp(req)

  const lock = isLocked(ip)
  if (lock.locked) {
    res.setHeader('Retry-After', String(lock.retryAfterSec))
    return res.status(429).json({
      status: 'error',
      code: 'AUTH_002',
      message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
    })
  }

  const { payload, errors, firstMessage } = validateLoginPayload(req.body)
  if (!payload) {
    return res.status(400).json({
      status: 'error',
      code: 'VALID_001',
      message: firstMessage ?? '입력값이 올바르지 않습니다.',
      errors,
    })
  }

  const user = findUserByEmail(payload.email)
  const ok = user ? await verifyPassword(user, payload.password) : false

  if (!user || !ok) {
    recordFailure(ip)
    return res.status(401).json({
      status: 'error',
      code: 'AUTH_001',
      message: '이메일 또는 비밀번호가 일치하지 않습니다.',
    })
  }

  clearAttempts(ip)
  const tokens = issueTokens({ sub: user.user_id, email: user.email })

  return res.status(200).json({
    status: 'success',
    data: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      user: publicUser(user),
    },
    message: '로그인에 성공했습니다.',
  })
})

// Stubs preserved so the existing GitHub OAuth surface keeps a stable URL space.
// Wire real Passport.js handlers here when GitHub credentials are configured.
authRouter.get('/github/login', (_req, res) => {
  res.status(501).json({
    status: 'error',
    code: 'AUTH_NOT_CONFIGURED',
    message: 'GitHub OAuth is not configured in this environment.',
  })
})

authRouter.get('/github/callback', (_req, res) => {
  res.status(501).json({
    status: 'error',
    code: 'AUTH_NOT_CONFIGURED',
    message: 'GitHub OAuth is not configured in this environment.',
  })
})
