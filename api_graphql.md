# API GraphQL


> **Note :** Tout accès à cette API doit être protégé par JWT (Keycloak).  
> Le serveur GraphQL peut, par exemple, intercepter le token dans l’en-tête `Authorization` avant d’autoriser l’exécution des requêtes.

---

## 1. Schéma GraphQL 

```graphql
# ------------------------------
# Types de base
# ------------------------------

type RoomEntity {
  id: ID!
  name: String!
  capacity: Int!
  location: String
  created_at: DateTime!
}

type ReservationEntity {
  id: ID!
  user_id: Int!
  room_id: Int!
  start_time: DateTime!
  end_time: DateTime!
  created_at: DateTime!
}

type User {
  id: ID!
  keycloak_id: String!
  created_at: DateTime!
  email: String
}

# ------------------------------
# Queries
# ------------------------------

type Query {
  # -- Rooms --
  listRooms(skip: Int, limit: Int): [RoomEntity!]!
  room(id: ID!): RoomEntity

  # -- Reservations --
  listReservations(skip: Int, limit: Int): [ReservationEntity!]!
  reservation(id: ID!): ReservationEntity

  # -- Users --
  listUsers(skip: Int, limit: Int): [User!]!
  user(id: ID!): User
}

# ------------------------------
# Mutations
# ------------------------------

type Mutation {
  # -- Users --
  login(email: String!, password: String!): {accessToken:String}
  # -- Rooms --
  createRoom(name: String!, capacity: Int!, location: String): RoomEntity!
  updateRoom(id: ID!, name: String, capacity: Int, location: String): RoomEntity!
  deleteRoom(id: ID!): Boolean!

  # -- Reservations --
  createReservation(
    user_id: Int!,
    room_id: Int!,
    start_time: DateTime!,
    end_time: DateTime!
  ): ReservationEntity!

  updateReservation(
    id: ID!,
    user_id: Int,
    room_id: Int,
    start_time: DateTime,
    end_time: DateTime
  ): ReservationEntity!

  deleteReservation(id: ID!): Boolean!
}

# ------------------------------
# Schema Root
# ------------------------------

schema {
  query: Query
  mutation: Mutation
}
```