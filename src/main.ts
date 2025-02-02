import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS (for frontend API access)
  app.enableCors();

  // ✅ Global Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove extra fields automatically
      forbidNonWhitelisted: true, // Throw error for extra fields
      transform: true, // Automatically transform types (DTOs)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ✅ Global Serialization Interceptor (Hides @Exclude() fields like password)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ✅ Enable API Versioning (Optional)
  app.enableVersioning();

  // ✅ Swagger API Configuration
  const config = new DocumentBuilder()
    .setTitle('NestJs Masterclass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  // ✅ Setup Swagger Module
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Start the server
  await app.listen(3000);
}
bootstrap();
