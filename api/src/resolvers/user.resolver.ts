import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInputType, UserType } from '../types/user.type';
import { User } from '../entities/user.entity';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Query(() => [UserType])
  async users(): Promise<User[]> {
    return this.userRepo.find();
  }

  @Query(() => UserType, { nullable: true })
  async user(@Args('id') id: string): Promise<User> {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: UserInputType): Promise<User> {
    const newUser = this.userRepo.create(input);
    const user = await this.userRepo.save(newUser);
    return this.userRepo.findOneOrFail({ where: { id: user.id } });
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UserInputType,
  ): Promise<User> {
    await this.userRepo.update({ id }, input);
    return this.userRepo.findOneByOrFail({ id });
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    const user = await this.userRepo.findOneByOrFail({ id });
    await this.userRepo.remove(user);
    return true;
  }
}
