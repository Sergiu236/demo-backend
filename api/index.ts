import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from '../firebaseAdmin';

const app = express();
const PORT = 5000;

interface Room {
  id?: string;
  name: string;
  price: number;
  description: string;
  photo: string;
}

interface Reservation {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  roomId: string;
}

app.use(cors());
app.use(express.json());

app.get('/api/rooms', async (req: Request, res: Response) => {
  try {
    const roomsSnapshot = await db.collection('rooms').get();
    const rooms: Room[] = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
    res.json(rooms);
  } catch (error) {
    res.status(500).send('Error fetching rooms: ' + (error as Error).message);
  }
});

app.get('/api/rooms/:id', async (req: Request, res: Response) => {
  try {
    const roomDoc = await db.collection('rooms').doc(req.params.id).get();
    if (!roomDoc.exists) {
      return res.status(404).send('Room not found');
    }
    res.json({ id: roomDoc.id, ...roomDoc.data() } as Room);
  } catch (error) {
    res.status(500).send('Error fetching room: ' + (error as Error).message);
  }
});

app.post('/api/rooms', async (req: Request, res: Response) => {
  try {
    const newRoom: Room = req.body;
    const roomRef = await db.collection('rooms').add(newRoom);
    res.status(201).json({ id: roomRef.id, ...newRoom });
  } catch (error) {
    res.status(500).send('Error adding room: ' + (error as Error).message);
  }
});

app.post('/api/reservations', async (req: Request, res: Response) => {
  try {
    const newReservation: Reservation = req.body;
    const reservationRef = await db.collection('reservations').add(newReservation);
    res.status(201).json({ id: reservationRef.id, ...newReservation });
  } catch (error) {
    res.status(500).send('Error adding reservation: ' + (error as Error).message);
  }
});

app.get('/api/reservations', async (req: Request, res: Response) => {
  try {
    const reservationsSnapshot = await db.collection('reservations').get();
    const reservations: Reservation[] = reservationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
    res.json(reservations);
  } catch (error) {
    res.status(500).send('Error fetching reservations: ' + (error as Error).message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
