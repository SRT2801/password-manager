export const ValidationMessages = {

  IS_NOT_EMPTY: 'The {field} field is required',
  IS_STRING: 'The {field} field must be a text string',
  MIN_LENGTH: 'The {field} field must have at least {length} characters',
  MAX_LENGTH: 'The {field} field cannot exceed {length} characters',


  EMAIL_INVALID: 'Invalid email format',


  PASSWORD_PATTERN:
    'The password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',


  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  SERVICE_NAME_REQUIRED: 'Service name is required',
  USERNAME_REQUIRED: 'Username is required',


  USER_REGISTERED: 'User registered successfully',
  PASSWORD_SAVED: 'Password saved successfully',
  PASSWORD_NOT_FOUND: 'Password not found',
  SESSION_CLOSED: 'Session closed successfully',


  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_ALREADY_EXISTS: 'A user with this email already exists',
  SESSION_EXPIRED: 'The session has expired or has been closed',
  INVALID_TOKEN: 'Invalid token format',
};

/**
 * Function to replace placeholders in messages
 * @param message The message with {field}, {length}, etc. placeholders
 * @param params Object with values to replace the placeholders
 */
export const formatMessage = (
  message: string,
  params?: Record<string, any>,
): string => {
  if (!params) return message;

  return Object.entries(params).reduce(
    (formattedMessage, [key, value]) =>
      formattedMessage.replace(new RegExp(`{${key}}`, 'g'), String(value)),
    message,
  );
};
