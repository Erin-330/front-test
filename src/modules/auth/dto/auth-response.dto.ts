export class AuthUserDto {
  id!: number;
  email!: string;
  displayName?: string | null;
  role!: string;
}

export class AuthResponseDto {
  accessToken!: string;
  tokenType!: string;
  expiresIn!: string;
  user!: AuthUserDto;
}
