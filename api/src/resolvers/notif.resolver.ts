import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotifInputType, NotifType } from '../types/notif.type';
import { Notif } from 'src/entities/notif.entity';

@Resolver(() => NotifType)
export class NotifResolver {
  constructor(
    @InjectRepository(Notif)
    private readonly notifRepo: Repository<Notif>,
  ) {}

  @Query(() => [NotifType])
  async notifs(): Promise<Notif[]> {
    return this.notifRepo.find({
      relations: ['reservation'],
    });
  }

  @Query(() => NotifType, { nullable: true })
  async notif(@Args('id') id: string): Promise<Notif> {
    return this.notifRepo.findOneOrFail({
      where: { id },
      relations: ['reservation'],
    });
  }

  @Mutation(() => NotifType)
  async createNotif(@Args('input') input: NotifInputType): Promise<Notif> {
    const newNotif = this.notifRepo.create(input);
    const notif = await this.notifRepo.save(newNotif);
    return this.notifRepo.findOneOrFail({
      where: { id: notif.id },
      relations: ['reservation'],
    });
  }

  @Mutation(() => NotifType)
  async updateNotif(
    @Args('id') id: string,
    @Args('input') input: NotifInputType,
  ): Promise<Notif> {
    await this.notifRepo.update({ id }, input);
    return this.notifRepo.findOneOrFail({
      where: { id },
      relations: ['reservation'],
    });
  }

  @Mutation(() => Boolean)
  async deleteNotif(@Args('id') id: string): Promise<boolean> {
    const notif = await this.notifRepo.findOneOrFail({
      where: { id },
      relations: ['reservation'],
    });
    await this.notifRepo.remove(notif);
    return true;
  }
}
