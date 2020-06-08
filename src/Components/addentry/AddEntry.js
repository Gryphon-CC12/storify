import React, { useRef, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from "../../firebaseConfig";
import saveToEntries from '../../utils/saveToEntries';
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../../providers/UserProvider";

import emailjs from 'emailjs-com';

// require('dotenv').config()

// const {SERVICE_ID,TEMPLATE_ID,USER_ID} = process.env;

const db = firebase.firestore();

const pushToStory = (story_id, entry_id, author) => {
  db.collection('StoryDatabase').where("id", "==", story_id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // Build doc ref from doc.id
        // collaborators: [{"authorEmail": author.email, "authorName": author.displayName}],
        //storyTimeLimit = userData.docs[0].data().timeLimit;
        db.collection("StoryDatabase").doc(doc.id).update({"entries": firebase.firestore.FieldValue.arrayUnion(entry_id)});
        db.collection("StoryDatabase").doc(doc.id).update({"emails": firebase.firestore.FieldValue.arrayUnion(author.email)});
    });
})}


///SEND EMAIL TO NEXT USER////
async function sendEmailToNextUser(author, story_id) {
  const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
  let currentUsersList = data.docs[0].data().emails;  //fetch current user number of story from database
  let storyTimeLimit = data.docs[0].data().timeLimit;
  let nextUserEmail = "";
  let nextUserName = ""
  for (let email_num in currentUsersList) {
    let email_idx = Number(email_num)
    if (currentUsersList[email_idx] == author.email) {
      if (email_idx + 1 < currentUsersList.length) { 
        nextUserEmail = currentUsersList[email_idx + 1];
      } else {
        nextUserEmail = currentUsersList[0]
      }
    }
  }  
  console.log('nextUserEmail',nextUserEmail);
  const userData = await db.collection('users').where('email', '==', nextUserEmail).get();
  console.log("next displayName",userData.docs[0].data().displayName)
  nextUserName = userData.docs[0].data().displayName;
  console.log('storytimelimit',storyTimeLimit)
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

  emailjs.send(service_id, template_id, template_params, user_id)
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
        console.log('FAILED...', error);
    });
}

function AddEntry(props) {
    const author = useContext(UserContext);
    const inputEl = useRef(null);
    const id = uuidv4();
    const onButtonClick = (event) => {
    event.preventDefault()
    // `current` points to the mounted text input element
    if(inputEl.current.value === ""){
      alert("Please enter a longer entry")   //Checks that story is not empty
    } else {
    saveToEntries(inputEl.current.value, id, author);
    pushToStory(props.id, id, author);
    console.log(props.id);
    //sendEmailToNextUser(author, props.id);
      return <Redirect to='/displaystory/:props.id' />
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



      //emailjs.send(SERVICE_ID, TEMPLATE_ID, template_params, USER_ID)
      //Service Id: storify_io_gmail_com
      //UserId: user_70NWDG8bnJ3Vr3RmVjtBT
      //templateID: storifytest


      // let template_params = {
      //     "email": "gymnast1979@gmail.com",
      //     "reply_to": "storify.io@gmail.com",
      //     "from_name": "Carloooos",
      //     "to_name": "Gizmo",
      //     "message_html": "message_html_value"
      //  }
       
      //  var service_id = "default_service";
      //  var template_id = "template_vIZ8pRhu";
      //  emailjs.send('storify_io_gmail_com', 'storifytest', template_params, 'user_70NWDG8bnJ3Vr3RmVjtBT');


      // var template_params = {
      //     "reply_to": "storify.io@gmail.com",
      //     "from_name": "storify.io@gmail.com",
      //     "to_name": "to_name_value",
      //     "message_html": "message_html_value"
      //  }
       
      //  var service_id = "storify_io_gmail_com";
      //  var template_id = "template_vIZ8pRhu";
      //  emailjs.send(service_id, template_id, template_params);
