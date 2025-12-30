import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Songix API',
      version: '1.0.0',
      description:
        'Backend API для приложения Songix с поддержкой коллекций и JWT авторизацией',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'HttpOnly cookie с access токеном',
        },
      },
    },
  },
  apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts', 'README.md'],
})
