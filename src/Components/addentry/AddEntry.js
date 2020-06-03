import React, {useRef} from 'react';
import firebase from "../../firebaseConfig";
import saveToEntries from '../../utils/saveToEntries';
import { v4 as uuidv4 } from "uuid";

const db = firebase.firestore();
  // DELETE ALL ENTRIES FROM DB
  const deleteAllEntries = () => {
      db.collection("Entries")
      .get()
      .then(res => {
        res.forEach(element => {
          element.ref.delete();
        });
      });
      setTimeout(() => {
          window.location.reload(false);
      }, 500);
  };
  // DELETE ALL ENTRIES FROM deleteAllStoryDatabase
  const deleteAllStoryDatabase = () => {
    db.collection("StoryDatabase")
    .get()
    .then(res => {
      res.forEach(element => {
        element.ref.delete();
      });
    });
    setTimeout(() => {
        window.location.reload(false);
    }, 500);
};

const STORY_ID = "d5f485a7-bf1f-4c3f-8ad9-5b37cc46cb00"

// const pushToStory = (story_id, entry_id) => {
//   console.log("entry_id", entry_id)
//   console.log("story_id", story_id)
//   db.collection('StoryDatabase').where('id', '==', story_id)
//   .set({entries: firebase.firestore.FieldValue.arrayUnion(entry_id)})
// }


const pushToStory = (story_id, entry_id) => {
  console.log("entry_id", entry_id);
  console.log("story_id", story_id);
  //const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  db.collection('StoryDatabase').where("id", "==", story_id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        console.log(doc.id, " => ", doc.data());
        // Build doc ref from doc.id
        db.collection("StoryDatabase").doc(doc.id).update({"likes": firebase.firestore.FieldValue.increment(50)});
    });
}
)}

// var washingtonRef = db.collection('cities').doc('DC');

// // Atomically increment the population of the city by 50.
// washingtonRef.update({
//     population: firebase.firestore.FieldValue.increment(50)
// });


// const const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
// doc.update({
//     items: arrayUnion('coco puffs')
// });


// var washingtonRef = db.collection("cities").doc("DC");
// // Atomically add a new region to the "regions" array field.
// washingtonRef.update({
//     regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
// });


function AddEntry() {
    const inputEl = useRef(null);
    const id = uuidv4();
    const author = "AUTHOR for entry"
    const onButtonClick = (event) => {
      event.preventDefault()
      // `current` points to the mounted text input element
      saveToEntries(inputEl.current.value, id, author);
      pushToStory(STORY_ID, id);
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
    <button id="entry-input" onClick={deleteAllEntries}>Delete All Entries</button>
    <button id="entry-input" onClick={deleteAllStoryDatabase}>Delete All StoryDatabase</button>
    </>
    )
}

export default AddEntry;