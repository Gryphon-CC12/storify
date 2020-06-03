import React from 'react';
import { Link } from 'react-router-dom';
import './StoryPreview.styles.scss';
import DisplayStory from '../displaystory/DisplayStory';

function StoryPreview(props) {
  return (
    <div className="card">
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className="preview-body" >
        <h5 className="preview-title">Story Title</h5>
        <p className="preview-text"> {props.storyId} </p>
        <Link to={{pathname: `/displaystory/${props.storyId}`}}>
          <p>See full story</p>
        </Link>
        </div>
    </div>
  );
}

export default StoryPreview;

