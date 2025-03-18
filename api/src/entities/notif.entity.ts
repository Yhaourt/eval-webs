import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('notifications')
export class Notif {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'reservation_id',
  })
  reservation_id: string;

  @Column()
  message: string;

  @Column({
    name: 'notification_date',
  })
  notification_date: Date;

  @Column({
    name: 'is_sent',
  })
  is_sent: boolean;

  @JoinColumn({
    name: 'reservation_id',
  })
  @ManyToOne(() => Reservation, (reservation) => reservation.notifs)
  reservation: Reservation;
}
