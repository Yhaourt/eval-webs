import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { Reservation } from './entities/reservation.entity';
import { Notif } from './entities/notif.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pguser',
      password: 'pgpass',
      database: 'pgdb',
      entities: [User, Room, Reservation, Notif],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Room, Reservation, Notif]), 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

