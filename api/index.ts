import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

import multer from 'multer';  // Import multer for file uploads
import admin from 'firebase-admin';  // Import firebase-admin for storage operations

import db from '../firebaseConfig.js';

const app = express();
const PORT = 5000;

const rooms: Room[] = [
  { id: "1", name: 'Deluxe Suite', price: 200, description: 'A luxurious suite with a sea view.', photo: 'https://t3.ftcdn.net/jpg/02/71/08/28/360_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg' },
  { id: "2", name: 'Standard Room', price: 120, description: 'A comfortable room with all basic amenities.', photo: 'https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg' },
  { id: "3", name: 'Economy Room', price: 80, description: 'An affordable room for budget-conscious travelers.', photo: 'https://www.rwlasvegas.com/wp-content/uploads/2022/05/crockfords-las-vegas-standard-deluxe-bedroom_1000x880.jpg' },
  { id: "4", name: 'Executive Room', price: 150, description: 'A spacious room with executive facilities.', photo: 'https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM=' },
  { id: "5", name: 'Family Room', price: 180, description: 'A room designed for families with children.', photo: 'https://media.cnn.com/api/v1/images/stellar/prod/140127103345-peninsula-shanghai-deluxe-mock-up.jpg?q=w_2226,h_1449,x_0,y_0,c_fill' },
  { id: "6", name: 'Luxury Suite', price: 250, description: 'An opulent suite with premium amenities.', photo: 'https://t3.ftcdn.net/jpg/02/71/08/28/360_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg' },
  { id: "7", name: 'Penthouse Suite', price: 300, description: 'A top-floor suite with spectacular views.', photo: 'https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg' },
  { id: "8", name: 'Junior Suite', price: 160, description: 'A spacious suite with a separate living area.', photo: 'https://www.rwlasvegas.com/wp-content/uploads/2022/05/crockfords-las-vegas-standard-deluxe-bedroom_1000x880.jpg' },
  { id: "9", name: 'Superior Room', price: 140, description: 'A high-quality room with upgraded features.', photo: 'https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM=' },
  { id: "10", name: 'Double Room', price: 100, description: 'A cozy room with double beds for comfort.', photo: 'https://media.cnn.com/api/v1/images/stellar/prod/140127103345-peninsula-shanghai-deluxe-mock-up.jpg?q=w_2226,h_1449,x_0,y_0,c_fill' },
  { id: "11", name: 'Single Room', price: 70, description: 'An economical room for single travelers.', photo: 'https://t3.ftcdn.net/jpg/02/71/08/28/360_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg' },
  { id: "12", name: 'Suite with Balcony', price: 220, description: 'A suite with a private balcony and view.', photo: 'https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg' }
];


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



app.post('/api/reserve', (req, res) => {
  const { name, email, phone, roomId } = req.body as Reservation;
  if (!name || !email || !phone || !roomId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const id = uuidv4();

  const reservation: Reservation = { id, name, email, phone, roomId, date : ""};

  const ref = db.ref('/client/' + id);
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






///////////////////////////////// the new code for CRUD API for rooms ////////////////////////////

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all rooms
app.get('/api/rooms', async (req, res) => {
  const ref = db.ref('/rooms');
  ref.once('value', async (snapshot) => {
    const roomsData = snapshot.val();
    const rooms = await Promise.all(
      Object.keys(roomsData).map(async (key) => {
        const room = roomsData[key];
        const photoUrl = await admin.storage().bucket().file(`rooms/${room.id}`).getSignedUrl({
          action: 'read',
          expires: '03-09-2491' // Set a far future date for expiration or adjust as needed
        });
        return { ...room, photo: photoUrl[0] };
      })
    );
    res.json(rooms);
  });
});

// Create a new room
app.post('/api/rooms', upload.single('photo'), async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body as Room;

    // Cast req to any to bypass TypeScript's type checking for the file property
    const file = (req as any).file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const newRoom = { id: uuidv4(), name, price, description };

    // Upload the photo to Firebase Storage
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(`rooms/${newRoom.id}`);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype
      }
    });

    // Save the room data without the photo URL to Realtime Database
    const ref = db.ref('/rooms/' + newRoom.id);
    ref.set(newRoom, (error) => {
      if (error) {
        res.status(500).send('Data could not be saved.' + error);
      } else {
        res.send('Room created successfully.');
      }
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).send('Internal Server Error');
  }
});


///Lunch server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});