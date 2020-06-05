import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StoryPreview.styles.scss";
import firebase from "../../firebaseConfig";

const db = firebase.firestore();

function StoryPreview(props) {
  const [storyText, setStoryText] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [genre, setGenre] = useState("");

  function fetchFirstEntryForStory(id) {
    db.collection("StoryDatabase")
      .where("id", "==", id)
      .get()
      .then(function (querySnapshot) {
        let ids_array = [];
        querySnapshot.forEach(function (doc) {
          setGenre(doc.data().genre);
          ids_array.push(doc.data().entries);
        });
        return ids_array[0][0];
      })
      .then(async (id) => {
        const data = await db.collection("Entries").where("id", "==", id).get();
        setStoryText(
          data.docs.map((doc) => {
            return doc.data().text.split(".")[0] + "."; // Returns previous only till the first .
          })
        );
      });
  }

  useEffect(() => {
    fetchFirstEntryForStory(props.storyProp.id);
    fetchImageURL(props.storyProp.id);
  }, [props.storyProp.id]);

  // READ FROM DB
  const fetchImageURL = async (id) => {
    const db = firebase.firestore();
    const data = await db
      .collection("StoryDatabase")
      .where("id", "==", id)
      .get();
    setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  };

  return (
    <div className="card" style={{ paddingTop: "60px" }}>
      <div className="preview-body">
        <img
          alt="user-uploaded story artwork"
          src={imageURL}
          width="200"
          height="150"
        />
        <h5 className="preview-title">{props.storyProp.title}</h5>
        <p className="preview-text"> {storyText} </p>
        <p className="preview-genre"> {genre} </p>
        <Link to={{ pathname: `/displaystory/${props.storyProp.id}` }}>
          Read more
        </Link>
      </div>
    </div>
  );
}

export default StoryPreview;
