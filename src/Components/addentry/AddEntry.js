import React, { useRef, useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from "../../firebaseConfig";
import saveToEntries from '../../utils/saveToEntries';
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../../providers/UserProvider";
import emailjs from 'emailjs-com';

const db = firebase.firestore();

///SEND EMAIL TO NEXT USER////
function AddEntry(props) {
  const author = useContext(UserContext);
  const inputEl = useRef(null);
  const id = uuidv4();
  let nextUserEmail = "";
  let nextUserName = "";
  let storyTimeLimit = "";


  const pushToStory = (story_id, entry_id, author) => {
    console.log("nextUserEmail in Push to story ", nextUserEmail);

    db.collection('StoryDatabase').where("id", "==", story_id)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          db.collection("StoryDatabase").doc(doc.id).update({"inTurn": nextUserEmail});
          db.collection("StoryDatabase").doc(doc.id).update({"lastModified": firebase.firestore.FieldValue.serverTimestamp()});
          db.collection("StoryDatabase").doc(doc.id).update({"entries": firebase.firestore.FieldValue.arrayUnion(entry_id)});
          db.collection("StoryDatabase").doc(doc.id).update({"emails": firebase.firestore.FieldValue.arrayUnion(author.email)});
      });
  })}

  async function calculateNextUser(author, story_id) {
    const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
    let currentUsersList = data.docs[0].data().emails;  //fetch current user number of story from database
    storyTimeLimit = data.docs[0].data().timeLimit;
    for (let email_num in currentUsersList) {
      let email_idx = Number(email_num)
      if (currentUsersList[email_idx] == author.email) {
        if (email_idx + 1 < currentUsersList.length) { 
          nextUserEmail = currentUsersList[email_idx + 1];
        } else {
          nextUserEmail = currentUsersList[0];
        }
        console.log("nextUserEmail",nextUserEmail);
        
      }
    }  
    console.log('nextUserEmail',nextUserEmail);
    const userData = await db.collection('users').where('email', '==', nextUserEmail).get();
    console.log("next displayName",userData.docs[0].data().displayName)
    nextUserName = userData.docs[0].data().displayName;
    console.log('storytimelimit',storyTimeLimit)

    // return nextUserEmail;
  }

  async function sendEmailToNextUser(author, story_id) {
    //   //////  SEND EMAIL  ////
    let template_params = {
      "email": nextUserEmail,
      "reply_to": "storify.io@gmail.com",
      "from_name": "Storify Team",
      "to_name": nextUserName,
      "time_limit": storyTimeLimit,
      "message_html": ("<h1>It's your turn to create! You have "+ storyTimeLimit + " to add your entry.</h1>")
    }
      
    let service_id = "storify_io_gmail_com";
    let template_id = "storifytest";
    let user_id = "user_70NWDG8bnJ3Vr3RmVjtBT";
  
    // emailjs.send(service_id, template_id, template_params, user_id)
    //   .then(function(response) {
    //       console.log('SUCCESS!', response.status, response.text);
    //   }, function(error) {
    //       console.log('FAILED...', error);
    //   });
  }

  const onButtonClick = async (event) => {
    event.preventDefault()
    // `current` points to the mounted text input element
    if(inputEl.current.value === ""){
      alert("Please enter a longer entry")   //Checks that story is not empty
    } else {
    await saveToEntries(inputEl.current.value, id, author);
    console.log(props.id);
    await calculateNextUser(author, props.id);
    await sendEmailToNextUser(author, props.id);
    await pushToStory(props.id, id, author, nextUserEmail); 

    setTimeout(() => {window.location.reload(false);}, 1000);
    }
    };

    return (
    <>
      <form>
          <div className="form-group">
              <label htmlFor="entry-input">Type your entry here</label>
              <textarea className="form-control" ref={inputEl} type="text" rows="10" />
              <button className="btn btn-dark" id="entry-input" onClick={onButtonClick}>Submit your entry</button>
          </div>
        </form>
      </>
    )
}

export default AddEntry;

