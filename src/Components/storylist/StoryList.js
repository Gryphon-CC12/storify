import React, {useState, useEffect, useRef} from 'react';
import './StoryList.styles.scss';
import StoryPreview from '../storypreview/StoryPreview'
import firebase from '../../firebaseConfig';
import {v4 as uuidv4} from "uuid";
const db = firebase.firestore();

function StoryList() {
  const [stories, setStories] = useState([]);
  const [genre, setGenre] = useState("");
  const storyGenre = useRef("");

  useEffect(() => {
    console.log('storyGenre in USE EFFECT', storyGenre.current.value);
    
    retrieveAllStories(storyGenre.current.value);
  }, [genre])

  const selectGenre = () => {
    setGenre(storyGenre.current.value)
  }

  const retrieveAllStories = async (genre) => {
    // console.log('genre FOR STORY LIST', genre);

    if (genre === "All") {
      const data = await db.collection('StoryDatabase').orderBy('dateCreated').get();
      setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
    } else {
      const data = await db.collection('StoryDatabase').where('genre', "==", genre).get();
      setStories([]);
      setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
      console.log('data genre FOR STORY LIST ', data);
    }

  };
  return (
    <div className="DisplayStory">
      <div className="form-group">
        <label htmlFor="select-deadline">Filter Story Genre</label>
        <select select="true" className = "form-control" id = "exampleFormControlSelect1" onChange={selectGenre} ref={storyGenre}>
        <option>All</option>  
        <option>Crime</option>
        <option>Fan fiction</option>
        <option>Fantasy</option>
        <option>Historical</option>
        <option>Horror</option>
        <option>Humor</option>
        <option>Romance</option>
        <option>Sci-fi</option>
        <option>Thriller</option>
        <option>Other</option>
        </select>
      </div>
      <div className="row">
      {stories.map((story) => {         
        return (
          <div className="col col-sm-12 col-md-4 col-lg-3 col-xl-3" key={uuidv4()}>
            <StoryPreview storyProp={story}/>
          </div>
        )
      })}
        </div>
		</div>
  );
}

export default StoryList;