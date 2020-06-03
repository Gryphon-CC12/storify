import React, {useState, useEffect} from 'react';
import './StoryList.styles.scss';
import StoryPreview from '../storypreview/StoryPreview'
import firebase from '../../firebaseConfig';
import {v4 as uuidv4} from "uuid";
const db = firebase.firestore();


function StoryList() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    retreiveAllStories();
  }, [])

  const retreiveAllStories = async () => {
    const data = await db.collection('StoryDatabase').orderBy('dateCreated').get();
    setStories(stories => stories.concat(data.docs.map((doc) => doc.data().id)));
  };
  
  console.log("STORIEEEES", stories)

  return (
		<div className="DisplayStory">
      Here is a story from Display Story:
      {stories.map((storyId) => { 
        return (
          <div className="col-4" key={uuidv4()}>
            <StoryPreview storyId={storyId}/>
          </div>
        )
      })}
		</div>
  );
}

export default StoryList;