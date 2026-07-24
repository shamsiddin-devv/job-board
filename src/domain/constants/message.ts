export const AUTH_MESSAGES = {
  // Authentication
  REGISTER_SUCCESS: 'Account created successfully.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logout successful.',

  // User
  USER_NOT_FOUND: 'User not found.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  PHONE_ALREADY_EXISTS: 'Phone number already exists.',
  ACCOUNT_INACTIVE: 'Your account is inactive.',
  ACCOUNT_ALREADY_VERIFIED: 'Your account is already verified.',

  // Credentials
  INVALID_CREDENTIALS: 'Invalid email or password.',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password.',
  PASSWORD_CHANGED: 'Password changed successfully.',

  // Email
  EMAIL_REQUIRED: 'Email is required.',
  INVALID_EMAIL: 'Invalid email address.',
  EMAIL_NOT_FOUND: 'Email not found.',
  EMAIL_VERIFIED: 'Email verified successfully.',

  // OTP
  OTP_SENT: 'A verification code has been sent to your email.',
  OTP_INVALID: 'Invalid verification code.',
  OTP_EXPIRED: 'Verification code has expired.',
  OTP_ALREADY_USED: 'Verification code has already been used.',
  OTP_VERIFIED: 'Verification code verified successfully.',
  OTP_RESENT: 'A new verification code has been sent.',
  OTP_NOT_FOUND_OR_EXPIRED: 'OTP not found or expired.',

  // Token
  ACCESS_TOKEN_EXPIRED: 'Access token has expired.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required.',
  REFRESH_TOKEN_INVALID: 'Invalid refresh token.',
  REFRESH_TOKEN_EXPIRED: 'Refresh token has expired.',
  REFRESH_TOKEN_REVOKED: 'Refresh token has been revoked.',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found.',
  REFRESH_TOKEN_EXPIRED_OR_REVOKED: 'Refresh token expired or revoked.',
  REFRESH_SUCCESS: 'Access token refreshed successfully.',

  // Authorization
  UNAUTHORIZED: 'Unauthorized.',
  FORBIDDEN: 'You do not have permission to perform this action.',

  // Validation
  INVALID_ROLE: 'Invalid role.',
  INVALID_REQUEST: 'Invalid request.',
  VALIDATION_FAILED: 'Validation failed.',

  // Common
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred.',
} as const;

export const USER_MESSAGES = {
  NAME_REQUIRED: 'Name is required.',
  USER_ID_REQUIRED: 'User ID is required.',

  ALREADY_APPROVED: 'User has already been approved.',
  ALREADY_INACTIVE: 'User is already inactive.',
  ALREADY_ACTIVE: 'User is already active.',

  USER_INACTIVE: 'Your account is inactive.',
} as const;

export const JOB_MESSAGES = {
  JOB_CREATED: 'Job created successfully.',
  JOB_UPDATED: 'Job updated successfully.',
  JOB_DELETED: 'Job deleted successfully.',

  JOB_NOT_FOUND: 'Job not found.',

  TITLE_REQUIRED: 'Job title is required.',
  DESCRIPTION_REQUIRED: 'Job description is required.',
  USER_ID_REQUIRED: 'User ID is required.',

  SALARY_NEGATIVE: 'Salary cannot be negative.',
  SALARY_HIGHER: 'Minimum salary cannot be greater than maximum salary.',

  JOB_ALREADY_CLOSED: 'Job is already closed.',
  JOB_CLOSED: 'This job is closed.',
  CLOSED_CANNOT_BE_DRAFTED: 'A closed job cannot be moved to draft.',
  CLOSED_CANNOT_BE_REPUBLISHED: 'A closed job cannot be republished.',

  USER_NOT_FOUND: 'User not found.',

  ONLY_COMPANIES_CAN_POST_JOBS: 'Only company accounts can post jobs.',
  COMPANY_VERIFICATION_REQUIRED: 'Your company must be verified before posting jobs.',
  ONLY_WORKERS_CAN_POST_RESUMES: 'Only worker accounts can post resumes.',

  TITLE_MUST_BE_EMPTY: 'Title must be empty.',
  CITY_MUST_BE_EMPTY: 'City mus be empty.',
  JOB_ACCESS_DENIED: 'You do not have permission to modify this job.',
} as const;

export const APPLICATION_MESSAGES = {
  APPLICATION_SUBMITTED: 'Application submitted successfully.',
  APPLICATION_UPDATED: 'Application updated successfully.',
  APPLICATION_WITHDRAWN: 'Application withdrawn successfully.',

  APPLICATION_NOT_FOUND: 'Application not found.',

  JOB_ID_REQUIRED: 'Job ID is required.',
  APPLICANT_ID_REQUIRED: 'Applicant ID is required.',

  ALREADY_APPLIED: 'You have already applied for this job.',
  JOB_CLOSED: 'This job is closed. Applications are no longer accepted.',

  ONLY_PENDING_CAN_BE_REVIEWED: 'Only pending applications can be reviewed.',

  APPLICATION_ALREADY_ACCEPTED: 'Application has already been accepted.',
  REJECTED_CANNOT_BE_ACCEPTED: 'A rejected application cannot be accepted.',

  APPLICATION_ALREADY_REJECTED: 'Application has already been rejected.',
  ACCEPTED_CANNOT_BE_REJECTED: 'An accepted application cannot be rejected.',
} as const;

export const COMPANY_MESSAGES = {
  NAME_REQUIRED: 'Company name is required.',
  USER_ID_REQUIRED: 'User ID is required.',

  WEBSITE_REQUIRED: 'Website is required.',
  INVALID_WEBSITE: 'Website must start with https://',

  COMPANY_NOT_FOUND: 'Company not found.',

  COMPANY_ALREADY_VERIFIED: 'Company has already been verified.',
  COMPANY_NOT_VERIFIED: 'Company is not verified.',
} as const;

export const CATEGORY_MESSAGES = {
  NAME_REQUIRED: 'Category name is required.',
  SLUG_REQUIRED: 'Slug is required.',

  CATEGORY_NOT_FOUND: 'Category not found.',
  CATEGORY_ALREADY_EXISTS: 'Category already exists.',
} as const;

export const RESUME_MESSAGES = {
  TITLE_REQUIRED: 'Title is required.',
  USER_ID_REQUIRED: 'User ID is required.',
  FILE_URL_REQUIRED: 'File URL is required.',

  RESUME_NOT_FOUND: 'Resume not found.',

  RESUME_ALREADY_ACTIVE: 'Resume is already active.',
  RESUME_ALREADY_CLOSED: 'Resume is already closed.',
  RESUME_ALREADY_DRAFT: 'Resume is already in draft.',

  CLOSED_RESUME_CANNOT_BE_DRAFTED: 'A closed resume cannot be moved to draft.',
} as const;

export const SAVED_JOB_MESSAGES = {
  USER_ID_REQUIRED: 'User ID is required.',
  JOB_ID_REQUIRED: 'Job ID is required.',

  SAVED_SUCCESSFULLY: 'Job saved successfully.',
  REMOVED_SUCCESSFULLY: 'Saved job removed successfully.',

  JOB_ALREADY_SAVED: 'Job has already been saved.',
  JOB_NOT_SAVED: 'Job is not saved.',
} as const;

export const REFRESH_TOKEN_MESSAGES = {
  USER_ID_REQUIRED: 'User ID is required.',
  TOKEN_REQUIRED: 'Refresh token is required.',

  INVALID_TOKEN: 'Invalid refresh token.',
  TOKEN_EXPIRED: 'Refresh token has expired.',
  TOKEN_REVOKED: 'Refresh token has been revoked.',
} as const;

export const OTP_MESSAGES = {
  USER_ID_REQUIRED: 'User ID is required.',

  OTP_SENT: 'A verification code has been sent to your email.',
  OTP_INVALID: 'Invalid verification code.',
  OTP_EXPIRED: 'Verification code has expired.',
  OTP_ALREADY_USED: 'Verification code has already been used.',
  OTP_VERIFIED: 'Verification code verified successfully.',
} as const;

export const NOTIFICATION_MESSAGES = {
  USER_ID_REQUIRED: 'User ID is required.',
  MESSAGE_REQUIRED: 'Message is required.',

  NOTIFICATION_NOT_FOUND: 'Notification not found.',
  NOTIFICATION_ALREADY_READ: 'Notification has already been marked as read.',
} as const;
