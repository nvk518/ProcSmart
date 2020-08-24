import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  // copy and paste your firebase credential here

  apiKey: "AIzaSyDJQQacGtRfPTtiTrP36OSbU2oNWEe13zA",
  authDomain: "procsmart-2d2a8.firebaseapp.com",
  databaseURL: "https://procsmart-2d2a8.firebaseio.com",
  projectId: "procsmart-2d2a8",
  storageBucket: "procsmart-2d2a8.appspot.com",
  messagingSenderId: "449774486205",
  appId: "1:449774486205:web:efc57de71384bd2b5aedd4",
  measurementId: "G-1YYE34YL6G",
});

const db = firebaseApp.firestore();

export { db };
