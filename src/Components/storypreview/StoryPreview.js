import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StoryPreview.styles.scss";
import firebase from "../../firebaseConfig";
import heartIcon from '../../assets/heart.svg'
import moment from 'moment';

const db = firebase.firestore();

function StoryPreview(props) {
  const [storyText, setStoryText] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [likes, setLikes] = useState(0);
  const [promptAuthor, setPromptAuthor] = useState("");
  const [maxCollab, setMaxCollab] = useState(0);
  const [currentCollab, setCurrentCollab] = useState(0);
  const [maxEntries, setMaxEntries] = useState(0);
  const [currentEntries, setCurrentEntries] = useState(0);
  const [storyCreatedDate, setStoryCreatedDate] = useState(0);


  async function fetchFirstEntryForStory(id) {
    try {
      db.collection("StoryDatabase")
        .where("id", "==", id)
        .get()
        .then(function (querySnapshot) {
          let ids_array = [];
          querySnapshot.forEach(function (doc) {
            setGenre(doc.data().genre);
            setLikes(doc.data().likes);
            setTitle(doc.data().title);
            setPromptAuthor(doc.data().author);
            setMaxCollab(doc.data().maxUsers);
            setCurrentCollab(doc.data().emails.length);
            setMaxEntries(doc.data().maxEntries);
            setCurrentEntries(doc.data().entries.length);
            ids_array.push(doc.data().entries);
            setStoryCreatedDate(doc.data().dateCreated.seconds)
          });
          return ids_array[0][0];
        })
        .then(async (id) => {
          const data = await db
            .collection("Entries")
            .where("id", "==", id)
            .get();
          setStoryText(
            data.docs.map((doc) => {
              return doc.data().text.substring(0, 280) + "..."; // Returns previous only till the first.
            })
          );
        });
    } catch (error) {
      //console.error(error)
    }
  }

  useEffect(() => {
    fetchFirstEntryForStory(props.storyProp);
    fetchImageURL(props.storyProp);
  }, [props.storyProp])

  // READ FROM DB
  const fetchImageURL = async (id) => {
    const data = await db
      .collection("StoryDatabase")
      .where("id", "==", id)
      .get();
    setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  };

  if (!props) {
    return <div></div>;
  }

  return (
    <div className="story-preview-component">
      <Link
        className="read-more"
        to={{ pathname: `/displaystory/${props.storyProp}` }}
      >
        <div className="sp-grid-container">
          <div className="sp-image">
            <img
              className="sp-story-image"
              alt="user-uploaded story artwork"
              src={imageURL}
            />
          </div>
          <div className="sp-title text-truncate">{title}</div>
          <div className="sp-preview-text">{storyText}</div>
          <div className="sp-likes">
            {likes + " "}
            <img src={heartIcon} className="sp-heart-icon" alt="heart icon"></img>
          </div>
          <div className="sp-author">
            <span className="sp-prompt-text">Prompt by:</span>
            <br />
            <span className="sp-author-name text-truncate">{promptAuthor}</span>
          </div>
          <div className="sp-collab">
            {currentCollab} / {maxCollab} authors
          </div>
          <div className="sp-entries">
            {currentEntries} / {maxEntries} entries
          </div>
          <div className="sp-genre">{genre}</div>
          <div className="sp-date-created">{moment.unix(storyCreatedDate).fromNow()}</div>
        </div>
      </Link>
    </div>
  );
}

export default StoryPreview;
