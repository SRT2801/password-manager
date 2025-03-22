import { IsNotEmpty, IsString } from 'class-validator';

export class SavePasswordDto {
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}