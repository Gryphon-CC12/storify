/* eslint-disable eqeqeq */
import React, { useRef, useContext } from 'react';
import firebase from "../../firebaseConfig";
import saveToEntries from '../../utils/saveToEntries';
import saveToUserEntries from '../../utils/saveToUserEntries';
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../../providers/UserProvider";
import emailjs from 'emailjs-com';

const db = firebase.firestore();

///SEND EMAIL TO NEXT USER////
function AddEntry(props) {
  let setStoryArr = props.setStoryArr;

  const author = useContext(UserContext);
  const inputEl = useRef(null);
  //const divEl = useRef(null);
  //const buttonEl = useRef(null);
  const id = uuidv4();
  // let nextUserEmail = "";
  // let nextUserName = "";
  // let storyTimeLimit = "";


  const pushToStory = (story_id, entry_id, author, passed) => {
    db.collection('StoryDatabase').where("id", "==", story_id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {

          if (!passed) {
            await db.collection("StoryDatabase").doc(doc.id).update({ "lastModified": firebase.firestore.FieldValue.serverTimestamp() });
            await db.collection("StoryDatabase").doc(doc.id).update({ "entries": firebase.firestore.FieldValue.arrayUnion(entry_id) });
            await db.collection("StoryDatabase").doc(doc.id).update({ "lastAuthor": author.email });
            
            let currentEnries = await doc.data().entries.length;
            let maxEnries = await doc.data().maxEntries;

            console.log('"isCompleted": Number(maxEnries) - Number(currentEnries)  <= 1', Number(maxEnries) - Number(currentEnries) <= 1);
            
            
            await db.collection("StoryDatabase").doc(doc.id).update({"isCompleted": Number(maxEnries) - Number(currentEnries) <= 1 });
          }
          
          // let currentInTurn = await doc.data().inTurn;
          let allEmails = await doc.data().emails;
          let storyTimeLimit = await doc.data().timeLimit;
          let storyTitle = await doc.data().title;

          
          let nextInTurn = ""
          for (let i = 0; i < allEmails.length; i++) {
            if (allEmails[i] == author.email) {
              if (i + 1 >= allEmails.length) {
                nextInTurn = allEmails[0]
              } else {
                nextInTurn = allEmails[i + 1]
              }
            }
          }
          await db.collection("StoryDatabase").doc(doc.id).update({ "inTurn": nextInTurn });
          const userData = await db.collection('users').where('email', '==', nextInTurn).get();
          let nextUserName = userData.docs[0].data().displayName;
          //ACTIVATE BEFORE PRODUCTION
          sendEmailToNextUser(storyTitle, story_id, nextInTurn, nextUserName, storyTimeLimit);
        });
      })
  }

  async function sendEmailToNextUser(title, story_id, nextUserEmail, nextUserName, storyTimeLimit) {

    //////  SEND EMAIL  ////
    if (nextUserEmail != "storify.io@gmail.com") {
      let template_params = {
        "email": nextUserEmail,
        "reply_to": "storify.io@gmail.com",
        "from_name": "Storify Team",
        "to_name": nextUserName,
        "time_limit": storyTimeLimit,
        "message_html": ("<h3>It's your turn to create! You have " + storyTimeLimit + " to add your entry in story titled: '"+title+"'.</h3> <br></br> <h4>Visit https://www.storifyapp.com/displaystory/" + story_id + "</h4>")
      }
      
      let service_id = "storify_io_gmail_com";
      let template_id = "storifytest";
      let user_id = "user_70NWDG8bnJ3Vr3RmVjtBT";
  
      //REACTIVATE BEFORE PRODUCTION
      emailjs.send(service_id, template_id, template_params, user_id)
        .then(function (response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function (error) {
          console.log('FAILED...', error);
        });
    }
  }

  const onSubmitButtonClick = async (event) => {

    // here our problem is this: we need the new story data
    // from display story
    // whatever is in the text box you pass as a new story item

    setStoryArr(storyArr => storyArr.concat([
      {
        "author": author.displayName,
        "text": [inputEl.current.value],
        "likes": 0,
        "entry_id": id,
        "story_id": props.id,
        "user_email": author.email
      }
     
    ]));

    event.preventDefault()
    // `current` points to the mounted text input element
    if (inputEl.current.value === "") {
      alert("Please enter a longer entry")   //Checks that story is not empty
    } else {
      let pass = false;
      await saveToEntries(props.id, inputEl.current.value, id, author);
      await saveToUserEntries(author.email, id, props.id)
      await pushToStory(props.id, id, author, pass);  //props.id is story.id
      props.setIsSubmittedFunc(true, 1);
      
    };
  };

  const onPassButtonClick = async (event) => {
    event.preventDefault()
    // `current` points to the mounted text input element
    let pass = true;
    await pushToStory(props.id, id, author, pass);  //props.id is story.id
    props.setIsSubmittedFunc(true, 0);
    
  };

    return (
      <>
        <form>
          <div className="form-group">
            <label htmlFor="entry-input">Type your entry here</label>
            <textarea
              className="form-control"
              aria-label="empty textarea"
              ref={inputEl}
              rows='15'
              spellCheck='true'
              placeholder="Keep in mind once you submit your entry you can't change it for story coherence purposes. Read Storify rules in 'About' page."
            />
            <button className="btn btn-dark" id="entry-input" onClick={onSubmitButtonClick}>Submit your entry</button>
            <button className="btn btn-dark" id="entry-input" onClick={onPassButtonClick}>Pass this turn</button>
          </div>
        </form>
      </>
    )
}
export default AddEntry;