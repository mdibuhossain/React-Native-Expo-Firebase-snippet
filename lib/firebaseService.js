import { app } from "./firebaseConfig";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import {
  signOut,
  initializeAuth,
  onAuthStateChanged,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat/app";
import { router } from "expo-router";

// export let auth;

// try {
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// } catch (error) {
//   alert(error.message);
//   console.log(error.message);
// }

const db = getFirestore(app);
const usersCollection = collection(db, "users");
const moviesCollection = collection(db, "movies");

export const signUp = async (username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const payload = {
      username,
      photoURL: "",
      uid: user?.uid,
      displayName: "",
      password: password,
      email: user?.email,
      emailVerified: user?.emailVerified,
    };
    addDoc(usersCollection, payload)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef);
      })
      .catch((error) => {
        alert(error.message);
        console.error("Error adding document: ", error);
      });
    return {
      loading: false,
      data: user,
    };
  } catch (error) {
    alert(error.message);
    console.log("Error in outter: ", error.message);
  }
};

export const logIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};

export const logOut = async () => {
  try {
    signOut(auth)
      .then(() => {
        router.replace("/sign-in");
      })
      .catch((error) => {
        alert(error.message);
      });
  } catch (error) {
    alert(error.message);
  }
};

export const verifyEmail = async () => {
  if (!auth.currentUser)
    return alert("You must be logged in to verify your email.");
  return sendEmailVerification(auth.currentUser).then(() => {
    console.log("Email verification sent");
  });
};

export const updateUserData = async (payload) => {
  return updateProfile(auth.currentUser, payload)
    .then(() => {
      return true;
    })
    .catch((error) => {
      alert(error.message);
      return false;
    });
};
