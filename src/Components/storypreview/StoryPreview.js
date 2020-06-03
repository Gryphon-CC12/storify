import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StoryPreview.styles.scss';
// import DisplayStory from '../displaystory/DisplayStory';
import firebase from "../../firebaseConfig";

const db = firebase.firestore();

function StoryPreview(props) {

	const [ storyText, setStoryText ] = useState([]);
  const [imageURL, setImageURL] = useState("");

  function fetchFirstEntryForStory(id) {
    db.collection('StoryDatabase').where('id', '==', id).get()
    .then(function(querySnapshot) {
      let ids_array = [];
			querySnapshot.forEach(function(doc) {
      ids_array.push(doc.data().entries)
      })
      return ids_array[0][0];
    })
    .then(async id => {
      // console.log("ids_array", id)
      const data = await db.collection('Entries').where('id', '==', id).get();
      // console.log("DATA IS HERE?", data) 
      setStoryText(data.docs.map((doc) => {
        // console.log(doc.data().text)   
        return doc.data().text
      }));
    })
 };

 useEffect(() => {
  fetchFirstEntryForStory(props.storyProp.id);
  fetchImageURL(props.storyProp.id);
}, [props.storyProp.id])
 


// READ FROM DB
const fetchImageURL = async (id) => {
  const db = firebase.firestore();
  const data = await db.collection('StoryDatabase').where('id', '==', id).get();
  //console.log("IMAGE URL", data.docs;
  setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  //setImageURL(data.docs.map((doc) => doc.data()));
};


  // console.log("STORY PROPS??", props)
  return (
    <div className="card">
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className="preview-body" >
        <h5 className="preview-title">{props.storyProp.title}</h5>
        <p className="preview-text"> {storyText} </p>
        <img alt="user-uploaded story artwork" src={imageURL} width="200" height="150" />
        <Link to={{pathname: `/displaystory/${props.storyProp.id}`}}>
          <p>See full story</p>
        </Link>
        </div>
    </div>
  );
}

export default StoryPreview;

