import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notif } from '../entities/notif.entity';
import { Reservation } from '../entities/reservation.entity';
import { format } from '@fast-csv/format';
import { PassThrough } from 'stream';
import { v4 as uuid } from 'uuid';
import { Client as MinioClient, ClientOptions } from 'minio';
import { log } from 'console';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notif)
    private readonly notifRepo: Repository<Notif>,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  private minioClient: MinioClient;

  private initMinio() {
    if (!this.minioClient) {
      const options: ClientOptions = {
        endPoint: 'localhost',
        port: 9090,
        useSSL: false,
        accessKey: 'minioadmin',
        secretKey: 'minioadmin',
      };
      this.minioClient = new MinioClient(options);
    }
    return this.minioClient;
  }

  async exportToCSV(userId: string): Promise<string> {
    const reservations = await this.reservationRepo.find({ where: { user_id: userId } });

    const csvStream = format({ headers: true });
    const bufferStream = new PassThrough();
    const filename = `reservations-${userId}-${uuid()}.csv`;

    // Pipe CSV data into buffer
    csvStream.pipe(bufferStream);

    // Write rows
    reservations.forEach(r => {
      csvStream.write({
        id: r.id,
        room_id: r.room_id,
        user_id: r.user_id,
        status: r.status,
        start_time: r.start_time.toISOString(),
        end_time: r.end_time.toISOString(),
      });
    });
    csvStream.end();

    // Ensure MinIO client is initialized
    const minio = this.initMinio();

    // Upload to MinIO
    await minio.putObject('csvs', filename, bufferStream, undefined, {'Content-Type': 'text/csv'});

    // Generate presigned URL (7 days)
    const url = await minio.presignedUrl('GET', 'csvs', filename, 7 * 24 * 60 * 60);
    return url;
  }

 async CreateNotification(reservation_id: string, message: string): Promise<Notif> {
  try {
    const notif = this.notifRepo.create({
      reservation_id,
      message,
      notification_date: new Date(),
      is_sent: false,
    });
    console.log('notif:', notif);
    
    return await this.notifRepo.save(notif);
  } catch (error) {
    console.error('Erreur dans CreateNotification:', error);
    throw new Error('Erreur lors de la création de la notification');
  }
}

async UpdateNotification(id: string, message: string): Promise<Notif> {
  try {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');
    notif.message = message;
    return await this.notifRepo.save(notif);
  } catch (error) {
    console.error('Erreur dans UpdateNotification:', error);
    if (error instanceof NotFoundException) {
      throw error; // laisser Nest gérer les erreurs connues
    }
    throw new Error('Erreur lors de la mise à jour de la notification');
  }
}

/*  async CreateResa(): Promise<Reservation> {
  const repo =  this.reservationRepo.create({
  id: '374e7384-1325-4f99-b7a1-518c1cbbcdd0',
  user_id: 'user-1234',
  room_id: 'room-5678',
  status: 'pending',
  start_time: new Date(),
  end_time: new Date(Date.now() + 3600_000),
});

 return await this.reservationRepo.save(repo);
} */


   /*  async CreateNotification(data: CreateNotificationRequest): Promise<Notif> {
    const notif = await this.create(data.reservationId, data.message);
    return {
      id: notif.id,
      reservationId: notif.reservation_id,
      message: notif.message,
      notificationDate: {
        seconds: Math.floor(notif.notification_date.getTime() / 1000),
        nanos: 0,
      },
      isSent: notif.is_sent,
    };
  }

  async UpdateNotification(data: UpdateNotificationRequest): Promise<Notif> {
    const notif = await this.update(data.id, data.message);
    return {
      id: notif.id,
      reservationId: notif.reservation_id,
      message: notif.message,
      notificationDate: {
        seconds: Math.floor(notif.notification_date.getTime() / 1000),
        nanos: 0,
      },
      isSent: notif.is_sent,
    };
  } */
}
