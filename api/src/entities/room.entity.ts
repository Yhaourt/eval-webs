import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column()
  location: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.room, {
    cascade: true,
    eager: true,
  })
  reservations: Reservation[];
}
