// TODO: Create Firebase Auth Functions

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

//Register new user
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User Registered:", user.email);
    return userCredential;
  } catch (error) {
    console.log("Registration Error:", error.message);
    throw error;
  }
};

//creating login
export const loginUser = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log("User Logged In:", user.email);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error Message:", errorMessage);
    });
};
//TODO: REGISTRATION FUNCTIONALITY HOMEWORK
export const logoutUser = () => {
  signOut(auth).then(() => {
    console.log("User Logged Out....");
  });
};

export const getUserInfo = () => {
  const user = auth.currentUser;

  if (user) {
    //logic handling and to not get null err
    return user;
  } else {
    return null;
  }
};
