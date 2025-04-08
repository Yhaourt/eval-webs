import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

// Charger le fichier proto
const protoPath = path.resolve(__dirname, './proto/notification.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [
    path.resolve(__dirname, './proto'),
    path.resolve(__dirname, '../node_modules/google-proto-files'),
  ],
});
interface NotificationService extends grpc.Client {
  ExportReservationsToCSV(
    request: { user_id: string },
    callback: (
      err: grpc.ServiceError | null,
      response: { url: string },
    ) => void
  ): void;
}

const proto = grpc.loadPackageDefinition(packageDefinition)
  .notification as unknown as {
  NotificationService: new (
    address: string,
    credentials: grpc.ChannelCredentials,
  ) => NotificationService;
};

// Créer le client gRPC
const client = new proto.NotificationService(
  'localhost:50051', // Adresse du serveur gRPC
  grpc.credentials.createInsecure(), // Pas de sécurité pour ce test
);

// Appel à la méthode ExportReservationsToCSV
const userId = 'ton-user-id'; // Remplace par un user_id valide
client.ExportReservationsToCSV(
  { user_id: userId },
  (err: grpc.ServiceError | null, response: any) => {
    if (err) {
      console.error('Erreur:', err);
      return;
    }
    console.log('URL CSV:', response.url);
  },
);
