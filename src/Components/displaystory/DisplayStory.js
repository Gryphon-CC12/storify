/* eslint-disable eqeqeq */
import React, { useState, useEffect, useContext } from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';
import AddEntry from '../addentry/AddEntry'
import {v4 as uuidv4} from "uuid";
import { UserContext } from "../../providers/UserProvider";
import './DisplayStory.styles.scss';
import deleteOneStory from '../../utils/deleteOneStory';
import Grid from '@material-ui/core/Grid';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  LineShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  RedditIcon,
  TwitterIcon,
  LineIcon,
} from "react-share";

const db = firebase.firestore();

function DisplayStory(props) {
  const user = useContext(UserContext);
  const story_id = props.match.params.id;

  const [storyArr, setStoryArr] = useState([]);
  const [imageURL, setImageURL] = useState("https://bit.ly/2MEQ1yJ");
  const [title, setTitle] = useState("");
  const [isContributor, setIsContributor] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);  //makes textarea disapear after clicking submit entry in addEntry
  const [numOfEntry, setNumOfEntry] = useState(0);  //makes textarea disapear after clicking submit entry in addEntry
  const [noOfUsersState, setNoOfUsersState] = useState(0);
  const [maxNoOfUsersState, setMaxNoOfUsersState] = useState(0);
  const [isMaxContributors, setIsMaxContributors] = useState(true);
  const [isMaxEntries, setIsMaxEntries] = useState(true);
  const [maxNoOfEntries, setMaxNoOfEntries] = useState(true);
  const [currentEntries, setCurrentEntries] = useState(0);
  const [numOfEntries, setNumOfEntries] = useState(0);
  const [userInTurn, setUserInTurn] = useState("")
  const [userInTurnName, setUserInTurnName] = useState("");
  const [isUserInTurn, setIsUserInTurn] = useState(false);
  const [likes, setLikes] = useState([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    fetchEntriesForStory(props.match.params.id, user.email);
    fetchImageURL(props.match.params.id);
    checkMaxContributors(user.email, props.match.params.id)
    checkMaxEntries(user.email, props.match.params.id)
    checkTurns(user.email, props.match.params.id)
    // checkAuthor(user.email, props.match.params.id)
    getCurrentNumberOfParticipants(props.match.params.id)
    calculateTimeLeft();
  }, [user.email, props.match.params.id])  

  function calculateTimeLeft(){
    db.collection('StoryDatabase').get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(async function(doc) {
        let currentTimeLimit = doc.data().timeLimit;
        let currentLastModified = doc.data().lastModified.seconds;
        let currentEndingTime = 0;
        let currentTimeStamp = Math.round((new Date()).getTime() / 1000);
        // let currentTimeStamp = (new Date()).seconds;
        switch (currentTimeLimit) {
          case "5 minutes":
            currentEndingTime = currentLastModified + 300;
            break;
          case "15 minutes":
            currentEndingTime = currentLastModified + 900;
          break;
          case "30 minutes":
            currentEndingTime = currentLastModified + 1800;
            break;
          case "1 hour":
            currentEndingTime = currentLastModified + 3600;
            break;        
          case "3 hours":
            currentEndingTime = currentLastModified + 10800;
            break;
          case "12 hours":
            currentEndingTime = currentLastModified + 43200;
            break; 
          case "1 day":
            currentEndingTime = currentLastModified + 86400;
            break;  
          default:
            currentEndingTime = currentLastModified + 300;
        } 
        console.log("CurrentEndingTime",currentEndingTime)
        console.log("currentLastModified",currentLastModified)
        console.log("Result remainingTime",currentTimeStamp - currentEndingTime )
        let remainingTime = currentTimeStamp - currentEndingTime;

        // let hours = Math.floor(remainingTime / 60 / 60);
        // let minutes = Math.floor(remainingTime / 60) - (hours * 60);
        // let seconds = remainingTime % 60;
        let chours = Math.floor((currentEndingTime / 60) / 60);
        let cminutes = Math.floor(currentEndingTime / 60) - (hours * 60);
        let cseconds = currentEndingTime % 60;
        console.log('hours, minutes, seconds', chours, cminutes, cseconds);
        
        setHours(chours)
        setMinutes(cminutes)
        setSeconds(cseconds)
      })
    })
  }


  function setIsSubmittedFunc(vis, val) {
    setIsSubmitted(vis);
    setNumOfEntry(val);
  }

  useEffect(()=> {
    checkMaxEntries(user.email, props.match.params.id)
    checkTurns(user.email, props.match.params.id)
  }, [storyArr])

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
    if (likes.length > 0) {
    for (const item of likes) {
      if (item.entryId === entryId) {
        return item.likes;
      }
    } 
  } else return 0;
  }

  const updateLikeState = (entryId, operation) => {
    let newLikes = [...likes]
    if (likes.length > 0) {
        for (let i = 0; i < likes.length; i++) {
          if (likes[i].entryId === entryId) {
            if (operation == "inc") {
              newLikes[i].likes += 1;
            } else if (operation == "dec") {
              newLikes[i].likes -= 1;
            }
            setLikes(newLikes);
          }
        }
      } 
    }

  // READ FROM DB ///
  const fetchImageURL = async (id) => {
    const db = firebase.firestore();
    const data = await db.collection('StoryDatabase').where('id', '==', id).get();
    setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  };

  const addLike = async (entryId, storyId, user_email) => {

    await db.collection('users').where('email', '==', user_email).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!doc.data().likedEntries.includes(entryId)) {
          db.collection('users').doc(doc.id).update({ "likedEntries": firebase.firestore.FieldValue.arrayUnion(entryId)});
          db.collection('Entries').where("id", "==", entryId)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection("Entries").doc(doc.id).update({ "likes": firebase.firestore.FieldValue.increment(1) });
            });
            updateLikeState(entryId, "inc")
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
        else {
          db.collection('users').doc(doc.id).update({ "likedEntries": firebase.firestore.FieldValue.arrayRemove(entryId)});
          db.collection('Entries').where("id", "==", entryId)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection("Entries").doc(doc.id).update({ "likes": firebase.firestore.FieldValue.increment(-1) });
            });
            updateLikeState(entryId, "dec")
          })
        setLikes(likes - 1)

        db.collection('StoryDatabase').where("id", "==", storyId)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection("StoryDatabase").doc(doc.id).update({ "likes": firebase.firestore.FieldValue.increment(-1) });
            });
          })
        }
        
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
    setMaxNoOfUsersState(maxUsers);
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
    setMaxNoOfEntries(maxEntries)
    let currentEntries = data.docs[0].data().entries.length;  //fetch current user number of story from database
    setCurrentEntries(currentEntries);

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
      className="btn btn-danger btn-sm"
      onClick={handleDeleteStory}
      >X
      </button>
    )
  }

  const DisplayPlayerNumbers = () => {
    // prompt writer automatically joins the story so there will never be less than 1 user participating.
    let noOfUsersString;
    noOfUsersState > 1
      ? noOfUsersString = `${noOfUsersState} authors are`
      : noOfUsersString = `${noOfUsersState} author is`;
    
    let formatted = hours + ':' + minutes + ':' + seconds;
    const authorSpotsRemaining = maxNoOfUsersState - noOfUsersState;
    const entriesRemaining = maxNoOfEntries - currentEntries;

    if (entriesRemaining == 1 && isSubmitted == false) {
      return (
        <>
        <div className="ds-author2">
          This is the last entry, wrap up the story!
        </div>
        <p>{noOfUsersString} currently participating in this Story! | Time remaining: {formatted} <br />
        </p>
        
        </>
      )
    } else {  
      return (
        <p>{noOfUsersString} currently participating in this Story!<br />
        Spots remaining: {authorSpotsRemaining} | Entries remaining: {entriesRemaining} | Time remaining: {formatted}
        </p>
      )
    }

  }

  return (
    <div className="display-story-component container" key={uuidv4()}>
        <div className="prompt-details-grid-container">
          <div className="ds-title">
            <h1>{title}</h1>
          </div>
          <div className="ds-image">
          <img className="display-image" key={uuidv4()} alt="user-uploaded story artwork" src={imageURL} />
          </div>
          <div className="ds-options">
            <TwitterShareButton
              url={"https://www.storifyapp.com/displaystory/" + story_id}
              title={title}
              className="Demo__some-network__share-button">
              <TwitterIcon
                size={32}
                round />
            </TwitterShareButton>

            <FacebookShareButton
              url={"https://www.storifyapp.com/displaystory/" + story_id}
              title={title}
              className="Demo__some-network__share-button">
              <FacebookIcon
                size={32}
                round />
            </FacebookShareButton>

            <RedditShareButton
              url={"https://www.storifyapp.com/displaystory/" + story_id}
              title={title}
              className="Demo__some-network__share-button">
              <RedditIcon
                size={32}
                round />
            </RedditShareButton>
    
            <EmailShareButton
              subject={title}
              body={"Read this amazing story in Storify: https://www.storifyapp.com/displaystory/" + story_id}
              separator={" "}
              className="Demo__some-network__share-button">
              <EmailIcon
                size={32}
                round />
            </EmailShareButton>

            <LineShareButton
              url={"https://www.storifyapp.com/displaystory/" + story_id}
              title={title}
              className="Demo__some-network__share-button">
              <LineIcon
                size={32}
                round />
            </LineShareButton>

            {
              user.email === authorEmail || user.admin === true ?
                renderDeleteButton() : ""
            }
          </div>
        </div>

        {storyArr.map((item) => { 
          return (
            <div className="entry-grid-container" key={uuidv4()}>
              <div className="ds-text">
                {item.text.map(paragraph => {
                    return (
                      <p key={uuidv4()}>{paragraph}</p>
                    )
                  })}
              </div>
              
              <div className="ds-author">
                {item.author}
                <div className="ds-likes">
                <span id="likes" onClick={() => addLike(item.entry_id, item.story_id, item.user_email)}>
                      {getLikes(item.entry_id) + " "}
                  <svg className="bi bi-heart-fill" width="1em" height="0.9em" viewBox="0 0 16 16" fill="#C52A0D" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                  </svg> <br />
                </span>
              </div>
              </div>
            </div>
          )
        })}
        
        <div className="container-fluid g-0">
          <DisplayPlayerNumbers />
          {
            isContributor ?
              isMaxEntries ?
              <div className="ds-author2">
                <p key={uuidv4()}>This Story has completed</p>  
              </div>
              :
                isUserInTurn ?
                
                  <Grid item xs={12} lg={12}>
                    <p>This story has {numOfEntries - numOfEntry} entries left</p>
                      {console.log("isSubmitted", isSubmitted)}
                      {!isSubmitted ?
                      <AddEntry setIsSubmittedFunc={setIsSubmittedFunc} setStoryArr={setStoryArr} id={props.match.params.id}  />
                      :
                      <></>}
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
    </div>
  );
}

export default DisplayStory;
