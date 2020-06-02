import React from 'react';
import { Link } from 'react-router-dom';
import './StoryPreview.styles.scss';
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import DisplayStory from '../displaystory/DisplayStory';

function StoryPreview() {
  return (
    <div className="card">

      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className = "preview-body" >
        <h5 className="preview-title">Story Title</h5>
        <p className = "preview-text" > Some quick example text to build on the card title and make up the bulk of the card 's content.</p>
        <Link to="/displaystory">
        <a href="#">See full story</a>
        </Link>
        </div>


    </div>
  );
}

export default StoryPreview;

