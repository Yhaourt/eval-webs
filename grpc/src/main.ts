import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        protoPath: join(__dirname, './protos/notification.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );

  await app.listen();
  console.log('gRPC microservice is running...');
}
bootstrap();
