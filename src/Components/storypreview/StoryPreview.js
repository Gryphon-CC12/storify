import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StoryPreview.styles.scss';
import firebase from "../../firebaseConfig";
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

  async function fetchFirstEntryForStory(id) {
    try {          
      db.collection('StoryDatabase').where('id', '==', id).get()
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
        })
        return ids_array[0][0];
      })
      .then(async id => {
        const data = await db.collection('Entries').where('id', '==', id).get();
        setStoryText(data.docs.map((doc) => {
          return (doc.data().text.substring(0, 280) + "...");   // Returns previous only till the first.
        }));
      })
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    fetchFirstEntryForStory(props.storyProp);
    fetchImageURL(props.storyProp);
  }, [])

  // READ FROM DB
  const fetchImageURL = async (id) => {
    const data = await db.collection('StoryDatabase').where('id', '==', id).get();
    setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  };

  

  if (!props) {
    return <div></div>
  }

  return (
    <div className="story-preview-component">
      <Link className="read-more" to={{ pathname: `/displaystory/${props.storyProp}` }}>
        <div className="grid-container">
          <div className="image">
            <img className="story-image" alt="user-uploaded story artwork" src={imageURL}/>
          </div>
          <div className="title text-truncate">
            {title}
          </div>
          <div className="preview-text text-truncate">
            {storyText}
          </div>
          <div className="likes">
            {likes + " "}
            <svg className="bi bi-heart-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="#C52A0D" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>
          </div>
          <div className="author">
            <span className="prompt-text">Prompt by:</span><br />
            <span className="author-name text-truncate">{promptAuthor}</span>
          </div>
          <div className="collab">
            {currentCollab} / {maxCollab} authors
          </div>
          <div className="sp-entries">
            {currentEntries} / {maxEntries} entries
          </div>
          <div className="genre">
            {genre}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default StoryPreview;

