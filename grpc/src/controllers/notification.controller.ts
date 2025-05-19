import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationService } from '../services/notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @GrpcMethod('NotificationService', 'CreateNotification')
  async createNotification(data: { reservationId?: string; reservation_id?: string; message: string }) {
    // vérifie les deux cas : camelCase et snake_case
    const reservation_id = data.reservationId ?? data.reservation_id;
    console.log('createNotification payload:', data, '→ reservation_id:', reservation_id);

    if (!reservation_id) {
      throw new Error('reservation_id is required');
    }
    const notif = await this.notificationService.CreateNotification(
      reservation_id,
      data.message,
    );
    return {
      id: notif.id,
      reservation_id: notif.reservation_id,
      message: notif.message,
      notification_date: {
        seconds: Math.floor(notif.notification_date.getTime() / 1000),
        nanos: 0,
      },
      is_sent: notif.is_sent,
    };
  }

  @GrpcMethod('NotificationService', 'UpdateNotification')
  async updateNotification(data: { id: string; message: string }) {
   

    const notif = await this.notificationService.UpdateNotification(data.id,
      data.message);
    return {
      id: notif.id,
      reservation_id: notif.reservation_id,
      message: notif.message,
      notification_date: {
        seconds: Math.floor(notif.notification_date.getTime() / 1000),
        nanos: 0,
      },
      is_sent: notif.is_sent,
    };
  }

  @GrpcMethod('NotificationService', 'ExportReservationsToCSV')
  async exportReservationsToCSV(data: { user_id: string }) {
    const url = await this.notificationService.exportToCSV(data.user_id);
    return { url };
  }
}
