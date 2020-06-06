import React, { useState, useEffect, useContext, useRef } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import AddEntry from '../../Components/addentry/AddEntry'
import {v4 as uuidv4} from "uuid";
import { UserContext } from "../../providers/UserProvider";
import './DisplayStory.styles.scss';
import _ from 'lodash'

const db = firebase.firestore();

function DisplayStory(props) {
  const user = useContext(UserContext);
	const [storyArr, setStoryArr ] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [title, setTitle] = useState("")
  const [isContributor, setIsContributor] = useState(false)
  const [isMaxContributors, setIsMaxContributors] = useState(true)
  const [isMaxEntries, setIsMaxEntries] = useState(true)
  const [numOfEntries, setNumOfEntries] = useState(0)
  const [userInTurn, setUserInTurn] = useState("")
  const [isUserInTurn, setIsUserInTurn] = useState(false)
  //const idLikesRef = useRef();

  useEffect(() => {
    // console.log("PROPS", props.match.params.id);
    fetchEntriesForStory(props.match.params.id, user.email);
    fetchImageURL(props.match.params.id);
    checkMaxContributors(user.email, props.match.params.id)
    checkMaxEntries(user.email, props.match.params.id)
    checkTurns(user.email, props.match.params.id)
	},[props.match.params.id])

  function fetchEntriesForStory(story_id, user_email) {
    db.collection('StoryDatabase').where('id', '==', story_id).get()
    .then(function(querySnapshot) {
      let ids_array = [];
			querySnapshot.forEach(function(doc) {
      ids_array.push(doc.data().entries)
      console.log("Carlos's email?", doc.data().emails.includes(user_email))
      setIsContributor(doc.data().emails.includes(user_email))
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
              let thisEmail = doc.data().email;
              // console.log('thisEmail', thisEmail);
              setStoryArr(storyArr => storyArr.concat([{"author": thisAuthor, "text": thisText, "likes" : thisLikes, "entry_id" : thisId, "story_id": story_id, "user_email": thisEmail}]));
              // setAuthorArr(authorArr => authorArr.concat(doc.data().text))
            })
          })
        })
    })
 };

// READ FROM DB ///
const fetchImageURL = async (id) => {
  const db = firebase.firestore();
  const data = await db.collection('StoryDatabase').where('id', '==', id).get();
  //console.log("IMAGE URL", data.docs;
  setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  //setImageURL(data.docs.map((doc) => doc.data()));
};

console.log("StoryARR", storyArr)

////ADD LIKES FUNCTION////
let addLike = async (entry_id, story_id) => {
  db.collection('Entries').where("id", "==", entry_id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
         console.log('id',entry_id);  
        db.collection("Entries").doc(doc.id).update({"likes": firebase.firestore.FieldValue.increment(1)});
    });
  })

  db.collection('StoryDatabase').where("id", "==", story_id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
         console.log('id',story_id);  
        db.collection("StoryDatabase").doc(doc.id).update({"likes": firebase.firestore.FieldValue.increment(1)});
    });
  })
}


async function checkTurns(email,story_id){ 
  const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
  let currentUsersNum = data.docs[0].data().emails.length;  //fetch current user number of story from database
  let currentEntriesNum = data.docs[0].data().entries.length;  //fetch current user number of story from database
  let currentUsersList = data.docs[0].data().emails;  //fetch current user number of story from database
  let currentEntriesList = data.docs[0].data().entries;  //fetch current user number of story from database
  
  let turnNumber = currentEntriesNum%currentUsersNum;

  for (let user in currentUsersList) {
      if (turnNumber == user) {
        if (currentUsersList[user] == email)
        {
          setIsUserInTurn(true);
        } else {
          setIsUserInTurn(false);
        }
        console.log("turn", currentUsersList[user], email)
        setUserInTurn(currentUsersList[user])
      } else {
        console.log("not turn", currentUsersList[user], email)
        
      }
    }
}

async function checkMaxContributors(email, story_id){
  console.log("story_id for max Contributors", story_id)

  const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
  // setIsMaxContributors(data.docs.map((doc) => doc.data().imageUrl));
  let maxUsers = data.docs[0].data().maxUsers;   //fetch max Users limit from database
  let currentUsers = data.docs[0].data().emails.length;  //fetch current user number of story from database
  console.log('currentUsers', currentUsers);
  if (currentUsers < maxUsers) {    //if current users is not maxed set the state accordingly
    setIsMaxContributors(false)
  }
  else {
    setIsMaxContributors(true)
  }
  console.log('isMaxContributors', isMaxContributors);
}

///// check max number of entries
async function checkMaxEntries(email, story_id){
  console.log("story_id for max Contributors", story_id)

  const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
  // setIsMaxContributors(data.docs.map((doc) => doc.data().imageUrl));
  let maxEntries = data.docs[0].data().maxEntries;   //fetch max Users limit from database
  let currentEntries = data.docs[0].data().entries.length;  //fetch current user number of story from database
  console.log('currentEntries', currentEntries);
  console.log('maxEntries',maxEntries);
  setNumOfEntries(maxEntries - currentEntries);
  if (currentEntries < maxEntries) {    //if current users is not maxed set the state accordingly
    console.log("currentEntries < maxEntries", currentEntries < maxEntries);
    setIsMaxEntries(false)
  }
  else {
    console.log("currentEntries < maxEntries", currentEntries < maxEntries);
    setIsMaxEntries(true)
  }
  // console.log('isMaxEntries', isMaxEntries);
}


//// THIS FUNCTION ADDS A NEW CONTRIBUTOR TO THE STORY /////
async function addToContributors(email, story_id){
    const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
    console.log("StoryArray", storyArr[0].story_id)
    console.log('story_id for Contributors', story_id);
    let maxUsers = data.docs[0].data().maxUsers;   //fetch max Users limit from database
    let currentUsers = data.docs[0].data().emails.length; 
    if (currentUsers < maxUsers){    //if current users is not maxed out add a new contributor
      db.collection('StoryDatabase').where("id", "==", story_id)  
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log('id',story_id);
            //let maxUsers = db.collection("StoryDatabase").doc(doc.maxUsers);
            console.log('doc', doc.id);
            //console.log("maxUsers", maxUsers)
            db.collection("StoryDatabase").doc(doc.id).update({"emails": firebase.firestore.FieldValue.arrayUnion(email)});
            // const data = await db.collection('StoryDatabase').where('id', '==', story_id).get().update({"emails": firebase.firestore.FieldValue.arrayUnion(email)});
            console.log("Contributor Added")
          });
      })
    }

  }

console.log('userInTurn',userInTurn);
console.log('isUserInTurn',isUserInTurn);


	return (
    <div className="container DisplayStory">
      <div className="row image-row justify-center">
        <img alt="user-uploaded story artwork" src={imageURL} className="img-fluid" width="600" height="400" />
      </div>
      <div className="row">
        <h1 className="story-title">{title}</h1>
      </div>
      {/* const = {author, text} = props  */}
      {storyArr.map((item) => { 
          return (
            <div key={uuidv4()}>
              <div className="story-container row">
                <div className="col">
                  <p className="story-text">{item.text}</p>
                </div>    
              </div>
              <div className="row">
                <div className="col">
                  <span><p className="story-author" key={item.id}>{item.author}</p><button onClick={() => addLike(item.entry_id, item.story_id)}>Like ❤️</button><p>{item.likes} Likes</p></span>
                </div>
              </div>
            </div>
          )
        })}

        {isContributor ?
          isMaxEntries ?
          <p>This story is finished</p>  
          :
          isUserInTurn ?
            <div className="row">
            <div className="col">
              <p>This story has {numOfEntries} entries left</p>
              <AddEntry id={props.match.params.id}/>
            </div>
            </div>
          :
          <p>User in turn: {userInTurn} </p>
        :
        isMaxContributors ?
            <p>Sorry this story has max Contributors already</p>  
        :
        <button onClick={() => addToContributors(user.email, storyArr[0].story_id)}>Click to Join Story</button>
        }
    </div>
  );
}

export default DisplayStory;
