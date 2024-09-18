import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';  // Import multer for file uploads
import admin from 'firebase-admin';  // Import firebase-admin for storage operations
import { getStorage, ref, uploadBytes } from 'firebase/storage';  // Import storage functions from firebase/storage
import db, { bucket } from '../firebaseConfig.js'; // Ensure this path is correct

// Firebase admin initialization here (if not already configured in firebaseConfig.js)
// Initialize Firebase Admin with credentials and configurations as needed

const app = express();
const PORT = 5000;

// Room and Reservation interfaces
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

// Helper function to create a new user
async function createUser(email: string, password: string) {
  const userRecord = await admin.auth().createUser({
    email: email,
    password: password,
  });
  return userRecord;
}

// Helper function to generate a custom token
async function generateToken(uid: string) {
  const customToken = await admin.auth().createCustomToken(uid);
  return customToken;
}

// Signup endpoint
app.post('/api/signup', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userRecord = await createUser(email, password);
    const token = await generateToken(userRecord.uid);
    res.status(201).json({ uid: userRecord.uid, token: token, message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(email);
    const token = await generateToken(user.uid);
    res.json({ uid: user.uid, token: token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Existing room and reservation API endpoints
app.post('/api/reserve', (req, res) => {
  const { name, email, phone, roomId } = req.body as Reservation;
  if (!name || !email || !phone || !roomId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const id = uuidv4();

  const reservation: Reservation = { id, name, email, phone, roomId, date: "" };

  const ref = db.ref('/client/' + id);
  ref.set(reservation, error => {
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all rooms
app.get('/api/rooms', async (req: Request, res: Response) => {
  try {
      // Reference to the rooms collection in the Realtime Database
      const roomsRef = db.ref('/rooms');

      // Retrieve all room data from the database
      roomsRef.once('value', async (snapshot) => {
          const rooms = snapshot.val();
          if (!rooms) {
              return res.status(404).send('No rooms found');
          }

          // Prepare to fetch URLs from Firebase Storage for each room
          const roomsWithImages = await Promise.all(Object.keys(rooms).map(async (roomId) => {
              const roomData = rooms[roomId];
              const imageRef = bucket.file(`images/${roomId}`);

              // Get the URL for the image
              const signedUrls = await imageRef.getSignedUrl({
                  action: 'read',
                  expires: '03-09-2491'  // Set far future expiry date
              });

              // Add the image URL to the room data
              roomData.photo = signedUrls[0];
              return roomData;  // Return the enhanced room data
          }));

          res.status(200).json(roomsWithImages);
      }, (error) => {
          console.error('Failed to retrieve data:', error);
          res.status(500).send('Error retrieving rooms data');
      });
  } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).send('Internal Server Error');
  }
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

    const metadata = {
      contentType: file.mimetype,
    };

    try{
      const imageRef = bucket.file(`images/${newRoom.id}`);
      await imageRef.save(file.buffer, metadata);

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


    

    
