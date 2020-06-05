import React, { useState, useEffect, useContext } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import AddEntry from '../../Components/addentry/AddEntry'
import {v4 as uuidv4} from "uuid";
import { UserContext } from "../../providers/UserProvider";
import './DisplayStory.styles.scss';

const db = firebase.firestore();

function DisplayStory(props) {
  const user = useContext(UserContext);
	const [storyArr, setStoryArr ] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [title, setTitle] = useState("")

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
      setTitle(doc.data().title);
      })
      return ids_array[0];
    })
    .then(ids_array => {
        ids_array.forEach((id) => {
          db.collection('Entries').where('id', '==', id).get()
          .then(function(querySnapshot2) {
		      	querySnapshot2.forEach(function(doc) {
              let thisAuthor = doc.data().author;
              let thisText = doc.data().text;
              let thisLikes = doc.data().likes;
              let thisId = doc.data().id
              setStoryArr(storyArr => storyArr.concat([{"author": thisAuthor, "text": thisText, "likes" : thisLikes, "id" : thisId}]));
              // setAuthorArr(authorArr => authorArr.concat(doc.data().text))
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

console.log("StoryARR", storyArr)

function addLike(id){
///.
  db.collection('Entries').where("id", "==", id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // Build doc ref from doc.id
        db.collection("Entries").doc(doc.id).update({"likes": firebase.firestore.FieldValue.increment(1)});
    });
// db.collection('Entries').where('id', '==', id).get().update({"likes": firebase.firestore.FieldValue.increment()});
  })
  }
	return (
		<div className="container DisplayStory">
      <div className="row image-row justify-center">
        <img alt="user-uploaded story artwork" src={imageURL} class="img-fluid" width="600" height="400" />
      </div>
      <div className="row">
        <h1 className="story-title">{title}</h1>
      </div>
      {/* const = {author, text} = props  */}
      {storyArr.map((item) => { 
          return (
            <>
              <div className="story-container row">
                <div className="col">
                  <p className="story-text">{item.text}</p>
                </div>    
              </div>
              <div className="row">
                <div className="col">
                  <span><p className="story-author" key={uuidv4()}>{item.author}</p><button onClick={addLike(item.id)}>Like ❤️</button><p>{item.likes} Likes</p></span>
                </div>
              </div>
            </>
          )
        })}
        <div className="row">
        <div className="col">
          <AddEntry id={props.match.params.id}/>
        </div>
      </div>
		</div>
  );
}

export default DisplayStory;
