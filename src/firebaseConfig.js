import firebase from "firebase"
import "firebase/auth";
import "firebase/firestore";
import { v4 as uuidv4 } from "uuid";


  // Your web app’s Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBtkdQm-zOXuSOPR0MSXdFLFrUurxGuqyc",
    authDomain: "seniorgryphon-df706.firebaseapp.com",
    databaseURL: "https://seniorgryphon-df706.firebaseio.com",
    projectId: "seniorgryphon-df706",
    storageBucket: "seniorgryphon-df706.appspot.com",
    messagingSenderId: "990142616456",
    appId: "1:990142616456:web:bd76b66f2e9230eeace03d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage()

  export const generateUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      const { email, displayName, photoURL } = user;
      try {
        await userRef.set({
          displayName,
          email,
          photoURL,
          "likedEntries": [], 
          "linkToEntries" :[], 
          "linkToStories" : [], 
          "upVotesStories" : [], 
          "date" : new Date(),
          id:uuidv4()
        });
      } catch (error) {
        console.error("Error creating user document", error);
      }
    }
    return getUserDocument(user.uid);
  };
  const getUserDocument = async uid => {
    if (!uid) return null;
    try {
      const userDocument = await firestore.doc(`users/${uid}`).get();
      return {
        uid,
        ...userDocument.data()
      };
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const provider = new firebase.auth.GoogleAuthProvider();
  export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
  };


  export const auth = firebase.auth();
  export const firestore = firebase.firestore();
  export  {
    storage, firebase as default
  }


///// Google OAUTH CREDENTIALS
//Client ID: 336851866169-pgf0mr1e3is106a8ptuu19h3urf8tp7n.apps.googleusercontent.com
//Your Client Secret: Zr7rSOskrN5tvH7MrQyEfOz_