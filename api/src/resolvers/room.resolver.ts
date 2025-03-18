import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomInputType, RoomType } from '../types/room.type';
import { Room } from '../entities/room.entity';
import { UseGuards } from '@nestjs/common';
import { KeycloakAuthGuard } from '../auth/keycloak-auth-guard';

@Resolver(() => RoomType)
export class RoomResolver {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  @UseGuards(KeycloakAuthGuard)
  @Query(() => [RoomType])
  async rooms(): Promise<Room[]> {
    return this.roomRepo.find();
  }

  @Query(() => RoomType, { nullable: true })
  async room(@Args('id') id: string): Promise<Room> {
    return this.roomRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => RoomType)
  async createRoom(@Args('input') input: RoomInputType): Promise<Room> {
    const newRoom = this.roomRepo.create(input);
    const room = await this.roomRepo.save(newRoom);
    return this.roomRepo.findOneOrFail({ where: { id: room.id } });
  }

  @Mutation(() => RoomType)
  async updateRoom(
    @Args('id') id: string,
    @Args('input') input: RoomInputType,
  ): Promise<Room> {
    await this.roomRepo.update({ id }, input);
    return this.roomRepo.findOneByOrFail({ id });
  }

  @Mutation(() => Boolean)
  async deleteRoom(@Args('id') id: string): Promise<boolean> {
    const room = await this.roomRepo.findOneByOrFail({ id });
    await this.roomRepo.remove(room);
    return true;
  }
}
