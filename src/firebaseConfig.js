import firebase from 'firebase'

  // Your web app's Firebase configuration
  const firebaseConfig = {
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

  export default firebase;