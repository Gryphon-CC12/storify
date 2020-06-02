import React, { useState, useEffect } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import {v4 as uuidv4} from "uuid";
const db = firebase.firestore();

function DisplayStory() {

  useEffect(() => {
    fetchEntriesIdsForStory("7AHzkX74jsjsjsjsjsjsjs");
	}, [])

	const [ textArr, setTextArr ] = useState([]);
	const [ storyArr, setStoryArr ] = useState([]);
  let newArr2 = [];

  async function fetchEntryText(id) {
  	let output = [];
    db.collection('Entries').where('id', '==', id).get()
    .then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
        output.push(doc.data().text);
			})
      console.log("output is", output)
		})
		return output;
  };

  async function fetchEntriesIdsForStory(id) {
		let output = [];
		let text_array = [];
    db.collection('StoryDatabase').where('id', '==', id).get()
    .then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
				output = doc.data().entries.map((id) => fetchEntryText(id))
				console.log("OUTPUTS for storyArr", output);
        Promise.all(output).then((output)=>{
          setStoryArr(output);
          newArr2.push(output)
          console.log("storyArr",storyArr)
        })
        console.log("storyArr is",storyArr)
        console.log("newArr2 is", newArr2)    
    })})
	};
// console.log("storyArr",storyArr)

  // fetchEntry("852ae944-dc26-4c9b-8b88-eecd9427d020");
  // fetchStory();
// let newArr3 = [];
//   setTimeout(function(){  Promise.all(newArr).then(values => {
//     console.log("values",values)
//     newArr3.push(values)
//   }) }, 3000);


	return (
		<div className="DisplayStory">
			Here is a story from Display Story:
      <p>{newArr2}</p>
			{/* <p>{fetchEntriesIdsForStory("7AHzkX74jsjsjsjsjsjsjs")}</p> */}
      {/* {fetchEntriesIdsForStory("7AHzkX74jsjsjsjsjsjsjs").map((item) => {
				return <p key={uuidv4()}>{item}</p>;
			})} */}
			<p>Test 2</p>
		</div>
	);
}

export default DisplayStory;
