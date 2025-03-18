import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoomService } from '../services/room.service';

@Controller()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Correspond à la méthode "GetRoom" du service gRPC défini dans le proto
  @GrpcMethod('RoomService', 'GetRoom')
  async getRoom(data: { id: string }): Promise<any> {
    const room = await this.roomService.findOne(data.id);
    if (!room) return {}; // gérer le cas où la salle n'existe pas
    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      // Pour le champ created_at, vous devez le convertir au format attendu par google.protobuf.Timestamp
      created_at: { seconds: Math.floor(room.created_at.getTime() / 1000), nanos: 0 },
      reservations: room.reservations, // à mapper en fonction de votre définition du message Reservation
    };
  }

  // Correspond à la méthode "ListRooms" du service gRPC
  @GrpcMethod('RoomService', 'ListRooms')
  async listRooms(_: any): Promise<any> {
    const rooms = await this.roomService.findAll();
    // Adapter la réponse pour qu'elle corresponde à votre message proto (ici, ListRoomsResponse)
    return { rooms: rooms.map(room => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      created_at: { seconds: Math.floor(room.created_at.getTime() / 1000), nanos: 0 },
      reservations: room.reservations, // adapter selon le mapping défini dans le proto
    })) };
  }
}
