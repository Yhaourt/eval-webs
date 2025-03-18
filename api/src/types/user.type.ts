import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ReservationType } from './reservation.type';

@ObjectType()
export class UserType {
  @Field(() => ID) id: string;
  @Field() keycloack_id: string;
  @Field() email: string;
  @Field() created_at: Date;
  @Field(() => [ReservationType]) reservations: [ReservationType];
}

@InputType()
export class UserInputType {
  @Field() keycloack_id: string;
  @Field() email: string;
}
