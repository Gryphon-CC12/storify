import React, { useState, useEffect, useContext } from "react";
import "./FeaturedStory.styles.scss";
import StoryPreview from "../storypreview/StoryPreview";
import firebase from "../../firebaseConfig";

const db = firebase.firestore();


// let authorEmail;

function FeaturedStory() {
  const [stories, setStories] = useState([]);
  const [genre, setGenre] = useState("All");

  useEffect(() => {
    retrieveAllStories(genre);
  }, [genre]);

  // useEffect(() => {
  //   retrieveAllStoriesByLikes(like);
  // }, [like]);

  // const selectGenre = (event) => {
  //   setGenre(event.target.value);
  // };

  // const selectLike = (event) => {
  //   setLike(event.target.value);
  // };

  const retrieveAllStories = async (genre) => {
    if (genre === "All" || genre === undefined) {
      const data = await db
        .collection("StoryDatabase")
        // .orderBy("dateCreated")
        .where("featuredStory", "==", true)
        .get();
      setStories([]);
      setStories((stories) =>
        stories.concat(data.docs.map((doc) => doc.data()))
      );
    } else {
      const data = await db
        .collection("StoryDatabase")
        .where("genre", "==", genre)
        .get();
      setStories([]);
      setStories((stories) =>
        stories.concat(data.docs.map((doc) => doc.data()))
      );
    }
  };

  return (
    <div className="display-story">
      <div className="container">
        <div className="row">
          <div className="greeting">Featured Story</div>

          <div>
            {stories.map((story) => {
              return <StoryPreview storyProp={story.id} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedStory;
