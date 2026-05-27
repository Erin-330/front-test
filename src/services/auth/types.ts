export interface LoginRequest {
  email: string
  password: string
  grant_type: 'password'
}

export interface LoginUser {
  user_id: number
  email: string
  name: string
  profile_image?: string
}

export interface LoginSuccessData {
  access_token: string
  refresh_token: string
  expires_in: number
  user: LoginUser
}

export interface LoginSuccessResponse {
  status: 'success'
  data: LoginSuccessData
  message: string
}

export interface ValidationFieldError {
  field: string
  reason: string
}

export interface LoginErrorResponse {
  status: 'error'
  code: string
  message: string
  errors?: ValidationFieldError[]
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse

export type LoginFailureKind =
  | 'validation'
  | 'invalid_credentials'
  | 'account_locked'
  | 'network'
  | 'unknown'

export interface LoginFailure {
  kind: LoginFailureKind
  code: string
  message: string
  errors?: ValidationFieldError[]
  httpStatus?: number
}
