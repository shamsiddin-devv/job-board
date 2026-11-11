import { environmentSchema } from './environment';

const config = {
  DATABASE_URL: 'postgresql://user:pass@localhost/workuz',
  REDIS_URL: 'redis://localhost:6379',
  ACCESS_TOKEN_SECRET: 'A'.repeat(40),
  REFRESH_TOKEN_SECRET: 'B'.repeat(40),
  RESET_TOKEN_SECRET: 'C'.repeat(40),
  SMTP_EMAIL: 'workuz@example.com',
  SMTP_PASS: 'test',
  GOOGLE_CLIENT_ID: 'test',
  GOOGLE_CLIENT_SECRET: 'test',
  GOOGLE_CALLBACK_URL: 'https://api.example.com/api/auth/google/callback',
  GITHUB_CLIENT_ID: 'test',
  GITHUB_CLIENT_SECRET: 'test',
  GITHUB_CALLBACK_URL: 'https://api.example.com/api/auth/github/callback',
  CLOUDINARY_CLOUD_NAME: 'test',
  CLOUDINARY_API_KEY: 'test',
  CLOUDINARY_API_SECRET: 'test',
};

test('uses local defaults and rejects shared signing secrets', () => {
  const result = environmentSchema.validate(config);
  expect(result.error).toBeUndefined();
  expect(result.value.PORT).toBe(4000);
  expect(result.value.FRONTEND_URL).toBe('http://localhost:5173');
  expect(environmentSchema.validate({ ...config, RESET_TOKEN_SECRET: config.ACCESS_TOKEN_SECRET }).error).toBeDefined();
});

test('requires an explicit frontend origin in production', () => {
  expect(environmentSchema.validate({ ...config, NODE_ENV: 'production' }).error).toBeDefined();
  expect(environmentSchema.validate({
    ...config, NODE_ENV: 'production', FRONTEND_URL: 'https://workuz.example.com',
  }).error).toBeUndefined();
});
