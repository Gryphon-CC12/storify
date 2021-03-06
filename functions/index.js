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
    // console.log('This will be run every 1 minutes! with Google function');
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
      let currentEntriesNum = Number(doc.data().entries.length);
      let maxEntries = Number(doc.data().maxEntries);
      let lastAuthor = doc.data().lastAuthor;
      let nextUserName = "";

      //console.log("currentInTurn",currentInTurn)
      //console.log("lastAuthor",lastAuthor)
      //console.log("maxEntries", maxEntries)
      //console.log("currentEntriesNum", currentEntriesNum)
      //console.log("is statement is ", maxEntries - currentEntriesNum > 0)
      if (maxEntries - currentEntriesNum > 0) {
        //console.log("Entered outer if")
        if (currentInTurn == "storify.io@gmail.com" && lastAuthor != "storify.io@gmail.com") {  //Checks last author is not storify bot
          //console.log("Working with new schema of latest author")
          let last_entry_id = doc.data().entries[doc.data().entries.length - 1] 
          const last_entry_data = await db.collection('Entries').where('id', '==', last_entry_id).get();
          let last_entry = last_entry_data.docs[0].data().text.toString('utf8').replace('"', '\"');
          // console.log("last_entry", last_entry);
          let last_entry_text_list = last_entry.split('. ');
          // console.log("last_entry_text_list", last_entry_text_list);
          let last_entry_clean =  last_entry_text_list.map(sent => sent.trim());
          let last_entry_text = last_entry_clean.slice(Math.max(0, last_entry_clean.length-3)).join(". ");
          let last_enty_uri = encodeURI(last_entry_text);
          // console.log("last_enty_uri", last_enty_uri);
          let robot_data = await db.collection('users').where('email', '==', 'storify.io@gmail.com').get();
          let robot_user = robot_data.docs[0].data();
          fetch("http://ec2-3-115-72-145.ap-northeast-1.compute.amazonaws.com/generate/" + last_enty_uri)
          .then(response => {
            return response.json()
          })
            .then(async output=>{
              // console.log("output.result", output.result)
              let entry_id = uuidv4()
              let trimmed_output = output.result.trim();
              let trimmed_output_arr = trimmed_output.split(/\n/g);
              let unique_output = [...new Set(trimmed_output_arr)].join("\n"); 
              // console.log("unique_output", unique_output)
              await saveToEntries(story_id, unique_output, entry_id, robot_user);
              await saveToUserEntries(robot_user.email, entry_id, story_id)
              await pushToStory(story_id, entry_id, robot_user, currentTimeLimit); 
          })
        } else {
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
          await db.collection("StoryDatabase").doc(doc.id).update({ "inTurn": nextInTurn });
          await db.collection("StoryDatabase").doc(doc.id).update({ "lastModified": new Date() });
          const userData = await db.collection('users').where('email', '==', nextInTurn).get();
          nextUserName = userData.docs[0].data().displayName;
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
          default:
            currentEndingTime = currentLastModified + 300;
        }          
  
      if (currentDate >= currentEndingTime) {  //If we're past the deadline
        // Modifty the collaborator in turn and notify him/her/
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
          await db.collection("StoryDatabase").doc(doc.id).update({ "inTurn": nextInTurn });
          await db.collection("StoryDatabase").doc(doc.id).update({ "lastModified": new Date() });
          const userData = await db.collection('users').where('email', '==', nextInTurn).get();
          nextUserName = userData.docs[0].data().displayName;
  
        // Notify email
        // if (nextInTurn != "storify.io@gmail.com") {
        //   await sendEmailToNextUser(nextInTurn, nextUserName, currentTimeLimit)
        // }
        // Update Story Last Modified  
      }  
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
        //console.log("Document successfully written!");
    })
    .catch(function (error) {
        //console.error("Error writing document: ", error);
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

async function pushToStory(story_id, entry_id, author, currentTimeLimit) {
  db.collection('StoryDatabase').where("id", "==", story_id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(async function(doc) {
      await db.collection("StoryDatabase").doc(doc.id).update({"lastModified": firebase.firestore.FieldValue.serverTimestamp()});
      await db.collection("StoryDatabase").doc(doc.id).update({"entries": firebase.firestore.FieldValue.arrayUnion(entry_id)});
      await db.collection("StoryDatabase").doc(doc.id).update({ "lastAuthor": author.email });

      let currentEnries = await doc.data().entries.length;
      let maxEntries = await doc.data().maxEntries;
      let currentTimeLimit = doc.data().timeLimit;
      let title = doc.data().title;
      await db.collection("StoryDatabase").doc(doc.id).update({"isCompleted": Number(maxEntries) - Number(currentEnries) <= 1 });
      
      let currentInTurn = await doc.data().inTurn; 
      let allEmails = await doc.data().emails;
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
      
      await db.collection("StoryDatabase").doc(doc.id).update({"inTurn": nextInTurn});
      const userData = await db.collection('users').where('email', '==', nextInTurn).get();
      let nextUserName = userData.docs[0].data().displayName;
      if (nextInTurn != "storify.io@gmail.com") {
        await sendEmailToNextUser(title, story_id, nextInTurn, nextUserName, currentTimeLimit)
      }
})
})
}

  async function sendEmailToNextUser(title, story_id, author, nextUserName, storyTimeLimit) {
    //   //////  SEND EMAIL  ////
    let template_params = {
      "email": author,
      "reply_to": "storify.io@gmail.com",
      "from_name": "Storify Team",
      "to_name": nextUserName,
      "time_limit": storyTimeLimit,
      "message_html": ("<h3>It's your turn to create! You have " + storyTimeLimit + " to add your entry in story titled: '"+title+"'.</h3> <br></br> <h4>Visit https://www.storifyapp.com/displaystory/" + story_id + "</h4>")
    }
      
    let service_id = "storify_io_gmail_com";
    let template_id = "storifytest";
    let user_id = "user_70NWDG8bnJ3Vr3RmVjtBT";
  
    await emailjs.send(service_id, template_id, template_params, user_id)
      .then(function(response) {
          // console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
          // console.log('FAILED...', error);
      });
  }

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