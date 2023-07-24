-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('OFFLINE', 'ONLINE', 'IDLE', 'DO_NOT_DISTURB', 'INVISIBLE', 'GAME');

-- CreateEnum
CREATE TYPE "RegistrationState" AS ENUM ('NOT_AUTHENTICATED', 'OK', 'PENDING_DESTROY', 'ANONIMIZED');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "otp_key" TEXT NOT NULL,
    "nick" VARCHAR(30) NOT NULL,
    "avatar_key" TEXT NOT NULL,
    "loggedin_session" INTEGER,
    "active_status" "ActiveStatus" NOT NULL,
    "active_recent_timestamp" TIMESTAMP(3) NOT NULL,
    "registration_state" "RegistrationState" NOT NULL,
    "registration_timestamp" TIMESTAMP(3) NOT NULL,
    "creation_timestamp" TIMESTAMP(3) NOT NULL,
    "is_operator" BOOLEAN NOT NULL,
    "email_address" TEXT NOT NULL,
    "status_message" TEXT NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts_game" (
    "account_id" INTEGER NOT NULL,
    "game_statistics" JSONB NOT NULL,
    "win_count" INTEGER NOT NULL,
    "lose_count" INTEGER NOT NULL,
    "tie_count" INTEGER NOT NULL,
    "skill_rating" INTEGER NOT NULL,

    CONSTRAINT "accounts_game_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "friend" (
    "account_id" INTEGER NOT NULL,
    "friend_account_id" INTEGER NOT NULL,
    "group_name" TEXT NOT NULL,
    "active_flag" INTEGER NOT NULL,

    CONSTRAINT "friend_pkey" PRIMARY KEY ("account_id","friend_account_id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "account_id" INTEGER NOT NULL,
    "achievement_id" INTEGER NOT NULL,
    "completed_timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("account_id","achievement_id")
);

-- CreateTable
CREATE TABLE "enemies" (
    "account_id" INTEGER NOT NULL,
    "enemy_account_id" INTEGER NOT NULL,
    "memo" TEXT NOT NULL,

    CONSTRAINT "enemies_pkey" PRIMARY KEY ("account_id","enemy_account_id")
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "mode_flag" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_members" (
    "chat_rooms_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "mode_flag" INTEGER NOT NULL,

    CONSTRAINT "chat_members_pkey" PRIMARY KEY ("chat_rooms_id","account_id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "chat_rooms_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "mode_flag" INTEGER NOT NULL,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("chat_rooms_id","account_id","timestamp")
);

-- CreateTable
CREATE TABLE "chat_bans" (
    "id" SERIAL NOT NULL,
    "chat_rooms_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "manager_account_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "expire_datetime" TIMESTAMP(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "memo" TEXT NOT NULL,

    CONSTRAINT "chat_bans_pkey" PRIMARY KEY ("id","chat_rooms_id","account_id","manager_account_id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "expire_datetime" TIMESTAMP(3) NOT NULL,
    "attribute_flag" INTEGER NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bans" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "manager_account_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "expire_datetime" TIMESTAMP(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "memo" TEXT NOT NULL,

    CONSTRAINT "bans_pkey" PRIMARY KEY ("id","account_id","manager_account_id")
);

-- CreateTable
CREATE TABLE "game_queue" (
    "account_id" INTEGER NOT NULL,
    "skill_rating" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_queue_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "server_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "game_mode" INTEGER NOT NULL,
    "field_id" INTEGER NOT NULL,
    "states" JSONB NOT NULL,
    "statistics" JSONB NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_members" (
    "account_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "options" JSONB NOT NULL,
    "statistics" JSONB,

    CONSTRAINT "game_members_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "game_history" (
    "id" SERIAL NOT NULL,
    "game_mode" INTEGER NOT NULL,
    "field_id" INTEGER NOT NULL,
    "statistics" JSONB NOT NULL,
    "members_statistics" JSONB NOT NULL,

    CONSTRAINT "game_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "signupVerifyToken" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_accountsTogame_history" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_accountsTogame_history_AB_unique" ON "_accountsTogame_history"("A", "B");

-- CreateIndex
CREATE INDEX "_accountsTogame_history_B_index" ON "_accountsTogame_history"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_loggedin_session_fkey" FOREIGN KEY ("loggedin_session") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts_game" ADD CONSTRAINT "accounts_game_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_friend_account_id_fkey" FOREIGN KEY ("friend_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enemies" ADD CONSTRAINT "enemies_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enemies" ADD CONSTRAINT "enemies_enemy_account_id_fkey" FOREIGN KEY ("enemy_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_chat_rooms_id_fkey" FOREIGN KEY ("chat_rooms_id") REFERENCES "chat_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_rooms_id_fkey" FOREIGN KEY ("chat_rooms_id") REFERENCES "chat_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_bans" ADD CONSTRAINT "chat_bans_chat_rooms_id_fkey" FOREIGN KEY ("chat_rooms_id") REFERENCES "chat_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_bans" ADD CONSTRAINT "chat_bans_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_bans" ADD CONSTRAINT "chat_bans_manager_account_id_fkey" FOREIGN KEY ("manager_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bans" ADD CONSTRAINT "bans_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bans" ADD CONSTRAINT "bans_manager_account_id_fkey" FOREIGN KEY ("manager_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_queue" ADD CONSTRAINT "game_queue_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_members" ADD CONSTRAINT "game_members_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_members" ADD CONSTRAINT "game_members_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_accountsTogame_history" ADD CONSTRAINT "_accountsTogame_history_A_fkey" FOREIGN KEY ("A") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_accountsTogame_history" ADD CONSTRAINT "_accountsTogame_history_B_fkey" FOREIGN KEY ("B") REFERENCES "game_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
