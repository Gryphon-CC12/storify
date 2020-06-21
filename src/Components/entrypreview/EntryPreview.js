import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EntryPreview.styles.scss";
import firebase from "../../firebaseConfig";
import heartIcon from '../../assets/heart.svg'

const db = firebase.firestore();

function EntryPreview(props) {
  const [storyTitle, setStoryTitle] = useState([]);
  const [entryText, setEntryText] = useState("");
  const [entryLikes, setEntryLikes] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [promptAuthor, setPromptAuthor] = useState("");

  function fetchStoryTitle(storyId) {
    db.collection("StoryDatabase")
      .where("id", "==", storyId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          setStoryTitle(doc.data().title);
          setImageURL(doc.data().imageUrl);
          setPromptAuthor(doc.data().author);
        });
      });
  }

  const fetchEntryDetails = (entryId) => {
    db.collection("Entries")
      .where("id", "==", entryId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setEntryText(doc.data().text);
          setEntryLikes(doc.data().likes);
        });
      });
  };

  useEffect(() => {
    fetchStoryTitle(props.storyId);
    fetchEntryDetails(props.entryId);
  }, [props.storyId, props.entryId]);

  return (
    <div className="story-preview-component col-12">
      <Link
        className="read-more"
        to={{ pathname: `/displaystory/${props.storyId}` }}
      >
        <div className="grid-container">
          <div className="image">
            <img
              className="story-image"
              alt="user-uploaded story artwork"
              src={imageURL}
            />
          </div>
          <div className="title">{storyTitle}</div>
          <div className="preview-text">{entryText}</div>
          <div className="likes">{entryLikes} <img src={heartIcon} alt="heart icon"/></div>
          <div className="author">
            <span className="prompt-text">Prompt by: </span>
            <br />
            <span className="author-name">{promptAuthor}</span>
          </div>
          <div className="collab">
          </div>
        </div>
      </Link>
    </div>
  );
}

export default EntryPreview;
