import React from 'react';
import { Link } from 'react-router-dom';
import './StoryPreview.styles.scss';

function StoryPreview() {
  return (
    <div className="card">
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className = "preview-body" >
        <h5 className="preview-title">Story Title</h5>
        <p className = "preview-text" > Some quick example text to build on the card title and make up the bulk of the card 's content.</p>
        <Link to="/displaystory">
        <p>See full story</p>
        </Link>
        </div>
    </div>
  );
}

export default StoryPreview;

