import React, { useRef, useContext } from 'react';
import firebase from "../../firebaseConfig";
import saveToEntries from '../../utils/saveToEntries';
import saveToUserEntries from '../../utils/saveToUserEntries';
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../../providers/UserProvider";
import emailjs from 'emailjs-com';
// import { useHistory } from 'react-router-dom';

const db = firebase.firestore();

///SEND EMAIL TO NEXT USER////
function AddEntry(props) {

  let setStoryArr = props.setStoryArr;

  // const history = useHistory();

  const author = useContext(UserContext);
  const inputEl = useRef(null);
  const id = uuidv4();
  let nextUserEmail = "";
  let nextUserName = "";
  let storyTimeLimit = "";


  const pushToStory = (story_id, entry_id, author) => {
    db.collection('StoryDatabase').where("id", "==", story_id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {

          await db.collection("StoryDatabase").doc(doc.id).update({ "lastModified": firebase.firestore.FieldValue.serverTimestamp() });
          await db.collection("StoryDatabase").doc(doc.id).update({ "entries": firebase.firestore.FieldValue.arrayUnion(entry_id) });
          
          let currentEnries = await doc.data().entries.length;
          let maxEnries = await doc.data().maxEntries;
          await db.collection("StoryDatabase").doc(doc.id).update({ "isCompleted": maxEnries - currentEnries == 0 });
          
          let currentInTurn = await doc.data().inTurn;
          let allEmails = await doc.data().emails;

          console.log('allEmails', allEmails);
          
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
          console.log('nextInTurn after adding entry', nextInTurn);
          
          await db.collection("StoryDatabase").doc(doc.id).update({ "inTurn": nextInTurn });
        });
      })
  }

  async function sendEmailToNextUser(author, story_id) {
    //////  SEND EMAIL  ////
    if (nextUserEmail != "storify.io@gmail.com") {
      let template_params = {
        "email": nextUserEmail,
        "reply_to": "storify.io@gmail.com",
        "from_name": "Storify Team",
        "to_name": nextUserName,
        "time_limit": storyTimeLimit,
        "message_html": ("<h1>It's your turn to create! You have " + storyTimeLimit + " to add your entry.</h1>")
      }
      
      let service_id = "storify_io_gmail_com";
      let template_id = "storifytest";
      let user_id = "user_70NWDG8bnJ3Vr3RmVjtBT";
  
      emailjs.send(service_id, template_id, template_params, user_id)
        .then(function (response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function (error) {
          console.log('FAILED...', error);
        });
    }
  }

  const onButtonClick = async (event) => {

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
      await saveToEntries(props.id, inputEl.current.value, id, author);
      await saveToUserEntries(author.email, id, props.id)
      await pushToStory(props.id, id, author);
    //🍕
     // history.push(`/displaystory/${props.id}`);
    };
  };

    return (
      <>
        <form>
          <div className="form-group">
            <label htmlFor="entry-input">Type your entry here</label>
            <textarea
              className="form-control"
              aria-label="empty textarea"
              placeholder="Add your entry!"
              ref={inputEl}
              rows='15'
              spellCheck='true'
            />
            <button className="btn btn-dark" id="entry-input" onClick={onButtonClick}>Submit your entry</button>
          </div>
        </form>
      </>
    )
}

export default AddEntry;