import React, { useRef, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from "../../firebaseConfig";
import saveToEntries from '../../utils/saveToEntries';
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../../providers/UserProvider";
import DisplayStory from '../displaystory/DisplayStory'
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

//<Link to={{pathname: `/displaystory/${props.storyProp.id}`}}>Read more</Link>

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