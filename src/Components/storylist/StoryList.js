import React, { useState, useEffect } from "react";
import "./StoryList.styles.scss";
import StoryPreview from "../storypreview/StoryPreview";
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
const db = firebase.firestore();

function StoryList() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    retrieveAllStories();
  }, []);

  const retrieveAllStories = async () => {
    const data = await db
      .collection("StoryDatabase")
      .orderBy("dateCreated")
      .get();
    setStories((stories) => stories.concat(data.docs.map((doc) => doc.data())));
  };

  return (
    <div className="DisplayStory" style={{ paddingTop: "60px" }}>
      <div className="row">
        {stories.map((story) => {
          return (
            <div
              className="col col-sm-12 col-md-4 col-lg-3 col-xl-3"
              key={uuidv4()}
            >
              <StoryPreview storyProp={story} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StoryList;
