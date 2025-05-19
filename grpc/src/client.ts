import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

// Chemin vers ton .proto
const PROTO_PATH = join(__dirname, './protos/notification.proto');

// Chargement du .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const notificationPackage = protoDescriptor.notification;



// Création du client gRPC
const client = new notificationPackage.NotificationService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);


// Appel de CreateNotification avec **reservationId**
client.CreateNotification(
  {
    reservation_id: '8d272acf-b147-4c53-9fb0-5f233617b15d',  // ← Mets ici un UUID de réservation existant
    message: 'Ça fonctionne !',
  },
  (err: grpc.ServiceError | null, response: any) => {
    if (err) {
      console.error('Erreur CreateNotification:', err);
    } else {
      console.log('Réponse CreateNotification:', response);
    }
  },
);
