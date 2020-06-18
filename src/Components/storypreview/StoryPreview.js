import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StoryPreview.styles.scss";
import firebase from "../../firebaseConfig";
const db = firebase.firestore();

function StoryPreview(props) {
  // console.log('props:', props)

  const [storyText, setStoryText] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [likes, setLikes] = useState(0);
  const [promptAuthor, setPromptAuthor] = useState("");
  const [maxCollab, setMaxCollab] = useState(0);
  const [currentCollab, setCurrentCollab] = useState(0);

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
            ids_array.push(doc.data().entries);
            setCurrentCollab(ids_array.length);
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
      console.error(error);
    }
  }

  useEffect(() => {
    fetchFirstEntryForStory(props.storyProp);
    fetchImageURL(props.storyProp);
  }, [props.storyProp]);

  // READ FROM DB
  const fetchImageURL = async (id) => {
    const db = firebase.firestore();
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
    <div className="story-preview-component col-12">
      <Link
        className="read-more"
        to={{ pathname: `/displaystory/${props.storyProp}` }}
      >
        <div className="grid-container">
          <div className="image">
            <img
              className="story-image"
              alt="user-uploaded story artwork"
              src={imageURL}
            />
          </div>
          <div className="title">{title}</div>
          <div className="preview-text">{storyText}</div>
          <div className="likes">{likes} ♥️</div>
          <div className="author">
            <span className="prompt-text">Prompt by: </span>
            <br />
            <span className="author-name">{promptAuthor}</span>
          </div>
          <div className="collab">
            {currentCollab} / {maxCollab} authors
          </div>
          <div className="genre">{genre}</div>
        </div>
      </Link>
    </div>
  );
}

export default StoryPreview;
