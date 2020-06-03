import React, { useRef } from 'react';
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import saveToEntries from "../../utils/saveToEntries"

const db = firebase.firestore();


function saveToStories(event, id) {
    //event.preventDefault();
    console.log("e", id);
    db.collection("StoryDatabase").add({
        id: uuidv4(),
        dateCreated: new Date(),
        likes: 0,
        author: "Harry Potter3",
        isPrompt: true,
        maxEntries: 1,
        maxUsers: 1,
        upvotes: 0,
        entries: [id.current],
        useRobotAsPlayer: false,
        imageUrl : "https://cdn.pixabay.com/photo/2016/06/08/19/46/cereal-1444495_960_720.jpg"
    })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        }); 
}

function CreateStory() {
    const inputEl = useRef(null);
    const id = useRef(uuidv4())
    const onButtonClick = () => {
      // `current` points to the mounted text input element
      saveToEntries(inputEl.current.value, id);
      // await saveToStories(inputEl.current.value, id);
      console.log("test: is getting data from button?", inputEl);
    };
    return (
        <>
            <form>
                <div className="form-group">
                    <label htmlFor="prompt-input">Enter story prompt</label>
                    <textarea className="form-control" ref={inputEl} type="text" rows="10" />
                    <button id="entry-input" onClick={onButtonClick}>Submit</button>
                </div>
            </form>
        </>
    );
}

export default CreateStory;

// function AddEntry() {
//   const inputEl = useRef(null);
//   const onButtonClick = () => {
//     // `current` points to the mounted text input element
//     saveToEntries(inputEl.current.value);
//     console.log("test: is getting data from button?", inputEl);
//   };

//   return (
//   <>
//   <form>
//       <div className="form-group">
//           <label htmlFor="entry-input">Type your entry here</label>
//           <textarea className="form-control" ref={inputEl} type="text" rows="10" />
//             <button id="entry-input" onClick={onButtonClick}>Focus the input</button>
//       </div>
//   </form>
//   <button id="entry-input" onClick={deleteAllEntries}>Delete All Entries</button>
//   </>
//   )
// }