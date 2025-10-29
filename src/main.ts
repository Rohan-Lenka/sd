import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import mongoose from 'mongoose';
//mongoose.set('debug', true);

async function bootstrap() {
  // admin.initializeApp({
  //   credential: admin.credential.applicationDefault(),
  // });

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');

  const app = await NestFactory.create(AppModule);
  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisIoAdapter);

  // app.enableCors({
  //   origin: [
  //     '[http://localhost:8082](http://localhost:8082)',
  //     '[https://dev.api.skribe.app](https://dev.api.skribe.app)',
  //   ],
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  //   credentials: true,
  // });

  app.enableCors({ origin: '*' });
  await app.listen(3030);
}

bootstrap();
