import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { Reservation } from './entities/reservation.entity';
import { Notif } from './entities/notif.entity';
import { UserResolver } from './resolvers/user.resolver';
import { NotifResolver } from './resolvers/notif.resolver';
import { ReservationResolver } from './resolvers/reservation.resolver';
import { RoomResolver } from './resolvers/room.resolver';

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
  ],
  controllers: [],
  providers: [UserResolver, RoomResolver, ReservationResolver, NotifResolver],
})
export class AppModule {}
