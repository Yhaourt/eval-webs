import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';

// Définition de l'interface du service
interface RoomService {
  GetRoom(data: { id: string }): Observable<any>;
}

async function main() {
  // Création du client gRPC
  const client: ClientGrpc = ClientProxyFactory.create({
    transport: Transport.GRPC,
    options: {
      package: 'room',
      protoPath: join(__dirname, 'protos/spec.proto'),
      url: 'localhost:50051',
    },
  });

  // Attente du client avant d’appeler le service
  const roomService = client.getService<RoomService>('RoomService');

  // Appel de la méthode gRPC
  roomService.GetRoom({ id: 'room-id-test' }).subscribe({
    next: (response) => {
      console.log('Response:', response);
    },
    error: (err) => {
      console.error('Error:', err);
    },
  });
}

// Exécuter le test
main();
