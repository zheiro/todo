import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

// Firebase Admin SDK configuration
const adminConfig = {
  credential: admin.credential.cert('./firebase.json'),
  databaseURL: 'https://to-do-app-be7a1-default-rtdb.firebaseio.com/',
};

// Initialize Firebase Admin SDK
admin.initializeApp(adminConfig);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Todo')
    .setDescription('Your own personal todo list')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();