const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-service-account-file.json'); // Replace with the path to your service account file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://aspirelink-hotel.firebaseio.com' // Update with your Firebase Realtime Database URL if using
});

const db = admin.firestore();

module.exports = { db };
