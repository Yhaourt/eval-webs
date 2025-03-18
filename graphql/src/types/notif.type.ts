import {Field, ID, InputType, ObjectType} from '@nestjs/graphql';
import { ReservationType } from './reservation.type';

@ObjectType()
export class NotifType {
  @Field(() => ID) id: string;
  @Field() reservationId: string;
  @Field() message: string;
  @Field() notificationDate: Date;
  @Field() isSent: boolean;
  @Field() createdAt: Date;
  @Field(() => ReservationType) reservation: ReservationType;
}

@InputType()
export class NotifInputType {
  @Field() reservationId: string;
  @Field() message: string;
  @Field() notificationDate: Date;
  @Field() isSent: boolean;
}
