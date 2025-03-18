import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';
import { Notif } from './notif.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  roomId: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Room, (room) => room.reservations)
  room: Room;

  @OneToMany(() => Notif, (notif) => notif.reservation, {
    cascade: true,
    eager: true,
  })
  notifs: Notif[];
}
