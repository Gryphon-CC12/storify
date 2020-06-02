import React from 'react';
import './StoryList.styles.scss';
import StoryPreview from '../storypreview/StoryPreview'

function StoryList() {

  return (
    <div className="StoryList">
      <div className="row">
          <div className="col-4">
            <StoryPreview />
          </div>
          <div className="col-4">
            <StoryPreview />
          </div>
          <div className="col-4">
            <StoryPreview />
          </div>
        </div>
    </div>
  );
}

export default StoryList;