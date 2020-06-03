import React, { useState, useEffect } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import {v4 as uuidv4} from "uuid";
const db = firebase.firestore();

function DisplayStory() {
	const [ textArr, setTextArr ] = useState([]);
	const [ storyArr, setStoryArr ] = useState([]);

  useEffect(() => {
    fetchEntriesIdsForStory("7AHzkX74jsjsjsjsjsjsjs");
	}, textArr)

  function fetchEntriesIdsForStory(id) {
		// let output = [];
		let text_array = [];
    db.collection('StoryDatabase').where('id', '==', id).get()
    .then(function(querySnapshot) {
      let ids_array = [];
			querySnapshot.forEach(function(doc) {
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
		      	querySnapshot2.forEach(function(doc) {
              text_array.push(doc.data().text);
              setStoryArr(storyArr => storyArr.concat(doc.data().text))
            })
          })
        })
    })
 };

	return (
		<div className="DisplayStory">
      Here is a story from Display Story:
      {storyArr.map((item) => { 
        return (
          <p key={uuidv4()}>{item}</p>
        )
      })}
			<p>Test 2</p>
		</div>
  );
}

export default DisplayStory;
