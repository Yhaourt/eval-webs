import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { RoomType } from './room.type';
import { UserType } from './user.type';
import { NotifType } from './notif.type';

@ObjectType()
export class ReservationType {
  @Field(() => ID) id: string;
  @Field() roomId: string;
  @Field() userId: string;
  @Field() startTime: Date;
  @Field() endTime: Date;
  @Field() status: string;
  @Field() createdAt: Date;
  @Field(() => RoomType) room: RoomType;
  @Field(() => UserType) user: UserType;
  @Field(() => [NotifType]) notifs: [NotifType];
}

@InputType()
export class ReservationInputType {
  @Field() roomId: string;
  @Field() userId: string;
  @Field() startTime: Date;
  @Field() endTime: Date;
  @Field() status: string;
}
