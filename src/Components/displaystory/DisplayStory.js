import React, { useState, useEffect, useContext } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import AddEntry from '../../Components/addentry/AddEntry'
import {v4 as uuidv4} from "uuid";
import { UserContext } from "../../providers/UserProvider";
import './DisplayStory.styles.scss';
import deleteOneStory from '../../utils/deleteOneStory';
// import _ from 'lodash'
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
  const [isMaxContributors, setIsMaxContributors] = useState(true)
  const [isMaxEntries, setIsMaxEntries] = useState(true)
  const [numOfEntries, setNumOfEntries] = useState(0)
  const [userInTurn, setUserInTurn] = useState("")
  const [isUserInTurn, setIsUserInTurn] = useState(false)
  const [likes, setLikes] = useState([])

  useEffect(() => {
    fetchEntriesForStory(props.match.params.id, user.email);
    fetchImageURL(props.match.params.id);
    checkMaxContributors(user.email, props.match.params.id)
    checkMaxEntries(user.email, props.match.params.id)
    checkTurns(user.email, props.match.params.id)
    // checkAuthor(user.email, props.match.params.id)
  }, [user.email, props.match.params.id])

  let authorEmail; // TODO somehow couldnt use useState to update this; needs to be fixed later
  function fetchEntriesForStory(story_id, user_email) {
    db.collection('StoryDatabase').where('id', '==', story_id).get()
      .then(function (querySnapshot) {
        let ids_array = [];
        querySnapshot.forEach(function (doc) {
          ids_array.push(doc.data().entries)
          setIsContributor(doc.data().emails.includes(user_email))
          setTitle(doc.data().title);
          let emails = doc.data().emails;
          authorEmail = emails[0]
        })
        return ids_array[0];
      })
      .then(ids_array => {
        ids_array.forEach((id) => {
          db.collection('Entries').where('id', '==', id).get()
            .then(function (querySnapshot2) {
              querySnapshot2.forEach(function (doc) {
                let thisAuthor = doc.data().author;
                let thisText = doc.data().text;
                thisText = thisText.split(/\n/g)
                let thisLikes = doc.data().likes;
                let thisId = doc.data().id
                let thisEmail = doc.data().email;
                setStoryArr(storyArr => storyArr.concat([
                  {
                    "author": thisAuthor,
                    "text": thisText,
                    "likes": thisLikes,
                    "entry_id": thisId,
                    "story_id": story_id,
                    "user_email": thisEmail
                  }
                ]));
                
                setLikes(likes => likes.concat([
                  {
                    "entry_id": thisId,
                    "likes": thisLikes
                  }
                ]))
              })
            })
        })
      })
  };

  const getLikes = (entry_id) => {
    for (const item of likes) {
      if (item.entry_id === entry_id) {
        return item.likes;
      }
    }
  }

  const updateLikeState = (entry_id) => {
    let newLikes = [...likes]
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].entry_id === entry_id) {
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


let addLike = async (entry_id, story_id) => {
  db.collection('Entries').where("id", "==", entry_id)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        db.collection("Entries").doc(doc.id).update({ "likes": firebase.firestore.FieldValue.increment(1) });
      });
      updateLikeState(entry_id)
    })
  setLikes(likes + 1)

  db.collection('StoryDatabase').where("id", "==", story_id)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        db.collection("StoryDatabase").doc(doc.id).update({ "likes": firebase.firestore.FieldValue.increment(1) });
      });
    })
}

async function checkTurns(email, storyId){ 
  const data = await db.collection('StoryDatabase').where('id', '==', storyId).get();
  let currentUsersNum = data.docs[0].data().emails.length;  //fetch current user number of story from database
  let currentEntriesNum = data.docs[0].data().entries.length;  //fetch current user number of story from database
  let currentUsersList = data.docs[0].data().emails;  //fetch current user number of story from database
  
  let turnNumber = currentEntriesNum % currentUsersNum;

  for (let user in currentUsersList) {
    // eslint-disable-next-line eqeqeq
    if (turnNumber == user) {  //Using '==' because comparing a string with a number 
        if (currentUsersList[user] === email) {
          setIsUserInTurn(true);
        } else {
          setIsUserInTurn(false);
        }
        setUserInTurn(currentUsersList[user])
      }
    }
}
console.log(isUserInTurn)

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
  async function addToContributors(email, story_id){
      const data = await db.collection('StoryDatabase').where('id', '==', story_id).get();
      let maxUsers = data.docs[0].data().maxUsers;   //fetch max Users limit from database
      let currentUsers = data.docs[0].data().emails.length; 
      if (currentUsers < maxUsers){    //if current users is not maxed out add a new contributor
        db.collection('StoryDatabase').where("id", "==", story_id)  
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            //let maxUsers = db.collection("StoryDatabase").doc(doc.maxUsers);
            db.collection("StoryDatabase").doc(doc.id).update({ "emails": firebase.firestore.FieldValue.arrayUnion(email) });
          });
        })
      }
      setTimeout(() => {window.location.reload(false);}, 1000);
  }

  async function handleDeleteStory() {
    await deleteOneStory(props.match.params.id, user.email);
    props.history.push('/');
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
          {isContributor ?
            isMaxEntries ?
            <p key={uuidv4()}>This Story has completed</p>  
            :
            isUserInTurn ?
              <Grid item xs={12} lg={3}>
              <p>This story has {numOfEntries} entries left</p>
                <AddEntry id={props.match.params.id} />
              </Grid>
            :
              <p key={uuidv4()}>Currently {userInTurn}'s turn!</p>
            
          :
          isMaxContributors ?
              <p key={uuidv4()}>This Story has Max Contributor</p>  
          :
          <button className="btn btn-dark" key={uuidv4()} onClick={() => addToContributors(user.email, storyArr[0].story_id)}>Join the Story</button>
          }

      </Grid>
    </Container>
  );
}

export default DisplayStory;
