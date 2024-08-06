import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Function to add a room
export const addRoom = async (room) => {
  try {
    await addDoc(collection(db, 'rooms'), room);
    console.log('Room added successfully');
  } catch (e) {
    console.error('Error adding room: ', e);
  }
};

// Function to add a reservation
export const addReservation = async (reservation) => {
  try {
    await addDoc(collection(db, 'reservations'), reservation);
    console.log('Reservation added successfully');
  } catch (e) {
    console.error('Error adding reservation: ', e);
  }
};

// Function to fetch rooms
export const fetchRooms = async () => {
  const roomsSnapshot = await getDocs(collection(db, 'rooms'));
  const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return roomsList;
};

// Function to fetch reservations
export const fetchReservations = async () => {
  const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
  const reservationsList = reservationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return reservationsList;
};
