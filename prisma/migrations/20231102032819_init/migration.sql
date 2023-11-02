-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" STRING NOT NULL,
    "token" STRING NOT NULL,
    "attempts" INT4 NOT NULL DEFAULT 0,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "users" (
    "id" STRING NOT NULL,
    "name" STRING,
    "username" STRING,
    "email" STRING,
    "email_verified" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incoming_feedback" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "contact_number" STRING,
    "subject" STRING NOT NULL,
    "feedback_detail" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "feedback_responded" BOOL NOT NULL DEFAULT false,
    "feedback_forwarded" BOOL NOT NULL DEFAULT false,
    "forwarded_agency" STRING,

    CONSTRAINT "incoming_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "incoming_feedback_feedback_responded_idx" ON "incoming_feedback"("feedback_responded");

-- CreateIndex
CREATE INDEX "incoming_feedback_feedback_forwarded_idx" ON "incoming_feedback"("feedback_forwarded");
