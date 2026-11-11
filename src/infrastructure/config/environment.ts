import Joi from 'joi';

const url = (...scheme: string[]) => Joi.string().uri({ scheme }).required();
const jwtDuration = Joi.string().pattern(/^[1-9]\d{0,5}[smhd]$/);
const secret = Joi.string().min(32).required();

export const environmentSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(4000),
  DATABASE_URL: url('postgres', 'postgresql'),
  REDIS_URL: url('redis', 'rediss'),
  FRONTEND_URL: Joi.string().custom((value: string, helpers) => {
    const valid = value.split(',').every((origin) => {
      try {
        const parsed = new URL(origin.trim());
        const production = helpers.state.ancestors[0]?.NODE_ENV === 'production';
        return (parsed.protocol === 'https:' || (!production && parsed.protocol === 'http:')) &&
          !parsed.username && !parsed.password && parsed.pathname === '/' && !parsed.search && !parsed.hash;
      } catch {
        return false;
      }
    });
    return valid ? value : helpers.error('any.invalid');
  }).when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.optional().default('http://localhost:5173') }),
  ACCESS_TOKEN_SECRET: secret,
  REFRESH_TOKEN_SECRET: secret.invalid(Joi.ref('ACCESS_TOKEN_SECRET')),
  RESET_TOKEN_SECRET: secret.invalid(Joi.ref('ACCESS_TOKEN_SECRET'), Joi.ref('REFRESH_TOKEN_SECRET')),
  ACCESS_TOKEN_TIME: jwtDuration.default('15m'),
  REFRESH_TOKEN_TIME: Joi.string().valid('30d').default('30d'),
  RESET_TOKEN_TIME: jwtDuration.default('3m'),
  SALT_ROUNDS: Joi.number().integer().min(10).max(15).default(12),
  SMTP_HOST: Joi.string().hostname().optional(),
  SMTP_PORT: Joi.number().integer().min(1).max(65535).default(587),
  SMTP_USER: Joi.string().optional(),
  SMTP_EMAIL: Joi.string().email({ tlds: false }).required(),
  SMTP_PASS: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: url('http', 'https'),
  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
  GITHUB_CALLBACK_URL: url('http', 'https'),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
}).unknown();
