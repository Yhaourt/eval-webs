import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notif } from '../entities/notif.entity';
import { Reservation } from 'src/entities/reservation.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notif)
    private readonly notifRepo: Repository<Notif>,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  private minioClient = new Client({
    endPoint: 'localhost', // ou ton endpoint docker
    port: 9000,
    useSSL: false,
    accessKey: 'minio',
    secretKey: 'minio123',
  });

  async exportToCSV(userId: string): Promise<string> {
    const reservations = await this.reservationRepo.find({
      where: { user_id: userId },
    });

    const csvStream = format({ headers: true });
    const bufferStream = new stream.PassThrough();
    const filename = `reservations-${userId}-${uuid()}.csv`;

    // Ecrit les données dans le CSV
    reservations.forEach((r) => {
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

    // Pipe le CSV dans le buffer
    csvStream.pipe(bufferStream);

    // Upload sur MinIO
    await this.minioClient.putObject(
      'csvs',
      filename,
      bufferStream,
      undefined,
      {
        'Content-Type': 'text/csv',
      },
    );

    // Génère une URL temporaire (7 jours)
    const url = await this.minioClient.presignedUrl(
      'GET',
      'csvs',
      filename,
      60 * 60 * 24 * 7,
    );
    return url;
  }

  async create(reservation_id: string, message: string): Promise<Notif> {
    const notif = this.notifRepo.create({
      reservation_id,
      message,
      notification_date: new Date(),
      is_sent: false,
    });
    return this.notifRepo.save(notif);
  }

  async update(id: string, message: string): Promise<Notif> {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');
    notif.message = message;
    return this.notifRepo.save(notif);
  }
}
