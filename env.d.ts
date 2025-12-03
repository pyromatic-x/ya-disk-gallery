declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_CONNECTION_STRING: string
    MONGO_DATABASE_NAME: string
    YANDEX_TOKEN: string
    FOLDER_PATH: string
    TELEGRAM_BOT_NAME: string
    TELEGRAM_BOT_TOKEN: string
    TELEGRAM_BOT_CHAT: string
  }
}
