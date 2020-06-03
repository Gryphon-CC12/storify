import React, { useState, useEffect } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import AddEntry from '../../Components/addentry/AddEntry'
import {v4 as uuidv4} from "uuid";
const db = firebase.firestore();

function DisplayStory(props) {
	const [ storyArr, setStoryArr ] = useState([]);
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    // console.log("PROPS", props.match.params.id);
    fetchEntriesForStory(props.match.params.id);
    fetchImageURL(props.match.params.id);
	},[props.match.params.id])

  function fetchEntriesForStory(id) {
    db.collection('StoryDatabase').where('id', '==', id).get()
    .then(function(querySnapshot) {
      let ids_array = [];
			querySnapshot.forEach(function(doc) {
      ids_array.push(doc.data().entries)
      })
      return ids_array[0];
    })
    .then(ids_array => {
        ids_array.forEach((id) => {
          db.collection('Entries').where('id', '==', id).get()
          .then(function(querySnapshot2) {
		      	querySnapshot2.forEach(function(doc) {
              setStoryArr(storyArr => storyArr.concat(doc.data().text))
            })
          })
        })
    })
 };

 
// READ FROM DB
const fetchImageURL = async (id) => {
  const db = firebase.firestore();
  const data = await db.collection('StoryDatabase').where('id', '==', id).get();
  //console.log("IMAGE URL", data.docs;
  setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  //setImageURL(data.docs.map((doc) => doc.data()));
};

	return (
		<div className="container DisplayStory">
      <div className="row">
        <img alt="user-uploaded story artwork" src={imageURL} width="600" height="400" />
        {storyArr.map((item) => { 
          return (
            <div className="col-2">
              <p key={uuidv4()}>{item}</p>
            </div>
          )
        })}
      </div>
      <div className="row">
        <div className="col">
          <AddEntry id={props.match.params.id}/>
        </div>
      </div>
		</div>
  );
}

export default DisplayStory;
