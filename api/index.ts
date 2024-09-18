// index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import axios from 'axios';

// Import the initialized Firebase Admin SDK instances
import { admin, db, bucket, auth } from '../firebaseConfig.js'; // Adjust the path as needed

const app = express();
const PORT = 5000;

// Room and Reservation interfaces
interface Room {
  id?: string;
  name: string;
  price: number;
  description: string;
  photo?: string;
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

// Signup endpoint using Firebase Admin SDK
app.post('/api/signup', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  auth
    .createUser({
      email: email,
      password: password,
    })
    .then((userRecord) => {
      // Signed up successfully
      res.status(201).json({ uid: userRecord.uid, message: 'User created successfully' });
    })
    .catch((error) => {
      console.error('Signup error:', error);
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(400).json({ errorCode, errorMessage });
    });
});

// Define your Firebase Web API Key (replace with your actual key)
const FIREBASE_WEB_API_KEY = 'AIzaSyDX9qt4TJfiCfMAl6rKI4KW0rMOypXuHmM';

// Login endpoint using Firebase Auth REST API
app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Make a POST request to Firebase Auth REST API to sign in the user
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );

    const { idToken, refreshToken, expiresIn, localId } = response.data;

    // Optionally, verify the ID token using Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(idToken);

    // Return the tokens and user information to the client
    res.json({
      uid: localId,
      idToken: idToken,
      refreshToken: refreshToken,
      expiresIn: expiresIn,
      message: 'Login successful',
    });
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);

    // Handle errors returned by the Firebase Auth REST API
    let errorMessage = 'An error occurred during login.';
    if (error.response && error.response.data && error.response.data.error) {
      switch (error.response.data.error.message) {
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'Email address not found.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'Invalid password.';
          break;
        case 'USER_DISABLED':
          errorMessage = 'User account has been disabled.';
          break;
        default:
          errorMessage = error.response.data.error.message;
      }
    }
    res.status(400).json({ error: errorMessage });
  }
});

// Existing room and reservation API endpoints remain mostly unchanged...

// Reservation endpoint
app.post('/api/reserve', (req: Request, res: Response) => {
  const { name, email, phone, roomId } = req.body as Reservation;
  if (!name || !email || !phone || !roomId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const id = uuidv4();

  const reservation: Reservation = { id, name, email, phone, roomId, date: '' };

  const ref = db.ref('/client/' + id);
  ref.set(reservation, (error) => {
    if (error) {
      res.status(500).send('Data could not be saved.' + error);
    } else {
      res.send('Data saved successfully.');
    }
  });
});

// Get all reservations
app.get('/api/reservations', (req: Request, res: Response) => {
  const ref = db.ref('/client');
  ref.once(
    'value',
    (snapshot) => {
      const reservationsData = snapshot.val();
      if (reservationsData) {
        const reservations = Object.keys(reservationsData).map((key) => reservationsData[key]);
        res.json(reservations);
      } else {
        res.json([]);
      }
    },
    (error) => {
      console.error('Failed to retrieve data:', error);
      res.status(500).send('Error retrieving reservations data');
    }
  );
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all rooms
app.get('/api/rooms', async (req: Request, res: Response) => {
  try {
    const roomsRef = db.ref('/rooms');

    roomsRef.once(
      'value',
      async (snapshot) => {
        const roomsData = snapshot.val();
        if (!roomsData) {
          return res.status(404).send('No rooms found');
        }

        // Fetch image URLs from Firebase Storage for each room
        const roomsWithImages = await Promise.all(
          Object.keys(roomsData).map(async (roomId) => {
            const roomData = roomsData[roomId];
            const imageRef = bucket.file(`images/${roomId}`);

            try {
              // Get signed URL for the image
              const [signedUrl] = await imageRef.getSignedUrl({
                action: 'read',
                expires: '03-09-2491', // Far future expiry date
              });

              // Add the image URL to the room data
              roomData.photo = signedUrl;
            } catch (error) {
              console.error(`Error getting signed URL for room ${roomId}:`, error);
              roomData.photo = ''; // Set a default or empty photo URL
            }

            return roomData; // Return the enhanced room data
          })
        );

        res.status(200).json(roomsWithImages);
      },
      (error) => {
        console.error('Failed to retrieve data:', error);
        res.status(500).send('Error retrieving rooms data');
      }
    );
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new room
app.post('/api/rooms', upload.single('photo'), async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body as Room;

    const file = (req as any).file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const newRoomId = uuidv4();
    const newRoom: Room = { id: newRoomId, name, price, description };

    const metadata = {
      contentType: file.mimetype,
    };

    try {
      const imageRef = bucket.file(`images/${newRoomId}`);
      await imageRef.save(file.buffer, metadata);

      // Save the room data without the photo URL to Realtime Database
      const ref = db.ref('/rooms/' + newRoomId);
      ref.set(newRoom, (error) => {
        if (error) {
          res.status(500).send('Data could not be saved.' + error);
        } else {
          res.send('Room created successfully.');
        }
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      res.status(500).send('Error during image upload');
    }
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Server launch
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
