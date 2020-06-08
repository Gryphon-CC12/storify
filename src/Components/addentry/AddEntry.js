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
        db.collection("StoryDatabase").doc(doc.id).update({"entries": firebase.firestore.FieldValue.arrayUnion(entry_id)});
        db.collection("StoryDatabase").doc(doc.id).update({"emails": firebase.firestore.FieldValue.arrayUnion(author.email)});
    });
})}

function AddEntry(props) {
    const author = useContext(UserContext);
    const inputEl = useRef(null);
    const id = uuidv4();
  const onButtonClick = (event) => {
    event.preventDefault()
    // `current` points to the mounted text input element
    saveToEntries(inputEl.current.value, id, author);
    pushToStory(props.id, id, author);
    console.log(props.id)
 
        //////  SEND EMAIL  ////
        let template_params = {
          "email": author.email,
          "reply_to": "storify.io@gmail.com",
          "from_name": "Storify Team",
          "to_name": author.author,
          "message_html": "<h1>It's your turn to create!</h1>"
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

      return <Redirect to='/displaystory/:props.id' />
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