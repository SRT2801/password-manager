import {
  IsOptional,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  ValidationMessages,
  formatMessage,
} from 'src/infrastructure/shared/constants/validation-messages.constants';

export class UpdatePasswordDto {
  @IsOptional()
  @IsString({
    message: formatMessage(ValidationMessages.IS_STRING, {
      field: 'service name',
    }),
  })
  @MaxLength(100, {
    message: formatMessage(ValidationMessages.MAX_LENGTH, {
      field: 'service name',
      length: 100,
    }),
  })
  serviceName?: string;

  @IsOptional()
  @IsString({
    message: formatMessage(ValidationMessages.IS_STRING, {
      field: 'username',
    }),
  })
  @MaxLength(100, {
    message: formatMessage(ValidationMessages.MAX_LENGTH, {
      field: 'username',
      length: 100,
    }),
  })
  userName?: string;

  @IsOptional()
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
  password?: string;
}
