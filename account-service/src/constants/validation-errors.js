/**
 * Описание: файл с константами ошибок валидации
 */

export const POSSIBLE_VALIDATION_CODES = {
  validation_required_field: 'valid.required_field',
  validation_is_number_field: 'valid.is_number_field',
  validation_is_contains_only_numbers_field: 'valid.is_contains_only_numbers',
  validation_is_boolean_field: 'valid.is_boolean_field',
  validation_conflict_fields: 'valid.conflict_fields',
  validation_min_length: 'valid.min_length',
  validation_max_length: 'valid.max_length',
  validation_min_value: 'valid.min_value',
  validation_max_value: 'valid.max_value',
  validation_invalid_email_format: 'valid.invalid_email_format',
  validation_invalid_password_format: 'valid.invalid_password_format',
  validation_invalid_phone_format: 'valid.invalid_phone_format',
  validation_invalid_date_format: 'valid.invalid_date_format',
  validation_invalid_field_format: 'valid.invalid_field_format',
  validation_unique_input_error: 'valid.unique_input_error',
  validation_reference_input_error: 'valid.reference_input_error',
  validation_array_min_length: 'valid.array_min_length',
  validation_array_max_length: 'valid.array_max_length',
  validation_entity_not_exists: 'valid.entity_not_exists',
  validation_data_flow_error: 'valid.data_flow_error',
  validation_file_format_error: 'valid.file_format_error',
};

export const VALIDATION_ERRORS = {
  requiredField: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_required_field,
    errorMessage: `Field "${field}" is required`,
  }),
  isNumber: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_is_number_field,
    errorMessage: `Field "${field}" must be a number`,
  }),
  invalidEmailFormat: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_invalid_email_format,
    errorMessage: 'Invalid email format',
  }),
  isInvalidPasswordFormat: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_invalid_password_format,
    errorMessage: 'Invalit password format.'
			+ 'Password must include at least one digit, at least one latin letter in an upper case,'
			+ 'at least one latin letter in a lower case and contain at least 8 characters',
  }),
};
