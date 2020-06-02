import React from 'react';
import { Link } from 'react-router-dom';
import './StoryPreview.styles.scss';
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import DisplayStory from '../displaystory/DisplayStory';

const db = firebase.firestore();

// READ FROM DB
const fetchData = async () => {
    const data = await db.collection('Entries').orderBy('date').get();
    //setGames(data.docs.map((doc) => doc.data()));
  };

function StoryPreview() {
  return (
    <div className="card">
    <Link to={DisplayStory}>
      <img src="..." className="card-img-top" alt="..." />
      <div className = "card-body" >
        <h5 className="card-title">Story Title</h5>
        <p className = "card-text" > Some quick example text to build on the card title and make up the bulk of the card 's content.</p>
        <a href="https://example.com" className="btn btn-primary">Go somewhere</a>
        </div>
      </Link>
    </div>
  );
}

export default StoryPreview;