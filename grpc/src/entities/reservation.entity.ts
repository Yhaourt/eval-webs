import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';
import { Notif } from './notif.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
  })
  user_id: string;

  @Column({
    name: 'room_id',
  })
  room_id: string;

  @Column({
    name: 'start_time',
  })
  start_time: Date;

  @Column({
    name: 'end_time',
  })
  end_time: Date;

  @Column()
  status: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @JoinColumn({
    name: 'user_id',
  })
  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @JoinColumn({
    name: 'room_id',
  })
  @ManyToOne(() => Room, (room) => room.reservations)
  room: Room;

  @OneToMany(() => Notif, (notif) => notif.reservation, {
    cascade: true,
    eager: true,
  })
  notifs: Notif[];
}
