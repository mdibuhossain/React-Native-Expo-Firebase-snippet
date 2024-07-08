import { app } from "./firebaseConfig";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import {
  signOut,
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  alert(error.message);
  console.error(error.message);
}

const db = getFirestore(app);
const storage = getStorage(app);
const usersCollection = collection(db, "users");
const moviesCollection = collection(db, "movies");

export const signUp = async (fullName, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateUserData({ displayName: fullName });
    const payload = {
      photoURL: "",
      uid: user?.uid,
      displayName: fullName,
      password: password,
      email: user?.email,
      emailVerified: user?.emailVerified,
    };
    addDoc(usersCollection, payload)
      .then((docRef) => {})
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
    console.error("Error in outter: ", error.message);
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
  return signOut(auth)
    .then(() => {
      router.replace("/sign-in");
    })
    .catch((error) => {
      alert(error.message);
    });
};

export const verifyEmail = async () => {
  if (!auth.currentUser)
    return alert("You must be logged in to verify your email.");
  return sendEmailVerification(auth.currentUser).then(() => {
    alert("Email verification sent! \nCheck your inbox.");
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

export const uploadProfilePicture = async ({ mimeType, uri }) => {
  const storangeRef = ref(
    storage,
    `avatars/${auth.currentUser.uid}.${mimeType.split("/")[1]}`
  );

  const response = await fetch(uri);
  const imgBlob = await response.blob();
  const metadata = {
    contentType: mimeType,
    customMetadata: {
      uploadedBy: auth.currentUser.email,
      description: "Profile picture",
    },
  };

  return uploadBytes(storangeRef, imgBlob, metadata)
    .then(async (snapshot) => {
      return await getDownloadURL(snapshot.ref);
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};
