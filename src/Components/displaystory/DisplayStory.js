//****************** */
// Remaining TODOs for MVP
// - Implement time limit mechanics (if time is exceeded skip to next user), reset time upon new entry.
// - Implement email notification to user in turn.
// - Implement Genre
// - If no image is uploaded, add a default image
//****************** */
import React, { useState, useEffect, useContext, useRef } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import AddEntry from '../../Components/addentry/AddEntry'
import {v4 as uuidv4} from "uuid";
import { UserContext } from "../../providers/UserProvider";
import './DisplayStory.styles.scss';
import _ from 'lodash'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import FavoriteIcon from '@material-ui/icons/Favorite';

const db = firebase.firestore();

function DisplayStory(props) {
  const user = useContext(UserContext);
	const [storyArr, setStoryArr ] = useState([]);
  const [imageURL, setImageURL] = useState("https://bit.ly/2MEQ1yJ");
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

////ADD LIKES FUNCTION////
let addLike = async (entry_id, story_id) => {
  db.collection('Entries').where("id", "==", entry_id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        db.collection("Entries").doc(doc.id).update({"likes": firebase.firestore.FieldValue.increment(1)});
    });
  })

  db.collection('StoryDatabase').where("id", "==", story_id)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        db.collection("StoryDatabase").doc(doc.id).update({"likes": firebase.firestore.FieldValue.increment(1)});
    });
  })
}


async function checkTurns(email, story_id){ 
  const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
  let currentUsersNum = data.docs[0].data().emails.length;  //fetch current user number of story from database
  let currentEntriesNum = data.docs[0].data().entries.length;  //fetch current user number of story from database
  let currentUsersList = data.docs[0].data().emails;  //fetch current user number of story from database
  // let currentEntriesList = data.docs[0].data().entries;  //fetch current user number of story from database
  
  let turnNumber = currentEntriesNum % currentUsersNum;

  for (let user in currentUsersList) {
      if (turnNumber === user) {
        if (currentUsersList[user] === email)
        {
          setIsUserInTurn(true);
        } else {
          setIsUserInTurn(false);
        }
        setUserInTurn(currentUsersList[user])
      } else {
      }
    }
  }

  async function checkMaxContributors(email, story_id){

    const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
    // setIsMaxContributors(data.docs.map((doc) => doc.data().imageUrl));
    let maxUsers = data.docs[0].data().maxUsers;   //fetch max Users limit from database
    let currentUsers = data.docs[0].data().emails.length;  //fetch current user number of story from database

    if (currentUsers < maxUsers) {    //if current users is not maxed set the state accordingly
      setIsMaxContributors(false)
    }
    else {
      setIsMaxContributors(true)
    }
  }

///// check max number of entries
  async function checkMaxEntries(email, story_id){

    const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
    // setIsMaxContributors(data.docs.map((doc) => doc.data().imageUrl));
    let maxEntries = data.docs[0].data().maxEntries;   //fetch max Users limit from database
    let currentEntries = data.docs[0].data().entries.length;  //fetch current user number of story from database

    setNumOfEntries(maxEntries - currentEntries);
    if (currentEntries < maxEntries) {    //if current users is not maxed set the state accordingly
      setIsMaxEntries(false)
    }
    else {
      setIsMaxEntries(true)
    }
    // console.log('isMaxEntries', isMaxEntries);
  }


//// THIS FUNCTION ADDS A NEW CONTRIBUTOR TO THE STORY /////
  async function addToContributors(email, story_id){
      const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
      let maxUsers = data.docs[0].data().maxUsers;   //fetch max Users limit from database
      let currentUsers = data.docs[0].data().emails.length; 
      if (currentUsers < maxUsers){    //if current users is not maxed out add a new contributor
        db.collection('StoryDatabase').where("id", "==", story_id)  
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              //let maxUsers = db.collection("StoryDatabase").doc(doc.maxUsers);
              db.collection("StoryDatabase").doc(doc.id).update({"emails": firebase.firestore.FieldValue.arrayUnion(email)});
              // const data = await db.collection('StoryDatabase').where('id', '==', story_id).get().update({"emails": firebase.firestore.FieldValue.arrayUnion(email)});
            });
        })
      }
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    entry: {
      padding: theme.spacing(2),
      textAlign: 'justified',
      color: theme.palette.text.secondary,
    },
    details: {
      padding: theme.spacing(2),
      textAlign: 'end',
      color: theme.palette.text.secondary,
    },
  }));
  const classes = useStyles();
  
  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <img alt="user-uploaded story artwork" src={imageURL} className="img-fluid" width="600" height="400" />
        </Grid>

        <Grid id="story-title" item xs={9}>
          <h1 className="story-title">{title}</h1>
        </Grid>
        
        {storyArr.map((item) => { 
          return (
            <>
              <Grid key={uuidv4()} item xs={12}>
                <Paper id="story-text" className={classes.entry} elevation={3}>{item.text}</Paper>
                </Grid>
                <Grid item xs={6}>
               
                </Grid>
                <Grid item xs={6}>
                <Typography id="story-author" className={classes.details}>{item.author}
                  <span id="likes" onClick={() => addLike(item.entry_id, item.story_id)}>
                  <FavoriteIcon /> {item.likes}
                  </span>
                  </Typography>
                </Grid>
              </>
            )
          })}
          {isContributor ?
            isMaxEntries ?
            <p></p>  
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
              <p></p>  
          :
          <button onClick={() => addToContributors(user.email, storyArr[0].story_id)}>Join the Story</button>
          }

      </Grid>
    </Container>
  );
}

export default DisplayStory;
