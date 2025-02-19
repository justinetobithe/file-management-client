import { MAX_FILE_SIZE } from './constants';

export const strings = {
  validation: {
    required: 'This field is required',
    min_age: 'Minum age must be 16 or older',
    max_image_size: `Max image size is ${MAX_FILE_SIZE}MB.`,
    allowed_image_formats: 'Only .jpg, .jpeg and .png formats are supported.',
    password_min_characters: 'Password must be at least 6 characters',
    password_confirmation: "Passwords doesn't match",
    invalid_datetime: 'Invalid Datetime',
    invalid_type: 'Invalid Value',
  },
};
