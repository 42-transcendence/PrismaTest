-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "resources_test";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "services_test";

-- CreateEnum
CREATE TYPE "services_test"."role" AS ENUM ('USER', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "services_test"."registration_state" AS ENUM ('REGISTERING', 'REGISTERED', 'UNREGISTERING', 'UNREGISTERED');

-- CreateEnum
CREATE TYPE "services_test"."active_status" AS ENUM ('OFFLINE', 'ONLINE', 'IDLE', 'DO_NOT_DISTURB', 'INVISIBLE', 'GAME');

-- CreateTable
CREATE TABLE "services_test"."accounts" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "authIssuer" INTEGER NOT NULL,
    "authSubject" VARCHAR(256) NOT NULL,
    "otpSecret" VARCHAR(512),
    "createdTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrationState" "services_test"."registration_state" NOT NULL DEFAULT 'REGISTERING',
    "nickName" TEXT,
    "nickTag" INTEGER NOT NULL DEFAULT 0,
    "avatarKey" VARCHAR(512),
    "role" "services_test"."role" NOT NULL DEFAULT 'USER',
    "activeStatus" "services_test"."active_status" NOT NULL DEFAULT 'OFFLINE',
    "activeTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusMessage" TEXT NOT NULL DEFAULT '',
    "currentGameDeviceId" INTEGER,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."authorizations" (
    "id" TEXT NOT NULL,
    "endpointKey" TEXT NOT NULL,
    "redirectURI" TEXT NOT NULL,
    "createdTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authorizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."sessions" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "predecessorId" INTEGER,
    "isValid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."devices" (
    "id" SERIAL NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "createdTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedTimestamp" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."records" (
    "accountId" INTEGER NOT NULL,
    "skillRating" INTEGER NOT NULL DEFAULT 0,
    "winCount" INTEGER NOT NULL DEFAULT 0,
    "loseCount" INTEGER NOT NULL DEFAULT 0,
    "tieCount" INTEGER NOT NULL DEFAULT 0,
    "gameStatistics" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "records_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "services_test"."achievements" (
    "accountId" INTEGER NOT NULL,
    "achievementId" INTEGER NOT NULL,
    "completedTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("accountId","achievementId")
);

-- CreateTable
CREATE TABLE "services_test"."friends" (
    "accountId" INTEGER NOT NULL,
    "friendAccountId" INTEGER NOT NULL,
    "groupName" TEXT NOT NULL,
    "activeFlags" INTEGER NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("accountId","friendAccountId")
);

-- CreateTable
CREATE TABLE "services_test"."enemies" (
    "accountId" INTEGER NOT NULL,
    "enemyAccountId" INTEGER NOT NULL,
    "memo" TEXT NOT NULL,

    CONSTRAINT "enemies_pkey" PRIMARY KEY ("accountId","enemyAccountId")
);

-- CreateTable
CREATE TABLE "services_test"."bans" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "managerAccountId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "memo" TEXT NOT NULL,
    "expireTimestamp" TIMESTAMP(3),
    "bannedTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."chats" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "modeFlags" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."chat_members" (
    "chatId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "modeFlags" INTEGER NOT NULL,

    CONSTRAINT "chat_members_pkey" PRIMARY KEY ("chatId","accountId")
);

-- CreateTable
CREATE TABLE "services_test"."chat_messages" (
    "id" BIGSERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "modeFlags" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."chat_bans" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "managerAccountId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "memo" TEXT NOT NULL,
    "expireTimestamp" TIMESTAMP(3),
    "bannedTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_bans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."games" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "modeFlags" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "battlefield" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statistic" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."game_members" (
    "gameId" BIGINT NOT NULL,
    "accountId" INTEGER NOT NULL,
    "modeFlags" INTEGER NOT NULL,
    "statistic" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "game_members_pkey" PRIMARY KEY ("gameId","accountId")
);

-- CreateTable
CREATE TABLE "services_test"."game_queue" (
    "accountId" INTEGER NOT NULL,
    "skillRating" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "services_test"."game_history" (
    "id" BIGINT NOT NULL,
    "uuid" UUID NOT NULL,
    "modeFlags" INTEGER NOT NULL,
    "battlefield" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "statistic" JSONB NOT NULL DEFAULT '{}',
    "memberStatistics" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "game_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_test"."_AccountsDevices" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "services_test"."_AccountToGameHistory" (
    "A" INTEGER NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_uuid_key" ON "services_test"."accounts"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_currentGameDeviceId_key" ON "services_test"."accounts"("currentGameDeviceId");

-- CreateIndex
CREATE INDEX "accounts_nickName_nickTag_idx" ON "services_test"."accounts"("nickName", "nickTag");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_authIssuer_authSubject_key" ON "services_test"."accounts"("authIssuer", "authSubject");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "services_test"."sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_predecessorId_key" ON "services_test"."sessions"("predecessorId");

-- CreateIndex
CREATE UNIQUE INDEX "devices_fingerprint_key" ON "services_test"."devices"("fingerprint");

-- CreateIndex
CREATE INDEX "devices_updatedTimestamp_idx" ON "services_test"."devices"("updatedTimestamp");

-- CreateIndex
CREATE INDEX "records_skillRating_idx" ON "services_test"."records"("skillRating" ASC);

-- CreateIndex
CREATE INDEX "records_gameStatistics_idx" ON "services_test"."records" USING GIN ("gameStatistics" jsonb_ops);

-- CreateIndex
CREATE UNIQUE INDEX "chats_uuid_key" ON "services_test"."chats"("uuid");

-- CreateIndex
CREATE INDEX "chat_messages_timestamp_idx" ON "services_test"."chat_messages" USING BRIN ("timestamp" timestamp_minmax_ops);

-- CreateIndex
CREATE UNIQUE INDEX "games_uuid_key" ON "services_test"."games"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "games_code_key" ON "services_test"."games"("code");

-- CreateIndex
CREATE UNIQUE INDEX "game_members_accountId_key" ON "services_test"."game_members"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "game_queue_accountId_key" ON "services_test"."game_queue"("accountId");

-- CreateIndex
CREATE INDEX "game_queue_skillRating_idx" ON "services_test"."game_queue"("skillRating");

-- CreateIndex
CREATE INDEX "game_queue_timestamp_idx" ON "services_test"."game_queue"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "game_history_uuid_key" ON "services_test"."game_history"("uuid");

-- CreateIndex
CREATE INDEX "game_history_timestamp_idx" ON "services_test"."game_history" USING BRIN ("timestamp" timestamp_minmax_ops);

-- CreateIndex
CREATE INDEX "game_history_statistic_idx" ON "services_test"."game_history" USING GIN ("statistic" jsonb_ops);

-- CreateIndex
CREATE INDEX "game_history_memberStatistics_idx" ON "services_test"."game_history" USING GIN ("memberStatistics" jsonb_ops);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountsDevices_AB_unique" ON "services_test"."_AccountsDevices"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountsDevices_B_index" ON "services_test"."_AccountsDevices"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToGameHistory_AB_unique" ON "services_test"."_AccountToGameHistory"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToGameHistory_B_index" ON "services_test"."_AccountToGameHistory"("B");

-- AddForeignKey
ALTER TABLE "services_test"."accounts" ADD CONSTRAINT "accounts_currentGameDeviceId_fkey" FOREIGN KEY ("currentGameDeviceId") REFERENCES "services_test"."devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."sessions" ADD CONSTRAINT "sessions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."sessions" ADD CONSTRAINT "sessions_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "services_test"."sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."records" ADD CONSTRAINT "records_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."achievements" ADD CONSTRAINT "achievements_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."records"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."friends" ADD CONSTRAINT "friends_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."friends" ADD CONSTRAINT "friends_friendAccountId_fkey" FOREIGN KEY ("friendAccountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."enemies" ADD CONSTRAINT "enemies_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."enemies" ADD CONSTRAINT "enemies_enemyAccountId_fkey" FOREIGN KEY ("enemyAccountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."bans" ADD CONSTRAINT "bans_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."bans" ADD CONSTRAINT "bans_managerAccountId_fkey" FOREIGN KEY ("managerAccountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."chat_members" ADD CONSTRAINT "chat_members_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "services_test"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."chat_members" ADD CONSTRAINT "chat_members_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."chat_messages" ADD CONSTRAINT "chat_messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "services_test"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."chat_messages" ADD CONSTRAINT "chat_messages_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."chat_bans" ADD CONSTRAINT "chat_bans_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."chat_bans" ADD CONSTRAINT "chat_bans_managerAccountId_fkey" FOREIGN KEY ("managerAccountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."game_members" ADD CONSTRAINT "game_members_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "services_test"."games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."game_members" ADD CONSTRAINT "game_members_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."game_queue" ADD CONSTRAINT "game_queue_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services_test"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."_AccountsDevices" ADD CONSTRAINT "_AccountsDevices_A_fkey" FOREIGN KEY ("A") REFERENCES "services_test"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."_AccountsDevices" ADD CONSTRAINT "_AccountsDevices_B_fkey" FOREIGN KEY ("B") REFERENCES "services_test"."devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."_AccountToGameHistory" ADD CONSTRAINT "_AccountToGameHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "services_test"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_test"."_AccountToGameHistory" ADD CONSTRAINT "_AccountToGameHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "services_test"."game_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
