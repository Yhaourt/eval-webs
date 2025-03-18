import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ReservationInputType,
  ReservationType,
} from '../types/reservation.type';
import { Reservation } from '../entities/reservation.entity';

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  @Query(() => [ReservationType])
  async reservations(): Promise<Reservation[]> {
    return this.reservationRepo.find({
      relations: ['room', 'user'],
    });
  }

  @Query(() => ReservationType, { nullable: true })
  async reservation(@Args('id') id: string): Promise<Reservation> {
    return this.reservationRepo.findOneOrFail({
      where: { id },
      relations: ['room', 'user'],
    });
  }

  @Mutation(() => ReservationType)
  async createReservation(
    @Args('input') input: ReservationInputType,
  ): Promise<Reservation> {
    const newReservation = this.reservationRepo.create(input);
    const reservation = await this.reservationRepo.save(newReservation);
    return this.reservationRepo.findOneOrFail({
      where: { id: reservation.id },
      relations: ['room', 'user'],
    });
  }

  @Mutation(() => ReservationType)
  async updateReservation(
    @Args('id') id: string,
    @Args('input') input: ReservationInputType,
  ): Promise<Reservation> {
    await this.reservationRepo.update({ id }, input);
    return this.reservationRepo.findOneOrFail({
      where: { id },
      relations: ['room', 'user'],
    });
  }

  @Mutation(() => Boolean)
  async deleteReservation(@Args('id') id: string): Promise<boolean> {
    const reservation = await this.reservationRepo.findOneOrFail({
      where: { id },
      relations: ['room', 'user'],
    });
    await this.reservationRepo.remove(reservation);
    return true;
  }
}
