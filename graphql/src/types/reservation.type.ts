import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { RoomType } from './room.type';
import { UserType } from './user.type';
import { NotifType } from './notif.type';

@ObjectType()
export class ReservationType {
  @Field(() => ID) id: string;
  @Field() room_id: string;
  @Field() user_id: string;
  @Field() start_time: Date;
  @Field() end_time: Date;
  @Field() status: string;
  @Field() created_at: Date;
  @Field(() => RoomType) room: RoomType;
  @Field(() => UserType) user: UserType;
  @Field(() => [NotifType]) notifs: [NotifType];
}

@InputType()
export class ReservationInputType {
  @Field() room_id: string;
  @Field() user_id: string;
  @Field() start_time: Date;
  @Field() end_time: Date;
  @Field() status: string;
}
