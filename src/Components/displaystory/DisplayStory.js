/* eslint-disable eqeqeq */
import React, { useState, useEffect, useContext } from "react";
import "./DisplayStory.styles.scss";
import firebase from "../../firebaseConfig";
import AddEntry from "../addentry/AddEntry";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../../providers/UserProvider";
import "./DisplayStory.styles.scss";
import heartIcon from "../../assets/heart.svg";
import threeDotsVertical from "../../assets/dots-vertical.svg";
import deleteOneStory from "../../utils/deleteOneStory";
import moment from "moment";
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
  const [imageURL, setImageURL] = useState(
    "https://firebasestorage.googleapis.com/v0/b/seniorgryphon-df706.appspot.com/o/images%2Fdefault.jpg?alt=media&token=234b347d-e761-465d-8004-e914ef8d0360"
  );
  const [title, setTitle] = useState("");
  const [isContributor, setIsContributor] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); //makes textarea disappear after clicking submit entry in addEntry
  const [numOfEntry, setNumOfEntry] = useState(0); //changes num of left entries after clicking submit entry in addEntry
  const [noOfUsersState, setNoOfUsersState] = useState(0);
  const [maxNoOfUsersState, setMaxNoOfUsersState] = useState(0);
  const [isMaxContributors, setIsMaxContributors] = useState(true);
  const [isMaxEntries, setIsMaxEntries] = useState(true);
  const [maxNoOfEntries, setMaxNoOfEntries] = useState(true);
  const [currentEntries, setCurrentEntries] = useState(0);
  const [numOfEntries, setNumOfEntries] = useState(0);
  const [userInTurn, setUserInTurn] = useState("");
  const [userInTurnName, setUserInTurnName] = useState("");
  const [isUserInTurn, setIsUserInTurn] = useState(false);
  const [likes, setLikes] = useState([]);
  const [deadlineSec, setDeadlineSec] = useState(0);
  const [storyCreatedDate, setStoryCreatedDate] = useState(0);


  useEffect(() => {
    fetchEntriesForStory(props.match.params.id, user.email);
    fetchImageURL(props.match.params.id);
    checkMaxContributors(user.email, props.match.params.id);
    checkMaxEntries(user.email, props.match.params.id);
    checkTurns(user.email, props.match.params.id);
    // checkAuthor(user.email, props.match.params.id)
  }, [user.email, props.match.params.id]);

  function setIsSubmittedFunc(vis, val) {
    setIsSubmitted(vis);
    setNumOfEntry(val);
  }

  useEffect(() => {
    checkMaxEntries(user.email, props.match.params.id);
    checkTurns(user.email, props.match.params.id);
  }, [storyArr]);

  function setIsSubmittedFunc(vis, val) {
    setIsSubmitted(vis);
    setNumOfEntry(val);
  }

  let authorEmail; // TODO somehow couldn't use useState to update this; needs to be fixed later
  function fetchEntriesForStory(storyId, userEmail) {
    db.collection("StoryDatabase")
      .where("id", "==", storyId)
      .get()
      .then(function (querySnapshot) {
        let idsArray = [];
        querySnapshot.forEach(function (doc) {
          idsArray.push(doc.data().entries);
          setIsContributor(doc.data().emails.includes(userEmail));
          setTitle(doc.data().title);
          let emails = doc.data().emails;
          authorEmail = emails[0];
          let dateCreated = doc.data().dateCreated;
          setStoryCreatedDate(dateCreated.seconds)
          // moment.unix(1454521239279/1000).format("DD MMM YYYY hh:mm a")
          let currentTimeLimit = doc.data().timeLimit;
          let currentLastModified = doc.data().lastModified.seconds;
          let currentEndingTime = 0;
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

          //setUnixDate(unixDate => unixDate.concat(moment.unix(currentEndingTime)._d));
          setDeadlineSec(currentEndingTime);
        });
        return idsArray[0];
      })
      .then((idsArray) => {
        idsArray.forEach((id) => {
          db.collection("Entries")
            .where("id", "==", id)
            .get()
            .then(function (querySnapshot2) {
              querySnapshot2.forEach(function (doc) {
                let thisAuthor = doc.data().author;
                let thisText = doc.data().text;
                thisText = thisText.split(/\n/g);
                let thisLikes = doc.data().likes;
                let entryId = doc.data().id;
                let userEmail = doc.data().email;
                let createdDate = doc.data().date;
                setStoryArr((storyArr) =>
                  storyArr.concat([
                    {
                      author: thisAuthor,
                      text: thisText,
                      likes: thisLikes,
                      entry_id: entryId,
                      story_id: storyId,
                      user_email: userEmail,
                      entry_date: moment.unix(createdDate.seconds).fromNow()
                    },
                  ])
                );
                setLikes((likes) =>
                  likes.concat([
                    {
                      entryId: entryId,
                      likes: thisLikes,
                    },
                  ])
                );
              });
            });
        });
      });
  }

  const getLikes = (entryId) => {
    if (likes.length > 0) {
      for (const item of likes) {
        if (item.entryId === entryId) {
          return item.likes;
        }
      }
    } else return 0;
  };

  const updateLikeState = (entryId, operation) => {
    let newLikes = [...likes];
    if (newLikes.length > 0) {
      for (let i = 0; i < newLikes.length; i++) {
        if (newLikes[i].entryId === entryId) {
          if (operation == "inc") {
            newLikes[i].likes += 1;
          } else if (operation == "dec") {
            newLikes[i].likes -= 1;
          }
          setLikes(newLikes);
        }
      }
    }
  };

  // READ FROM DB ///
  const fetchImageURL = async (id) => {
    const db = firebase.firestore();
    const data = await db
      .collection("StoryDatabase")
      .where("id", "==", id)
      .get();
    setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  };

  const addLike = async (entryId, storyId, user_email) => {
    await db
      .collection("users")
      .where("email", "==", user_email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          if (!doc.data().likedEntries.includes(entryId)) {
            await db
              .collection("users")
              .doc(doc.id)
              .update({
                likedEntries: firebase.firestore.FieldValue.arrayUnion(entryId),
              });
            await db
              .collection("Entries")
              .where("id", "==", entryId)
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(async function (doc) {
                  await db
                    .collection("Entries")
                    .doc(doc.id)
                    .update({
                      likes: firebase.firestore.FieldValue.increment(1),
                    });
                  updateLikeState(entryId, "inc");
                });
              });

            await db
              .collection("StoryDatabase")
              .where("id", "==", storyId)
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  db.collection("StoryDatabase")
                    .doc(doc.id)
                    .update({
                      likes: firebase.firestore.FieldValue.increment(1),
                    });
                });
              });
          } else {
            await db
              .collection("users")
              .doc(doc.id)
              .update({
                likedEntries: firebase.firestore.FieldValue.arrayRemove(
                  entryId
                ),
              });
            await db
              .collection("Entries")
              .where("id", "==", entryId)
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  db.collection("Entries")
                    .doc(doc.id)
                    .update({
                      likes: firebase.firestore.FieldValue.increment(-1),
                    });
                  updateLikeState(entryId, "dec");
                });
              });

            await db
              .collection("StoryDatabase")
              .where("id", "==", storyId)
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  db.collection("StoryDatabase")
                    .doc(doc.id)
                    .update({
                      likes: firebase.firestore.FieldValue.increment(-1),
                    });
                });
              });
          }
        });
      });
  };

  async function checkTurns(email, storyId) {
    db.collection("StoryDatabase")
      .where("id", "==", storyId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
          let currentInTurn = await doc.data().inTurn;

          if (currentInTurn == email) {
            setIsUserInTurn(true);
          } else {
            setIsUserInTurn(false);
          }
          setUserInTurn(currentInTurn);
          const userData = await db
            .collection("users")
            .where("email", "==", currentInTurn)
            .get();
          setUserInTurnName(userData.docs[0].data().displayName);
        });
      });
  }

  async function checkMaxContributors(email, story_id) {
    const data = await db
      .collection("StoryDatabase")
      .where("id", "==", story_id)
      .get();
    let maxUsers = data.docs[0].data().maxUsers; //fetch max Users limit from database
    setMaxNoOfUsersState(maxUsers);
    let currentUsers = data.docs[0].data().emails.length; //fetch current user number of story from database
    setNoOfUsersState(currentUsers);

    if (currentUsers < maxUsers) {
      //if current users is not maxed set the state accordingly
      setIsMaxContributors(false);
    } else {
      setIsMaxContributors(true);
    }
  }

  ///// check max number of entries
  async function checkMaxEntries(email, story_id) {
    const data = await db
      .collection("StoryDatabase")
      .where("id", "==", story_id)
      .get();
    let maxEntries = data.docs[0].data().maxEntries; //fetch max Users limit from database
    setMaxNoOfEntries(maxEntries);
    let currentEntries = data.docs[0].data().entries.length; //fetch current user number of story from database
    setCurrentEntries(currentEntries);

    setNumOfEntries(maxEntries - currentEntries);
    if (currentEntries < maxEntries) {
      //if current users is not maxed set the state accordingly
      setIsMaxEntries(false);
    } else {
      setIsMaxEntries(true);
    }
  }

  //// THIS FUNCTION ADDS A NEW CONTRIBUTOR TO THE STORY /////
  async function addToContributors(email, storyId) {
    const data = await db
      .collection("StoryDatabase")
      .where("id", "==", storyId)
      .get();
    let maxUsers = data.docs[0].data().maxUsers; //fetch max Users limit from database
    let currentUsers = data.docs[0].data().emails.length;
    if (currentUsers < maxUsers) {
      //if current users is not maxed out add a new contributor
      db.collection("StoryDatabase")
        .where("id", "==", storyId)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            //let maxUsers = db.collection("StoryDatabase").doc(doc.maxUsers);
            db.collection("StoryDatabase")
              .doc(doc.id)
              .update({
                emails: firebase.firestore.FieldValue.arrayUnion(email),
              });
          });
        });
    }

    checkTurns(email, storyId);

    setTimeout(() => {
      window.location.reload(false);
    }, 1000);
  }

  async function handleDeleteStory(e) {
    e.preventDefault();
    await deleteOneStory(props.match.params.id, user.email);
    props.history.push("/");
  }

  async function getCurrentNumberOfParticipants(storyId) {
    const data = await db
      .collection("StoryDatabase")
      .where("id", "==", storyId)
      .get();
    let currentUsers = data.docs[0].data().emails.length;
    setNoOfUsersState(currentUsers);
  }

  async function featureOneStory(storyIdToDelete, userEmail) {

    await db
      .collection("StoryDatabase")
      .where("id", "==", storyIdToDelete)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          //let maxUsers = db.collection("StoryDatabase").doc(doc.maxUsers);
          db.collection("StoryDatabase").doc(doc.id).update({
            featuredStory: true,
          });
        });
      });

    setTimeout(() => {
      window.location.reload(false);
    }, 1000);
  }

  async function unfeatureOneStory(storyIdToDelete, userEmail) {

    await db
      .collection("StoryDatabase")
      .where("id", "==", storyIdToDelete)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          //let maxUsers = db.collection("StoryDatabase").doc(doc.maxUsers);
          db.collection("StoryDatabase").doc(doc.id).update({
            featuredStory: false,
          });
        });
      });

    setTimeout(() => {
      window.location.reload(false);
    }, 1000);
  }

  async function handleFeatureStory(e) {
    e.preventDefault();
    await featureOneStory(props.match.params.id, user.email);

    props.history.push("/");
  }

  async function handleUnfeatureStory(e) {
    e.preventDefault();
    await unfeatureOneStory(props.match.params.id, user.email);

    props.history.push("/");
  }

  const renderOptionsDropDown = () => {
    return (
      <div className="dropleft">
        <button
          className="dropdown-btn"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          <img src={threeDotsVertical} alt="menu button"></img>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li className="dropdown-item danger" onClick={handleDeleteStory}>
            Delete Story
          </li>
          <li className="dropdown-item danger" onClick={handleFeatureStory}>
            Feature Story
          </li>
          <li className="dropdown-item danger" onClick={handleUnfeatureStory}>
            Unfeature Story
          </li>
        </ul>
      </div>
    );
  };

  const displayPlayerNumbers = () => {
    // prompt writer automatically joins the story so there will never be less than 1 user participating.

    const authorSpotsRemaining = Math.max(
      0,
      maxNoOfUsersState - noOfUsersState
    );
    const entriesRemaining = Math.max(0, maxNoOfEntries - currentEntries);

    let unixDate = moment.unix(deadlineSec)._d.toString()

    if (entriesRemaining == 1 && isSubmitted == false) {
      return (
        <div className="ds-story-stats">
          <p className="ds-last-author-warning">
            This is the last entry, wrap up the story!
          </p>
          <p className="ds-currently-participating">
            Authors participating: {noOfUsersState}
          </p>
          <p className="ds-next-entry-deadline">
            Next entry deadline: {unixDate}
          </p>
        </div>
      );
    } else {
      return (
        <div className="ds-story-stats">
          <p className="ds-currently-participating">
            Authors participating: {noOfUsersState}
          </p>
          <p className="ds-spots-remaining">
            Spots remaining: {authorSpotsRemaining}
          </p>
          <p className="ds-entries-remaining">
            Entries remaining: {entriesRemaining}
          </p>
          <p className="ds-next-entry-deadline">
            Next entry deadline: {unixDate}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="display-story-component container" key={uuidv4()}>
      <div className="prompt-details-grid-container">
        <div className="ds-social-media">
          <TwitterShareButton
            url={"https://www.storifyapp.com/displaystory/" + story_id}
            title={title}
            className="Demo__some-network__share-button"
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <FacebookShareButton
            url={"https://www.storifyapp.com/displaystory/" + story_id}
            title={title}
            className="Demo__some-network__share-button"
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <RedditShareButton
            url={"https://www.storifyapp.com/displaystory/" + story_id}
            title={title}
            className="Demo__some-network__share-button"
          >
            <RedditIcon size={32} round />
          </RedditShareButton>

          <EmailShareButton
            subject={title}
            body={
              "Read this amazing story in Storify: https://www.storifyapp.com/displaystory/" +
              story_id
            }
            separator={" "}
            className="Demo__some-network__share-button"
          >
            <EmailIcon size={32} round />
          </EmailShareButton>

          <LineShareButton
            url={"https://www.storifyapp.com/displaystory/" + story_id}
            title={title}
            className="Demo__some-network__share-button"
          >
            <LineIcon size={32} round />
          </LineShareButton>
        </div>
        <div className="ds-title">
          <h1>{title}</h1>
        </div>
        <div className="ds-image">
          <img
            className="display-image"
            key={uuidv4()}
            alt="user-uploaded story artwork"
            src={imageURL}
          />
        </div>
        <div className="ds-date-created">
            <p>{moment.unix(storyCreatedDate).fromNow()}</p>
        </div>
        <div className="ds-options">
          {user.email === authorEmail || user.admin === true
            ? renderOptionsDropDown()
            : ""}
        </div>
      </div>

      {storyArr.map((item) => {
        return (
          <div className="entry-grid-container" key={uuidv4()}>
            <div className="ds-text">
              {item.text.map((paragraph) => {
                return <p key={uuidv4()}>{paragraph}</p>;
              })}
            </div>

            <div className="ds-author">
              {item.author}
              <div className="ds-likes">
                <span
                  id="likes"
                  onClick={() =>
                    addLike(item.entry_id, item.story_id, user.email)
                  }
                >
                  {getLikes(item.entry_id) + " "}
                  <img
                    src={heartIcon}
                    alt="heart icon"
                    className="heart icon"
                  />{" "}
                  <br />
                </span>
              </div>
              <div className="ds-entry-created">
                  {item.entry_date}
              </div>
            </div>
          </div>
        );
      })}

      <div className="container-fluid g-0 stats-container">
        {displayPlayerNumbers()}

        {isContributor ? (
          isMaxEntries ? (
            <div className="ds-story-stats">
              <p key={uuidv4()} className="ds-story-complete">
                Story Complete!
              </p>
            </div>
          ) : isUserInTurn ? (
            <div className="ds-story-stats">
              <p>This story has {numOfEntries - numOfEntry} entries left</p>
              {!isSubmitted ? (
                <AddEntry
                  setIsSubmittedFunc={setIsSubmittedFunc}
                  setStoryArr={setStoryArr}
                  id={props.match.params.id}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            <>
              {userInTurn ? (
                <div className="ds-story-stats">
                  <p key={uuidv4()} className="ds-current-turn">
                    Currently {userInTurnName}'s turn!
                  </p>
                </div>
              ) : (
                <div className="ds-story-stats">"Waiting for players!"</div>
              )}
            </>
          )
        ) : isMaxContributors ? (
          <p key={uuidv4()} className="ds-story-full ds-story-stats">
            This Story is full.
          </p>
        ) : (
          <div className="btn-wrapper">
            <button
              className="join-story-btn btn-sm"
              key={uuidv4()}
              onClick={() =>
                addToContributors(user.email, storyArr[0].story_id)
              }
            >
              Join the Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DisplayStory;
