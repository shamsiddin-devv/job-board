const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { createServer } = require('node:net');
const { setTimeout: delay } = require('node:timers/promises');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');

test('WorkUZ API through PostgreSQL and the HTTP server', async (t) => {
  const database = new URL(process.env.DATABASE_URL);
  assert.match(database.pathname, /\/(?:workuz_ci|workuz_test_[a-z0-9]+)$/);
  const useRedis = process.env.WORKUZ_TEST_REDIS !== 'stub';
  assert.ok(process.env.REDIS_URL, 'Set an isolated test Redis URL');
  const { Test } = require('@nestjs/testing');
  const { getRedisConnectionToken } = require('@nestjs-modules/ioredis');
  const { AppModule } = require('../dist/src/app.module');
  const { configureApp } = require('../dist/src/main');
  const { PrismaService } = require('../dist/src/infrastructure/db/prisma/prisma.service');
  const { RedisOtpRepository } = require('../dist/src/infrastructure/db/repositories/RedisOtpRepository');
  const request = require('supertest');
  const inbox = new Map();

  const builder = Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider('INodeMailerService')
    .useValue({ send: async ({ to, text }) => inbox.set(to, text.match(/\b\d{6}\b/)[0]) });
  if (!useRedis) {
    const codes = new Map();
    builder.overrideProvider(getRedisConnectionToken()).useValue({ on() {}, ping: async () => 'PONG', quit: async () => {} });
    builder.overrideProvider('IOtpRepository').useValue({
      create: async (email, purpose, code) => (codes.set(purpose + email, code), true),
      consume: async (email, purpose, code) => {
        const key = purpose + email;
        if (!codes.has(key)) return 'expired';
        if (codes.get(key) !== code) return 'invalid';
        codes.delete(key);
        return 'verified';
      },
    });
  }
  const module = await builder.compile();
  const app = module.createNestApplication({ logger: ['error'] });
  t.after(() => app.close());
  configureApp(app);
  await app.init();
  const api = request(app.getHttpServer());
  const db = app.get(PrismaService);
  const email = (role) => role + '+' + randomUUID() + '@example.com';
  const password = 'workuz-test-password-123';
  const worker = email('worker');
  const company = email('company');
  const admin = email('admin');
  const as = (response, token) => response.set('Authorization', 'Bearer ' + token);
  const cookie = (response) => response.headers['set-cookie'][0].split(';')[0];
  const signup = (email, role) => api.post('/api/auth/register').send({ email, role, fullName: role, password }).expect(201);
  const verify = (email) => api.post('/api/auth/verify').send({ emailStr: email, inputCode: inbox.get(email) }).expect(200);
  const login = (email, value = password) => api.post('/api/auth/login').send({ email, password: value });
  const jobDetails = { title: 'NestJS engineer', description: 'Build APIs', city: 'Tashkent', postType: 'job', jobType: 'full_time', workFormat: 'remote', currency: 'UZS' };

  await api.get('/api/health/live').expect(200);
  await api.get('/api/health/ready').expect(200);
  await api.get('/api/jobs?page=-1').expect(400);
  await api.post('/api/auth/complete-oauth').send({ role: 'worker' }).expect(401);
  const oauth = await api.get('/api/auth/google').expect(302);
  assert.ok(new URL(oauth.headers.location).searchParams.get('state'));
  assert.match(oauth.headers['set-cookie'][0], /HttpOnly/);

  if (useRedis) {
    const repository = new RedisOtpRepository(app.get(getRedisConnectionToken()));
    const address = email('otp');
    assert.equal(await repository.create(address, 'email_verify', '123456'), true);
    assert.equal(await repository.create(address, 'email_verify', '345678'), false);
    for (let attempt = 0; attempt < 5; attempt++) {
      assert.equal(await repository.consume(address, 'email_verify', '111111'), 'invalid');
    }
    assert.equal(await repository.consume(address, 'email_verify', '123456'), 'expired');
  }
  await signup(worker, 'worker');
  await login(worker).expect(401);
  const verified = await verify(worker);
  assert.equal(verified.body.user.email, worker);
  const workerLogin = await login(worker).expect(200);
  const workerToken = workerLogin.body.accessToken;
  await as(api.get('/api/admin/stats'), workerToken).expect(403);
  await signup(company, 'company');
  await verify(company);
  const companyToken = (await login(company).expect(200)).body.accessToken;
  await signup(admin, 'worker');
  await verify(admin);
  await db.user.update({ where: { email: admin }, data: { role: 'ADMIN' } });
  const adminToken = (await login(admin).expect(200)).body.accessToken;
  await as(api.get('/api/admin/stats'), adminToken).expect(200);

  await as(api.post('/api/companies'), companyToken).send({ name: 'WorkUZ test company' }).expect(201);
  const companyUser = await db.user.findUniqueOrThrow({ where: { email: company }, include: { company: true } });
  await as(api.post('/api/jobs'), companyToken).send(jobDetails).expect(403);
  await as(api.patch('/api/companies/' + companyUser.company.id + '/verify'), adminToken).expect(200);
  await api.get('/api/companies').expect(200);
  await as(api.post('/api/jobs'), companyToken).send(jobDetails).expect(201);
  const job = await db.job.findFirstOrThrow({ where: { userId: companyUser.id } });
  const detail = await api.get('/api/jobs/' + job.id).expect(200);
  assert.equal(detail.body.description, jobDetails.description);
  assert.equal(detail.body.city, jobDetails.city);
  await as(api.patch('/api/jobs/' + job.id), companyToken).send({ description: 'Updated', jobType: 'part_time', salaryMin: 0 }).expect(200);
  const updated = await api.get('/api/jobs/' + job.id).expect(200);
  assert.equal(updated.body.description, 'Updated');
  assert.equal(updated.body.jobType, 'part_time');
  assert.equal(updated.body.salaryRange.min, 0);
  assert.equal(updated.body.viewsCount, 2);
  const list = await api.get('/api/jobs?city=Tashkent').expect(200);
  assert.equal(list.body.total, 1);

  await as(api.post('/api/resumes'), workerToken).send({ title: 'Backend engineer', currency: 'UZS' }).expect(201);
  await as(api.get('/api/resumes/me'), workerToken).expect(200);
  await as(api.post('/api/resumes/upload'), workerToken).expect(400);
  await as(api.patch('/api/resumes/close'), workerToken).expect(200);
  assert.equal((await api.get('/api/resumes').expect(200)).body.total, 0);

  await as(api.post('/api/saved-jobs/' + job.id), workerToken).expect(201);
  assert.equal((await as(api.get('/api/saved-jobs'), workerToken).expect(200)).body.total, 1);
  await as(api.delete('/api/saved-jobs/' + job.id), workerToken).expect(200);
  assert.equal((await as(api.get('/api/saved-jobs'), workerToken).expect(200)).body.total, 0);
  await as(api.post('/api/jobs/' + job.id + '/apply'), workerToken).send({ coverLetter: 'My application' }).expect(201);
  await as(api.post('/api/jobs/' + job.id + '/apply'), workerToken).send({}).expect(409);
  const application = await db.application.findFirstOrThrow({ where: { jobId: job.id } });
  await as(api.patch('/api/applications/' + application.id + '/reject'), workerToken).expect(403);
  await as(api.patch('/api/applications/' + application.id + '/reject'), companyToken).expect(200);
  assert.equal((await db.notification.findFirstOrThrow({ where: { userId: application.applicantId } })).type, 'APPLICATION_REJECTED');
  await as(api.get('/api/notifications'), workerToken).expect(200);
  await as(api.patch('/api/notifications/read-all'), workerToken).expect(200);
  await as(api.patch('/api/jobs/' + job.id + '/close'), companyToken).expect(200);
  await api.get('/api/jobs/' + job.id).expect(404);
  assert.equal((await api.get('/api/jobs?status=closed').expect(200)).body.total, 0);

  await as(api.post('/api/jobs'), companyToken).send({ ...jobDetails, title: 'Second vacancy' }).expect(201);
  const secondJob = await db.job.findFirstOrThrow({ where: { title: 'Second vacancy' } });
  await as(api.post('/api/jobs/' + secondJob.id + '/apply'), workerToken).send({}).expect(201);
  const secondApplication = await db.application.findFirstOrThrow({ where: { jobId: secondJob.id } });
  const decide = (action) => as(api.patch('/api/applications/' + secondApplication.id + '/' + action), companyToken);
  const decisions = await Promise.all([decide('accept'), decide('accept')]);
  assert.deepEqual(decisions.map((entry) => entry.status).sort(), [200, 409]);
  assert.equal(await db.notification.count({ where: { userId: application.applicantId, type: 'APPLICATION_ACCEPTED' } }), 1);

  const refresh = () => api.post('/api/auth/refresh').set('Cookie', cookie(workerLogin));
  const rotations = await Promise.all([refresh(), refresh()]);
  assert.deepEqual(rotations.map((entry) => entry.status).sort(), [200, 401]);
  await api.post('/api/auth/forgot-password').send({ email: worker }).expect(200);
  const reset = await api.post('/api/auth/verify-reset-otp').send({ emailStr: worker, inputCode: inbox.get(worker) }).expect(200);
  const resetRequest = { resetToken: reset.body.resetToken, newPassword: 'new-workuz-test-password-123' };
  await api.post('/api/auth/reset-password').send(resetRequest).expect(200);
  await api.post('/api/auth/reset-password').send(resetRequest).expect(401);
  await login(worker).expect(401);
  const newLogin = await login(worker, resetRequest.newPassword).expect(200);
  const deactivated = await as(api.patch('/api/admin/users/' + application.applicantId + '/deactivate'), adminToken).expect(200);
  assert.deepEqual(deactivated.body, { id: application.applicantId, isActive: false });
  await as(api.get('/api/auth/me'), newLogin.body.accessToken).expect(401);
});

test('production entry point serves health and hides Swagger', async (t) => {
  const port = await new Promise((resolve, reject) => {
    const socket = createServer().once('error', reject);
    socket.listen(0, '127.0.0.1', () => {
      const address = socket.address();
      socket.close(() => resolve(address.port));
    });
  });
  const useRedis = process.env.WORKUZ_TEST_REDIS !== 'stub';
  const child = spawn(process.execPath, ['dist/src/main.js'], {
    stdio: 'ignore',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(port),
      FRONTEND_URL: 'https://frontend.workuz.test',
      REDIS_URL: useRedis ? process.env.REDIS_URL : 'redis://127.0.0.1:1',
    },
  });
  t.after(() => child.kill());
  const base = 'http://127.0.0.1:' + port;
  const get = (path, options = {}) => fetch(base + path, { ...options, signal: AbortSignal.timeout(5000) });
  let response;
  for (let attempt = 0; attempt < 50; attempt++) {
    if (child.exitCode !== null) throw new Error('Production API exited before serving traffic.');
    try {
      response = await get('/api/health/live');
      break;
    } catch {
      await delay(200);
    }
  }
  assert.equal(response?.status, 200);
  assert.equal((await get('/api/health/ready')).status, useRedis ? 200 : 503);
  assert.equal((await get('/api-docs')).status, 404);
  assert.equal((await get('/api/health/live', { headers: { Origin: 'http://localhost:5173' } })).headers.get('access-control-allow-origin'), null);
  assert.equal((await get('/api/health/live', { headers: { Origin: 'https://frontend.workuz.test' } })).headers.get('access-control-allow-origin'), 'https://frontend.workuz.test');
});
