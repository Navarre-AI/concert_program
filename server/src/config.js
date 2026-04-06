export const config = {
  port: parseInt(process.env.PORT || '3001'),
  host: process.env.HOST || '0.0.0.0',

  // FileMaker Data API (Phase 2)
  fm: {
    host: process.env.FM_HOST || 'https://your-fm-server.com',
    database: process.env.FM_DATABASE || 'ConcertProgram',
    username: process.env.FM_USERNAME || '',
    password: process.env.FM_PASSWORD || ''
  },

  // JWT secret for admin auth
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
