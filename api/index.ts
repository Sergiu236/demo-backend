import express, { Request, Response } from 'express';
import cors from 'cors';

const db = require('./firebaseAdmin');

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

app.post('/api/reserve', (req, res) => {
  const { name, email, phone, roomId } = req.body as Reservation;
  if (!name || !email || !phone || !roomId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const reservation: Reservation = { id: 1, name, email, phone, roomId };
  
  const ref = db.ref('/client/${id}');
  ref.set( reservation, error => {
    if (error) {
      res.status(500).send("Data could not be saved." + error);
    } else {
      res.send("Data saved successfully.");
    }
  });


});

app.get('/api/reservations', (req, res) => {
  

  const ref = db.ref('/client');
  ref.once('value', (snapshot) => {
    const reservations = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);
    res.json(reservations);
  });

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
