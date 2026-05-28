import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'Hong Gildong' })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({ example: 'gildong' })
  @IsString()
  @Length(1, 50)
  nickname!: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description: '최소 8자, 영문/숫자/특수문자 포함 권장',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain letters and numbers',
  })
  password!: string;
}
