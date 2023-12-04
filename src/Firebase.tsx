// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDToKOG5BLCDVYTD7kDFOZdpnt6928ew-s",
  authDomain: "lockjournal.firebaseapp.com",
  projectId: "lockjournal",
  storageBucket: "lockjournal.appspot.com",
  messagingSenderId: "49168844637",
  appId: "1:49168844637:web:62550c77d0cec22808cab4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export const auth = getAuth(app); // User Object
export const db = getFirestore(app); //Database Object

const provider = new GoogleAuthProvider();

export default function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // Create an object with the fields you want to update
      interface UserData {
        name?: string | null;
        email: string | null;
        picture: string | null;
        streak?: number | null;
      }

      const userDataToUpdate: UserData = {
        email: result.user.email,
        picture: result.user.photoURL,
      };

      // Reference to the user's document
      const userDocRef = doc(db, "users", result.user.uid);

      // Check if the document already exists
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            console.log("User document already exists. Skipping update.");
          } else {
            // It's the user's first sign-in
            (userDataToUpdate.name = result.user.displayName),
              (userDataToUpdate.streak = 0);
          }

          // Use setDoc with merge option to update specific fields
          setDoc(userDocRef, userDataToUpdate, { merge: true })
            .then(() => {
              console.log("User data updated successfully.");
            })
            .catch((error) => {
              console.log("Error updating user data:", error);
            });
        })
        .catch((error) => {
          console.log("Error checking if user document exists:", error);
        });
    })
    .catch((error) => {
      console.log("Error signing in with Google:", error);
    });
}

export const signOutWithGoogle = () => {
  auth.signOut();
};
