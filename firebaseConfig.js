import admin from "firebase-admin";

import serviceAccount from "serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hoteldemo-c1f24-default-rtdb.europe-west1.firebasedatabase.app"
});
const db = admin.database();
module.exports = db;