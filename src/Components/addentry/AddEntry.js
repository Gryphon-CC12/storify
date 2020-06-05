import React, {useRef, useContext} from 'react';
import firebase from "../../firebaseConfig";
import saveToEntries from '../../utils/saveToEntries';
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../../providers/UserProvider";
const db = firebase.firestore();
// const { photoURL, displayName, email } = user;

const pushToStory = (story_id, entry_id, author) => {
  console.log("entry_id", entry_id);
  console.log("story_id", story_id);
  //const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  db.collection('StoryDatabase').where("id", "==", story_id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        console.log(doc.id, " => ", doc.data());
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
      console.log("test: is getting data from button?", inputEl);
    };

    return (
    <>
      <form>
          <div className="form-group">
              <label htmlFor="entry-input">Type your entry here</label>
              <textarea className="form-control" ref={inputEl} type="text" rows="10" />
              <button id="entry-input" onClick={onButtonClick}>Submit your entry</button>
          </div>
      </form>
    </>
    )
}

export default AddEntry;