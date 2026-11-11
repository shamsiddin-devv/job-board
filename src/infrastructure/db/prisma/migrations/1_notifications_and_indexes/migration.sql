ALTER TYPE "NotificationType" ADD VALUE 'APPLICATION_REJECTED';
ALTER TYPE "NotificationType" ADD VALUE 'COMPANY_VERIFIED';

CREATE INDEX "refresh_tokens_userId_isRevoked_idx" ON "refresh_tokens"("userId", "isRevoked");
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");
CREATE INDEX "jobs_status_createdAt_idx" ON "jobs"("status", "createdAt");
CREATE INDEX "jobs_userId_createdAt_idx" ON "jobs"("userId", "createdAt");
CREATE INDEX "applications_applicantId_appliedAt_idx" ON "applications"("applicantId", "appliedAt");
CREATE INDEX "resumes_userId_idx" ON "resumes"("userId");
CREATE INDEX "resumes_status_createdAt_idx" ON "resumes"("status", "createdAt");
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt");
