/*
  Warnings:

  - You are about to drop the `Accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikedPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Accounts" DROP CONSTRAINT "Accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "LikedPosts" DROP CONSTRAINT "LikedPosts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "LikedPosts" DROP CONSTRAINT "LikedPosts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_parent_post_id_fkey";

-- DropTable
DROP TABLE "Accounts";

-- DropTable
DROP TABLE "LikedPosts";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

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

    CONSTRAINT "incoming_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "incoming_feedback_feedback_responded_idx" ON "incoming_feedback"("feedback_responded");

-- CreateIndex
CREATE INDEX "incoming_feedback_feedback_forwarded_idx" ON "incoming_feedback"("feedback_forwarded");
