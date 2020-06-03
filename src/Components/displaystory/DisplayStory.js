import React, { useState, useEffect } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import {v4 as uuidv4} from "uuid";
const db = firebase.firestore();

function DisplayStory() {



	const [ textArr, setTextArr ] = useState([]);
	const [ storyArr, setStoryArr ] = useState([]);
  let newArr2 = [];

  useEffect(() => {
    fetchEntriesIdsForStory("7AHzkX74jsjsjsjsjsjsjs");
	}, textArr)

  // function fetchEntryText(id) {
  // 	let output = [];
  //   db.collection('Entries').where('id', '==', id).get()
  //   .then(function(querySnapshot) {
	// 		querySnapshot.forEach(function(doc) {
  //       output.push(doc.data().text);
	// 		})
  //   console.log("output is", output)
  //   })
	// 	return output;
  // };

  // function fetchEntriesIdsForStory(id) {
	// 	let output = [];
	// 	let text_array = [];
  //   db.collection('StoryDatabase').where('id', '==', id).get()
  //   .then(function(querySnapshot) {
	// 		querySnapshot.forEach(function(doc) {
  //       // doc.data() is never undefined for query doc snapshots
  //       let outputPromise = doc.data().entries.map((id) => {
  //         let output = [];
  //         db.collection('Entries').where('id', '==', id).get()
  //         .then(function(querySnapshot) {
  //           querySnapshot.forEach(function(doc) {
  //             output.push(doc.data().text);
  //           })
  //         console.log("output is", output)
  //         })
  //         return outpu
  //       })
  //       console.log("output outputPromise", outputPromise)
  //       newArr2 = Promise.all(outputPromise)
  //       console.log("output newArr2", newArr2)
  //       setStoryArr(outputPromise)
  //   })})
  // };
  

  function fetchEntriesIdsForStory(id) {
		// let output = [];
		let text_array = [];
    db.collection('StoryDatabase').where('id', '==', id).get()
    .then(function(querySnapshot) {
      let ids_array = [];
			querySnapshot.forEach(function(doc) {
      // ids_array.push(doc.data().entries.forEach(entry=>entry))
      ids_array.push(doc.data().entries)
      })
      console.log("ids_array", ids_array.length)
      return ids_array[0];
    }
    )
    .then(ids_array => {
        ids_array.forEach((id) => {
          db.collection('Entries').where('id', '==', id).get()
          .then(function(querySnapshot2) {
            console.log("l74");
		      	querySnapshot2.forEach(function(doc) {
              console.log("doc.data().text", doc.data().text)
              text_array.push(doc.data().text);
              setStoryArr(storyArr => storyArr.concat(doc.data().text))
              
            })
          })
        })
    })

  };
	 
//  setTimeout(function(){   }, 500);
	return (
		<div className="DisplayStory">
      Here is a story from Display Story:
      {console.log("storyArr",storyArr)}
      {<p>{storyArr}</p>}
			<p>Test 2</p>
		</div>
  );
}

export default DisplayStory;
