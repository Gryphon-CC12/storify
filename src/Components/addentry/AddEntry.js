import React, {useState, useRef} from 'react';
import firebase from "../../firebaseConfig";
import {v4 as uuidv4} from "uuid";


const db = firebase.firestore();

function savetoDatabase(event) {
    //event.preventDefault();
    console.log("e", event)
    
    db.collection("Entries").add({
            id: uuidv4(),
            text: event,
            date: new Date(),
            likes: 0,
            author: "Harry Potter",
        })
        .then(function () {
            console.log("Document successfully written!");
            //alert("Entry successfully saved!")
            //window.location = “/”;
            // setTimeout(function(){ alert("Entry successfully saved!") }, 1000);
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}


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


function AddEntry() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
      // `current` points to the mounted text input element
      savetoDatabase(inputEl.current.value);
      console.log("test: is getting data from button?", inputEl);
    };

    return (
    <>
    <form>
        <div className="form-group">
            <label htmlFor="entry-input">Type your entry here</label>
            <textarea className="form-control" ref={inputEl} type="text" rows="10" />
            <button id="entry-input" onClick={onButtonClick}>Focus the input</button>
        </div>
    </form>
    <button id="entry-input" onClick={deleteAllEntries}>Delete All Entries</button>
    </>
    )
}

export default AddEntry;

{/* <button class="btn btn-warning" onClick={() => savetoDatabase()}>Save In my Database</button> */}
