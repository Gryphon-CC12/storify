// import firebase from "../../gryphonseniorproject/src/firebaseConfig";
// import { v4 as uuidv4 } from "uuid";

const uuidv4 = require("uuid/v4")

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const db = firebase.firestore();


exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
    console.log('This will be run every 1 minutes! with Google function');
    // const data = await db.collection('StoryDatabase').get();
    // console.log('data', data);

    db.collection('StoryDatabase').get()
    .then(function(querySnapshot) {
      let lastModifiedList = [];
      querySnapshot.forEach(function(doc) {
      let currentLastModified = doc.data().lastModified;
      let currentInTurn = doc.data().
      // lastModifiedList.push(currentLastModified);
      })
      console.log("lastModifiedList", lastModifiedList);
    })
  });





  
    // let maxEntries = data.docs[0].data().maxEntries;   //fetch max Users limit from database
    // let currentEntries = data.docs[0].data().entries.length;

    // db.collection("StoryDatabase").add({
    //     id: uuidv4(),
    //     dateCreated: new Date(),
    // })
    //     .then(function () {
    //         console.log("Document successfully written!");
    //     })
    //     .catch(function (error) {
    //         console.error("Error writing document: ", error);
    //     }); 

    // return null;
  


// exports.scheduledFunctionCrontab = functions.pubsub.schedule('* * * * *')  //at every 5th minute
//   .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//   console.log('This will be run every minute');
//   return null;
// });


// // Take the text parameter passed to this HTTP endpoint and insert it into 
// // Cloud Firestore under the path /messages/:documentId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into Cloud Firestore using the Firebase Admin SDK.
//   const writeResult = await admin.firestore().collection('messages').add({original: original});
//   // Send back a message that we've succesfully written the message
//   res.json({result: `Message with ID: ${writeResult.id} added.`});
// });

// // Listens for new messages added to /messages/:documentId/original and creates an
// // uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {
//       // Grab the current value of what was written to Cloud Firestore.
//       const original = snap.data().original;

//       // Access the parameter `{documentId}` with `context.params`
//       console.log('Uppercasing', context.params.documentId, original);
      
//       const uppercase = original.toUpperCase();
      
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to Cloud Firestore.
//       // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
//       return snap.ref.set({uppercase}, {merge: true});
//     });