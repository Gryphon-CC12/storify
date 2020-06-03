import React, { useRef } from 'react';
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import saveToEntries from "../../utils/saveToEntries"

const db = firebase.firestore();

// d5f485a7-bf1f-4c3f-8ad9-5b37cc46cb00
function saveToStories(event, id, author) {
    //event.preventDefault();
    console.log("e for stories", id);
    db.collection("StoryDatabase").add({
        id: uuidv4(),
        dateCreated: new Date(),
        likes: 0,
        author: author,
        isPrompt: true,
        maxEntries: 1,
        maxUsers: 1,
        upvotes: 0,
        entries: [id],
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
    const id = uuidv4();
    const author = "Harry Potter newest"
    console.log("IDDD", id)
    const onButtonClick = (event) => {
        // event.preventDefault();
      // `current` points to the mounted text input element
      saveToEntries(inputEl.current.value, id, author);
      saveToStories(inputEl.current.value, id, author);
      console.log("test: is getting data from button?", inputEl, id);
    };
    return (
        <>
        
            <form>
                <div className="form-group">
                    <label htmlFor="prompt-input">Enter story prompt</label>
                    <div>{id}</div>
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