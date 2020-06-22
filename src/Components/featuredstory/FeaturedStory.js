import React, { useState, useEffect, useContext } from "react";
import "./FeaturedStory.styles.scss";
import StoryPreview from "../storypreview/StoryPreview";
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import threeDotsVertical from "../../assets/dots-vertical.svg";
import deleteOneStory from "../../utils/deleteOneStory";
import { UserContext } from "../../providers/UserProvider";

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

let authorEmail;

function FeaturedStory(props) {
  const user = useContext(UserContext);
  const [stories, setStories] = useState([]);
  const classes = useStyles();
  const [genre, setGenre] = useState("All");
  // const storyGenre = useRef("");
  // const [like, setLike] = useState("By Newest");
  // const storyLike = useRef("");
  // console.log("PROP, ", props);
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
