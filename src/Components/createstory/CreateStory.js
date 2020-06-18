/* eslint-disable eqeqeq */
import React, { useRef, useContext } from "react";
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import saveToEntries from "../../utils/saveToEntries";
import { storage } from "../../firebaseConfig";
import { UserContext } from "../../providers/UserProvider";
import "firebase/storage";
import saveToUserStories from '../../utils/saveToUserStories';

//import emailjs from 'emailjs-com';
//require('dotenv').config()
//const {SERVICE_ID,TEMPLATE_ID,USER_ID} = process.env;

const db = firebase.firestore();

function CreateStory(props) {

  ////For google image upload
  // const allInputs = {imgUrl: ''}
  // const [imageAsFile, setImageAsFile] = useState('')
  const user = useContext(UserContext);
  let imageAsUrl = "";
  /////

  /////FOR IMAGE UPLOAD TO GOOGLE BUCKET
  // const handleImageAsFile = (e) => {
  //     // e.preventDefault();
  //     const image = e.target.files[0]
  //     setImageAsFile(imageFile => (image));
  //     // await handleFireBaseUpload(e);
  // }
  //////////////

  function saveToStories(
    // event,
    storyId,
    promptId,
    user,
    title,
    imageAsUrl
  ) {
    if (imageAsUrl === "") {
      imageAsUrl = "https://bit.ly/2MEQ1yJ";
    }

    if (useRobot.current.checked){
      db.collection("StoryDatabase")
      .add({
        id: storyId,
        dateCreated: new Date(),
        lastModified: new Date(),
        inTurn: "storify.io@gmail.com",
        title: title,
        likes: 0,
        author: user.displayName,
        authorUserId: user.id,
        emails: [user.email, "storify.io@gmail.com"],
        isPrompt: true,
        featuredStory: false,
        maxEntries: maxEntries.current.value,
        maxUsers: Number(maxCollaborators.current.value) + 1,
        entries: [promptId],
        useRobotAsPlayer: useRobot.current.checked,
        imageUrl: imageAsUrl,
        genre: storyGenre.current.value,
        timeLimit: deadline.current.value,
        isCompleted: Number(maxEntries.current.value) - 1 == 0
      })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    } else {
      db.collection("StoryDatabase")
      .add({
        id: storyId,
        dateCreated: new Date(),
        lastModified: new Date(),
        inTurn: user.email,
        title: title,
        likes: 0,
        author: user.displayName,
        authorUserId: user.id,
        emails: [user.email],
        isPrompt: true,
        featuredStory: false,
        maxEntries: maxEntries.current.value,
        maxUsers: maxCollaborators.current.value,
        entries: [promptId],
        useRobotAsPlayer: useRobot.current.checked,
        imageUrl: imageAsUrl,
        genre: storyGenre.current.value,
        timeLimit: deadline.current.value,
        isCompleted: Number(maxEntries.current.value) - 1 == 0
      })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    }
  }

  ////For IMAGE UPLOAD TO GOOGLE BUCKET///
  const handleFireBaseUpload = (arenderSync) => {
    arenderSync.preventDefault();
    const image = arenderSync.target.files[0];
    // async magic goes here...
    if (image === "") {
      console.error(`not an image, the image file is a ${typeof image}`);
      return;
    }
    const uploadTask = storage.ref(`/images/${image.name}`).put(image);
    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log("Snapshot", snapShot);
      },
      (err) => {
        //catches the errors
        console.log("err", err);
      },
      () => {
        // gets the functions from storage references the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            imageAsUrl = fireBaseUrl;
          });
      }
    );
  };

  const inputEl = useRef();
  const promptId = uuidv4();
  const storyId = uuidv4();
  const titleEl = useRef();
  const useRobot = useRef(false);
  const maxEntries = useRef(1);
  const maxCollaborators = useRef(1);
  const storyGenre = useRef("Other");
  const deadline = useRef("5 minutes");

  const onButtonClick = (event) => {
    event.preventDefault();

    if (inputEl.current.value === "" || titleEl.current.value === "") {
      alert("Please enter a title and story prompt"); //Checks that story is not empty
    } else if (
      Number(maxEntries.current.value) < Number(maxCollaborators.current.value)
    ) {
      alert(
        "Entries should be greater than or equal to number of collaborators"
      );
    } else {
      //Verify if AI robot will participate
      saveToEntries(storyId, inputEl.current.value, promptId, user);
      saveToUserStories(user.email, storyId)
      saveToStories(
        inputEl.current.value,
        storyId,
        promptId,
        user,
        titleEl.current.value,
        imageAsUrl
      );
      props.history.push(`/displaystory/${storyId}`);
    }
  };
  return (
    <>
      <div className="container">
        <div className="col-12">
          <form>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput1">
                Enter a title for your story!
              </label>
              <input
                type="text"
                className="form-control"
                id="story-title"
                placeholder="Title"
                ref={titleEl}
              />
            </div>
            <input type="file" onChange={handleFireBaseUpload} />

            <div className="form-group">
              <label htmlFor="prompt-input">Enter story prompt</label>
              <textarea
                className="form-control"
                ref={inputEl}
                type="text"
                rows="5"
              />
            </div>
            <div className="form-group"></div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="defaultCheck1"
                ref={useRobot}
              />
              <label className="form-check-label" htmlFor="defaultCheck1">
                Use Robot as a player?
              </label>
            </div>

            <div>
              <label className="form-check-label" htmlFor="defaultCheck1">
                Max number of Entries?
              </label>
              <input
                className="form-control"
                type="number"
                min="1"
                step="1"
                ref={maxEntries}
              />
            </div>
            <div>
              <label className="form-check-label" htmlFor="defaultCheck1">
                Max number of Human Collaborators?
              </label>
              <input
                className="form-control"
                type="number"
                min="1"
                step="1"
                ref={maxCollaborators}
              />
            </div>
            <div className="form-group">
              <label htmlFor="select-deadline">Submission Deadline</label>
              <select
                select="true"
                className="form-control"
                id="exampleFormControlSelect1"
                ref={deadline}
              >
                <option>5 minutes</option>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>3 hours</option>
                <option>12 hours</option>
                <option>1 day</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="select-deadline">Story Genre</label>
              <select
                select="true"
                className="form-control"
                id="exampleFormControlSelect1"
                ref={storyGenre}
              >
                <option>Crime</option>
                <option>Fan Fiction</option>
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
            <button
              id="entry-input"
              onClick={onButtonClick}
              className="btn btn-dark"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default CreateStory;
