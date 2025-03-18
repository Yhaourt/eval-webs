import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('notifications')
export class Notif {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reservationId: string;

  @Column()
  message: string;

  @Column()
  notificationDate: Date;

  @Column()
  isSent: boolean;

  @ManyToOne(() => Reservation, (reservation) => reservation.notifs)
  reservation: Reservation;
}
