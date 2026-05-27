import bcrypt from 'bcryptjs'

export interface User {
  user_id: number
  email: string
  name: string
  profile_image: string
  passwordHash: string
}

const TEST_PASSWORD = 'Test1234!'

const users: User[] = [
  {
    user_id: 1,
    email: 'test@reliant.com',
    name: '테스트 사용자',
    profile_image: 'https://cdn.reliant.com/profiles/1.jpg',
    // Generated on startup so the hash is fresh per process.
    passwordHash: bcrypt.hashSync(TEST_PASSWORD, 10),
  },
]

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase()
  return users.find((u) => u.email.toLowerCase() === normalized)
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash)
}

export function publicUser(user: User) {
  return {
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    profile_image: user.profile_image,
  }
}
