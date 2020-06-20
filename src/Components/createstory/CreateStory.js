/* eslint-disable eqeqeq */
import React, { useRef, useContext } from "react";
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import saveToEntries from "../../utils/saveToEntries";
import { storage } from "../../firebaseConfig";
import { UserContext } from "../../providers/UserProvider";
import "firebase/storage";
import saveToUserStories from '../../utils/saveToUserStories';
import './CreateStory.scss';

//import emailjs from 'emailjs-com';
//require('dotenv').config()
//const {SERVICE_ID,TEMPLATE_ID,USER_ID} = process.env;

const db = firebase.firestore();

function CreateStory(props) {

  ////For google image upload
  // const allInputs = {imgUrl: ''}
  // const [imageAsFile, setImageAsFile] = useState('')
  const user = useContext(UserContext);
  let imageAsUrl = "https://bit.ly/2MEQ1yJ";
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
    event,
    storyId,
    promptId,
    title,
    imageAsUrl
  ) {

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
        lastAuthor: user.email,
        isCompleted: Number(maxEntries.current.value) - 1 == 0,
        isPrivate: isPrivate.current.checked
      })
      .then(function () {
        // console.log("Document successfully written!");
      })
      .catch(function (error) {
        //console.error("Error writing document: ", error);
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
        lastAuthor: user.email,
        isCompleted: Number(maxEntries.current.value) - 1 == 0,
        isPrivate: isPrivate.current.checked
      })
      .then(function () {
        //console.log("Document successfully written!");
      })
      .catch(function (error) {
        //console.error("Error writing document: ", error);
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
        // console.log("Snapshot", snapShot);
      },
      (err) => {
        //catches the errors
        console.error("err", err);
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
  const isPrivate = useRef(false);
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
        // user,
        titleEl.current.value,
        imageAsUrl
      );
      props.history.push(`/displaystory/${storyId}`);
    }
  };

  const displayRobotDisclaimer = () => {
    const robotWarningEl = document.querySelector("#robot-warning")
    if (useRobot.current.checked) {
      robotWarningEl.style.display = "block"
    } else {
      robotWarningEl.style.display = "none";
    }
  }


  return (
    <>
      <div className="page container-fluid">
        <div className="row">
          <div className="col-12 top-banner">
            <span className="banner-text">Tell your story.</span>
          </div>
        </div>

        <div className="row">
          <form>
            <div className="container create-story-grid-container">
              
              <div className="col-12 create-story-title">
                <label htmlFor="story-title">
                  Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="story-title"
                  ref={titleEl}
                />
              </div>

              <div className="col-12 create-story-text">
                <div className="form-group">
                  <label htmlFor="prompt-input">Text:</label>
                  <textarea
                    className="form-control"
                    ref={inputEl}
                    type="text"
                    rows="10"
                  />
                </div>
              </div>

  {/* OPTIONS START */}
              <div className="container-fluid g-0 create-story-options">
              {/* Collaborators */}
                <div className="col-12">
                  <div>
                    <label className="form-check-label" htmlFor="defaultCheck1">
                      Number of human collaborators:
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      ref={maxCollaborators}
                    />
                  </div>
                </div>

              {/* Robot */}
                <div className="col-12 robot-filter">
                  <div className="form-check robot-check">
                    <label className="form-check-label" htmlFor="robot-check">
                      Include Robo-Writer:
                    </label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="robot-check"
                      ref={useRobot}
                      onChange={displayRobotDisclaimer}
                    />
                  </div>
                    <p id="robot-warning">
                    Heads up! The AI's responses can't be controlled and it can get a bit cheeky sometimes.<br/>Make sure you <a href="https://www.storifyapp.com/about">read our disclaimer</a> before choosing to use this feature.
                    </p>
                </div>

                <div className="col-12 private-filter">
                  <div className="form-check private-story-check">
                    <label className="form-check-label" htmlFor="private-story-check">
                      Private Story:
                    </label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="private-story-check"
                      ref={isPrivate}
                    />
                  </div>
                </div>
              
              {/* Entries */}
                <div className="col-12">
                  <div>
                    <label className="form-check-label" htmlFor="defaultCheck1">
                      Number of entries:
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      ref={maxEntries}
                    />
                  </div>
                </div>

              {/* Genre */}
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="select-deadline">Genre:</label>
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
                </div>

              {/* Deadline */}
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="select-deadline">Entry Deadline:</label>
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
                </div>
              </div> 
  {/* OPTIONS EMD */}
                
              <div className="col-12">
                <p className='image-label'>Image <span style={{ fontSize: "smaller" }}>(optional)</span>:</p>
                <div className="form-file">
                  <label htmlFor="image-input" className="form-file-label">
                    <span className="form-file-text text-truncate"></span>
                    <span className="form-file-button">Browse</span>
                  </label>
                  <input
                    type="file"
                    className="form-file-input"
                    id="image-input"
                    onChange={handleFireBaseUpload} 
                  />
                </div>
              </div>

            </div>
              <div className="row button-wrapper">
                <button
                  id="entry-input"
                  onClick={onButtonClick}
                  className="btn btn-dark"
                >
                  Submit
                </button>
              </div>
          </form>
        </div>

      </div>
    </>
  );
}
export default CreateStory;
