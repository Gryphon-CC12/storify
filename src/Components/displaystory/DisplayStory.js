import React, { useState, useEffect, useContext } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import AddEntry from '../addentry/AddEntry'
import {v4 as uuidv4} from "uuid";
import { UserContext } from "../../providers/UserProvider";
import './DisplayStory.styles.scss';
import deleteOneStory from '../../utils/deleteOneStory';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import FavoriteIcon from '@material-ui/icons/Favorite';

const db = firebase.firestore();

function DisplayStory(props) {
  const user = useContext(UserContext);
  const [storyArr, setStoryArr] = useState([]);
  const [imageURL, setImageURL] = useState("https://bit.ly/2MEQ1yJ");
  const [title, setTitle] = useState("")
  const [isContributor, setIsContributor] = useState(false)
  // const [author, setAuthor] = useState("")
  const [noOfUsersState, setNoOfUsersState] = useState(0)
  const [isMaxContributors, setIsMaxContributors] = useState(true)
  const [isMaxEntries, setIsMaxEntries] = useState(true)
  const [numOfEntries, setNumOfEntries] = useState(0)
  const [userInTurn, setUserInTurn] = useState("")
  const [userInTurnName, setUserInTurnName] = useState("");
  const [isUserInTurn, setIsUserInTurn] = useState(false)
  const [likes, setLikes] = useState([])

  useEffect(() => {
    fetchEntriesForStory(props.match.params.id, user.email);
    fetchImageURL(props.match.params.id);
    checkMaxContributors(user.email, props.match.params.id)
    checkMaxEntries(user.email, props.match.params.id)
    checkTurns(user.email, props.match.params.id)
    // checkAuthor(user.email, props.match.params.id)
    getCurrentNumberOfParticipants(props.match.params.id)
  }, [user.email, props.match.params.id])  

  let authorEmail; // TODO somehow couldnt use useState to update this; needs to be fixed later
  function fetchEntriesForStory(storyId, userEmail) {
    db.collection('StoryDatabase').where('id', '==', storyId).get()
      .then(function (querySnapshot) {
        let idsArray = [];
        querySnapshot.forEach(function (doc) {
          idsArray.push(doc.data().entries)
          setIsContributor(doc.data().emails.includes(userEmail))
          setTitle(doc.data().title);
          let emails = doc.data().emails;
          authorEmail = emails[0]
        })
        return idsArray[0];
      })
      .then(idsArray => {
        idsArray.forEach((id) => {
          db.collection('Entries').where('id', '==', id).get()
            .then(function (querySnapshot2) {
              querySnapshot2.forEach(function (doc) {
                let thisAuthor = doc.data().author;
                let thisText = doc.data().text;
                thisText = thisText.split(/\n/g)
                let thisLikes = doc.data().likes;
                let entryId = doc.data().id
                let userEmail = doc.data().email;
                setStoryArr(storyArr => storyArr.concat([
                  {
                    "author": thisAuthor,
                    "text": thisText,
                    "likes": thisLikes,
                    "entry_id": entryId,
                    "story_id": storyId,
                    "user_email": userEmail
                  }
                ]));
                
                setLikes(likes => likes.concat([
                  {
                    "entryId": entryId,
                    "likes": thisLikes
                  }
                ]))
              })
            })
        })
      })
  };

  const getLikes = (entryId) => {
    for (const item of likes) {
      if (item.entryId === entryId) {
        return item.likes;
      }
    }
  }

  const updateLikeState = (entryId) => {
    let newLikes = [...likes]
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].entryId === entryId) {
        newLikes[i].likes += 1;
        setLikes(newLikes);
      }
    }
  }

  // READ FROM DB ///
  const fetchImageURL = async (id) => {
    const db = firebase.firestore();
    const data = await db.collection('StoryDatabase').where('id', '==', id).get();
    setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  };

  const addLike = async (entryId, storyId) => {
    db.collection('Entries').where("id", "==", entryId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          db.collection("Entries").doc(doc.id).update({ "likes": firebase.firestore.FieldValue.increment(1) });
        });
        updateLikeState(entryId)
      })
    setLikes(likes + 1)

    db.collection('StoryDatabase').where("id", "==", storyId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          db.collection("StoryDatabase").doc(doc.id).update({ "likes": firebase.firestore.FieldValue.increment(1) });
        });
      })
  }

  async function checkTurns(email, storyId) { 
    
   db.collection('StoryDatabase').where('id', '==', storyId).get()
   .then(function(querySnapshot) {
    querySnapshot.forEach(async function(doc) {
      
      let currentInTurn = await doc.data().inTurn;
      
      if (currentInTurn == email) {  
          setIsUserInTurn(true);
        } else {
          setIsUserInTurn(false);
        }
      setUserInTurn(currentInTurn)
      const userData = await db.collection('users').where('email', '==', currentInTurn).get();
      setUserInTurnName(userData.docs[0].data().displayName);     
    })
  })
  }

  async function checkMaxContributors(email, story_id) {

    const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
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
  async function checkMaxEntries(email, story_id) {
    const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
    let maxEntries = data.docs[0].data().maxEntries;   //fetch max Users limit from database
    let currentEntries = data.docs[0].data().entries.length;  //fetch current user number of story from database

    setNumOfEntries(maxEntries - currentEntries);
    if (currentEntries < maxEntries) {    //if current users is not maxed set the state accordingly
      setIsMaxEntries(false)
    }
    else {
      setIsMaxEntries(true)
    }
  }

//// THIS FUNCTION ADDS A NEW CONTRIBUTOR TO THE STORY /////
  async function addToContributors(email, storyId){
    const data = await db.collection('StoryDatabase').where('id', '==', storyId).get();
    let maxUsers = data.docs[0].data().maxUsers;   //fetch max Users limit from database
    let currentUsers = data.docs[0].data().emails.length; 
    if (currentUsers < maxUsers){    //if current users is not maxed out add a new contributor
      db.collection('StoryDatabase').where("id", "==", storyId)  
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          //let maxUsers = db.collection("StoryDatabase").doc(doc.maxUsers);
          db.collection("StoryDatabase").doc(doc.id).update({ "emails": firebase.firestore.FieldValue.arrayUnion(email) });
        });
      })
    }
  
    checkTurns(email, storyId);

    setTimeout(() => {window.location.reload(false);}, 1000);
  }

  async function handleDeleteStory(e) {
    e.preventDefault();
    await deleteOneStory(props.match.params.id, user.email);
    props.history.push('/');
  }

  async function getCurrentNumberOfParticipants(storyId) {
    const data = await db.collection('StoryDatabase').where('id', '==', storyId).get();
    let currentUsers = data.docs[0].data().emails.length;
    setNoOfUsersState(currentUsers)
  }

  const renderDeleteButton = () => {
    return (
      <button
      className="btn btn-danger"
      onClick={handleDeleteStory}
      >Delete Story
      </button>
    )
  }

  const DisplayPlayerNumbers = () => {
    if (noOfUsersState > 0) {
      return (
        <p> Currently {noOfUsersState} authors in the game!</p>
      )
    } else {
      return (
        <p>Waiting for players to join! Click join to write the next entry.</p>
      )
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
    <Container maxWidth="md" key={uuidv4()}>
      <Grid container spacing={2}>
        {
          user.email === authorEmail || user.admin === true ?
            renderDeleteButton() : ""
        }
        <Grid item xs={12} lg={3}>
          <img key={uuidv4()} alt="user-uploaded story artwork" src={imageURL} className="img-fluid" width="600" height="400" />
        </Grid>

        <Grid id="story-title" item xs={12} lg={9}>
          <h1 className="story-title">{title}</h1>
        </Grid>
        
        {storyArr.map((item) => { 
          return (
            <React.Fragment key={uuidv4()}>
              <Grid key={uuidv4()} item xs={12}>
                <Paper id="story-text" className={classes.entry} elevation={3}>
                  {item.text.map(paragraph => {
                    return (
                      <p key={uuidv4()}>{paragraph}</p>
                    )
                  })}
                </Paper>
              </Grid>
 
              <Grid item xs={6}>
                <Typography id="story-author" className={classes.details}>
                  <span id="likes" onClick={() => addLike(item.entry_id, item.story_id)}>
                    {getLikes(item.entry_id)}
                    <FavoriteIcon /> <br />
                  </span>
                  {item.author}
                </Typography>
              </Grid>
            </React.Fragment>
          )
        })}
        
        <div className="container">
          <DisplayPlayerNumbers />
          {
            isContributor ?
              isMaxEntries ?
                <p key={uuidv4()}>This Story has completed</p>  
              :
                isUserInTurn ?
                  <Grid item xs={12} lg={12}>
                    <p>This story has {numOfEntries} entries left</p>
                    <AddEntry id={props.match.params.id} />
                  </Grid>
                :
                  <>
                    <p key={uuidv4()}>
                      {
                        userInTurn ?
                          <p key={uuidv4()}>Currently {userInTurnName}'s turn!</p>
                        :
                        "Waiting for players!"
                      }
                    </p>
                    <br />{" "}
                  </>
                :
                  isMaxContributors ?
                    <p key={uuidv4()}>This Story has Max Contributor</p>  
                :
                  <button
                    className="btn btn-dark"
                    key={uuidv4()}
                    onClick={() => addToContributors(user.email, storyArr[0].story_id)}
                  >Join the Story</button>
          }
        </div>
      </Grid>
    </Container>
  );
}

export default DisplayStory;
