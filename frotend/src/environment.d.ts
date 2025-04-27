interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly VITE_AUTH0_AUDIENCE: string
  readonly VITE_MONGODB_URI: string
  readonly VITE_JWT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}