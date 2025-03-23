import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import {
  ValidationMessages,
  formatMessage,
} from 'src/infrastructure/shared/constants/validation-messages.constants';

export class RegisterUserDto {
  @IsNotEmpty({ message: ValidationMessages.EMAIL_REQUIRED })
  @IsEmail({}, { message: ValidationMessages.EMAIL_INVALID })
  email: string;

  @IsNotEmpty({ message: ValidationMessages.PASSWORD_REQUIRED })
  @IsString({
    message: formatMessage(ValidationMessages.IS_STRING, {
      field: 'password',
    }),
  })
  @MinLength(8, {
    message: formatMessage(ValidationMessages.MIN_LENGTH, {
      field: 'password',
      length: 8,
    }),
  })
  @MaxLength(100, {
    message: formatMessage(ValidationMessages.MAX_LENGTH, {
      field: 'password',
      length: 100,
    }),
  })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message: ValidationMessages.PASSWORD_PATTERN,
  })
  password: string;

  @IsOptional()
  @IsString({
    message: formatMessage(ValidationMessages.IS_STRING, {
      field: 'first name',
    }),
  })
  @MaxLength(100, {
    message: formatMessage(ValidationMessages.MAX_LENGTH, {
      field: 'first name',
      length: 100,
    }),
  })
  firstName?: string;

  @IsOptional()
  @IsString({
    message: formatMessage(ValidationMessages.IS_STRING, {
      field: 'last name',
    }),
  })
  @MaxLength(100, {
    message: formatMessage(ValidationMessages.MAX_LENGTH, {
      field: 'last name',
      length: 100,
    }),
  })
  lastName?: string;
}
