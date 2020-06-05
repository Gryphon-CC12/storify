import React, { useState, useRef, useContext } from 'react';
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import saveToEntries from "../../utils/saveToEntries"
import {storage} from "../../firebaseConfig"

import { UserContext } from "../../providers/UserProvider";


// import { storage } from "../../firebaseConfig"
import 'firebase/storage'

const db = firebase.firestore();

function saveToStories(event, id, author, title) {
    //event.preventDefault();
    console.log("e for stories", id);
    db.collection("StoryDatabase").add({
        id: uuidv4(),
        dateCreated: new Date(),
        title: title,
        likes: 0,
        author: author.displayName,
        emails: [author.email],
        isPrompt: true,
        maxEntries: 1,
        maxUsers: 1,
        upvotes: 0,
        entries: [id],
        useRobotAsPlayer: false,
        imageUrl : "https://cdn.pixabay.com/photo/2016/06/08/19/46/cereal-1444495_960_720.jpg"
    })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        }); 
}

function CreateStory() {

    ////For google image upload
    const allInputs = {imgUrl: ''}
    const [imageAsFile, setImageAsFile] = useState('')
    const [imageAsUrl, setImageAsUrl] = useState(allInputs)
    const author = useContext(UserContext);

    /////

/////FOR IMAGE UPLOAD TO GOOGLE BUCKET
    console.log(imageAsFile)
    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        setImageAsFile(imageFile => (image))
    }
//////////////

////For IMAGE UPLOAD TO GOOGLE BUCKET///
    const handleFireBaseUpload = e => {
        e.preventDefault()
    console.log('start of upload')
    // async magic goes here...
    if(imageAsFile === '' ) {
        console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
    }
    const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)
        //initiates the firebase side uploading 
        uploadTask.on('state_changed', 
        (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot)
        }  , (err) => {
        //catches the errors
        console.log(err)
        }, () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage.ref('images').child(imageAsFile.name).getDownloadURL()
            .then(fireBaseUrl => {
            setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))
        })
        })
        console.log("ImageAsUrl",imageAsUrl)
    }
//////////////      


    const inputEl = useRef(null);
    const id = uuidv4();
    const titleEl = useRef(null)
    console.log("IDDD", id)
    
    const onButtonClick = (event) => {
    event.preventDefault();
      // `current` points to the mounted text input element
      console.log("TITLE", titleEl.current.value)
      saveToEntries(inputEl.current.value, id, author);
      saveToStories(inputEl.current.value, id, author, titleEl.current.value);
      console.log("test: is getting data from button?", inputEl, id);
    };
    return (
        <>
            <form className="col-8">
                <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">Enter a title for your story!</label>
                    <input type="text" className="form-control" id="story-title" placeholder="Title" ref={titleEl}/>
                </div>
                <div className="form-group">
                    <label htmlFor="prompt-input">Enter story prompt</label>
                    <textarea className="form-control" ref={inputEl} type="text" rows="10" />
                    <button id="entry-input" onClick={onButtonClick} className="btn btn-dark">Submit</button>
                </div>
                <div className="form-group">
                    <label htmlFor="artwork-input">Upload some art to go with your story!</label>
                    <input type="file" className="form-control-file" id="artwork-input" />
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        Use Robot as a player?
                    </label>
                </div>
                 <div className="form-group">
                    <label htmlFor="select-deadline">Submission Deadline</label>
                    <select select="true" className = "form-control" id = "exampleFormControlSelect1" >
                    <option>5 minutes</option>
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>3 hours</option>
                    <option>12 hours</option>
                    <option>1 day</option>
                    <option>1 week</option>
                    </select>
                </div>
            </form>
            <p>Test Upload to Google Bucket</p>
            <form onSubmit={handleFireBaseUpload}>
                <input 
                    type="file"
                    onChange={handleImageAsFile}
                />
            <button>upload to firebase</button>
            </form>
            <img src={imageAsUrl.imgUrl} alt="image tag" />
        </>
    );
}

export default CreateStory;

