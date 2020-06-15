const firebase = require("./firebaseConfig").firebase
//import emailjs from 'emailjs-com';
const emailjs = require('emailjs-com')

// const firestore = require("../functions/firebaseConfig").firestore;
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
      querySnapshot.forEach(async function(doc) {
      let currentLastModified = doc.data().lastModified.seconds;
      let currentInTurn = doc.data().inTurn;
      let allEmails = doc.data().emails;
      let currentTimeLimit = doc.data().timeLimit;
      let story_id = doc.data().id;
      let currentEndingTime = 0;
      let currentDate = Math.round(new Date().getTime()/1000);
      let nextUserName = "";

      if (currentInTurn == "storify.io@gmail.com") {
        let last_entry_id = doc.data().entries[doc.data().entries.length - 1] 
        console.log("last entry", last_entry_id)
        const last_entry_data = await db.collection('Entries').where('id', '==', last_entry_id).get();
        console.log("last entry id", last_entry_data)
        let last_entry_text_list = last_entry_data.docs[0].data().text.split('. ');
        let last_entry_text = last_entry_text_list[last_entry_text_list.length - 1] + ".";
        console.log("last entry text", last_entry_text)
        let robot_data = await db.collection('users').where('email', '==', 'storify.io@gmail.com').get();
        fetch("http://ec2-52-68-242-203.ap-northeast-1.compute.amazonaws.com/generate/" + last_entry_text)
        .then(response => {
          //console.log("RESPONSE FROM AI RESPONSE (This is the Body { result:..}", response)
          return response.json()
        })
          .then(async output=>{
            let entry_id = uuidv4()
            console.log("RESPONSE FROM AI OUTPUT.RESULT", output.result);
            console.log("story_id",story_id)
            console.log("entry_id",entry_id)
            console.log("robot",robot_data.docs[0].data())
            console.log("robot.email",robot_data.docs[0].data().email)
            await saveToEntries(story_id, output.result, entry_id, robot_data.docs[0].data());
            await saveToUserEntries(robot_data.docs[0].data().email, entry_id, story_id)
            await pushToStory(story_id, entry_id, robot_data.docs[0].data()); 
          //document.getElementById("generatedText").innerHTML = output.result;
        })
      }

      switch (currentTimeLimit) {
        case "5 minutes":
          currentEndingTime = currentLastModified + 300;
          break;
        case "15 minutes":
          currentEndingTime = currentLastModified + 900;
        break;
        case "30 minutes":
          currentEndingTime = currentLastModified + 1800;
          break;
        case "1 hour":
          currentEndingTime = currentLastModified + 3600;
          break;        
        case "3 hours":
          currentEndingTime = currentLastModified + 10800;
          break;
        case "12 hours":
          currentEndingTime = currentLastModified + 43200;
          break; 
        case "1 day":
          currentEndingTime = currentLastModified + 86400;
          break;   
      }          
      
      // db.collection("StoryDatabase").doc(doc.id).update({ "useRobotAsPlayer": true });
      // console.log("currentDate", currentDate)
      // console.log("currentEndingTime", currentEndingTime);
      // console.log('currentDate >= currentEndingTime', currentDate >= currentEndingTime);
    if (currentDate >= currentEndingTime) {  //If we're past the deadline
      // Modifty the collaborator in turn and notify him/her/
      console.log("AllEmails array", allEmails)
        let nextInTurn = ""
        for (let i = 0; i < allEmails.length; i++){
          if (allEmails[i] === currentInTurn){
            if (i + 1 >= allEmails.length){
              nextInTurn = allEmails[0]
            } else {
              nextInTurn = allEmails[i + 1]
            }
          }
        }
        console.log('nextInTurn', nextInTurn);
        await db.collection("StoryDatabase").doc(doc.id).update({ "inTurn": nextInTurn });
        await db.collection("StoryDatabase").doc(doc.id).update({ "lastModified": new Date() });
        await db.collection("StoryDatabase").doc(doc.id).update({ "totalSkipped": firebase.firestore.FieldValue.increment(1) });
        const userData = await db.collection('users').where('email', '==', nextInTurn).get();
        console.log("next displayName",userData.docs[0].data().displayName)
        nextUserName = userData.docs[0].data().displayName;

      // Notify email
      //await sendEmailToNextUser(nextInTurn, nextUserName, currentTimeLimit)
      // Update Story Last Modified  
    }  
      })
    })
  });

  function saveToEntries(storyId, event, entry_id, user) {
    db.collection("Entries").add({
        id: entry_id,
        story: storyId,
        text: event,
        date: new Date(),
        likes: 0,
        author: user.displayName,
        email: user.email,
        userId: user.id
    })
    .then(function () {
        console.log("Document successfully written!");
    })
    .catch(function (error) {
        console.error("Error writing document: ", error);
    });
}

async function saveToUserEntries(userEmail, entryId, storyId) {
  db.collection('users').where('email', '==', userEmail)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              db.collection("users").doc(doc.id).update({ "linkToEntries": firebase.firestore.FieldValue.arrayUnion({entryId: entryId, storyId: storyId})});
          });
      }
  )
}

async function pushToStory(story_id, entry_id, author) {
  db.collection('StoryDatabase').where("id", "==", story_id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(async function(doc) {
      await db.collection("StoryDatabase").doc(doc.id).update({"lastModified": firebase.firestore.FieldValue.serverTimestamp()});
      await db.collection("StoryDatabase").doc(doc.id).update({"entries": firebase.firestore.FieldValue.arrayUnion(entry_id)});
       
      let currentEnries = await doc.data().entries.length;
      let maxEnries = await doc.data().maxEntries;
      await db.collection("StoryDatabase").doc(doc.id).update({"isCompleted": maxEnries - currentEnries == 0 });
      
      let currentInTurn = await doc.data().inTurn; 
      let allEmails = await doc.data().emails;
      console.log('allEmails', allEmails);
      
      let nextInTurn = ""
      for (let i = 0; i < allEmails.length; i++){
        if (allEmails[i] === currentInTurn){
          if (i + 1 >= allEmails.length){
            nextInTurn = allEmails[0]
          } else {
            nextInTurn = allEmails[i + 1]
          }
        }
      }
      console.log('nextInTurn after adding entry', nextInTurn);
      
      await db.collection("StoryDatabase").doc(doc.id).update({"inTurn": nextInTurn});
})
})
}














  // async function sendEmailToNextUser(author, nextUserName, currentTimeLimit) {
  //   //   //////  SEND EMAIL  ////
  //   let template_params = {
  //     "email": author,
  //     "reply_to": "storify.io@gmail.com",
  //     "from_name": "Storify Team",
  //     "to_name": nextUserName,
  //     "time_limit": currentTimeLimit,
  //     "message_html": ("<h1>It's your turn to create! You have "+ currentTimeLimit + " to add your entry.</h1>")
  //   }
      
  //   let service_id = "storify_io_gmail_com";
  //   let template_id = "storifytest";
  //   let user_id = "user_70NWDG8bnJ3Vr3RmVjtBT";
  
  //   await emailjs.send(service_id, template_id, template_params, user_id)
  //     .then(function(response) {
  //         console.log('SUCCESS!', response.status, response.text);
  //     }, function(error) {
  //         console.log('FAILED...', error);
  //     });
  // }
/*
  5 min = 300
  15 min = 900
  30 min = 1800
  1 hour =  3600
  3 hour =  10800
  12 hour =  43200
  24 hour =  86400
*/


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