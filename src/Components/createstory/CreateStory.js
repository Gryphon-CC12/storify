import React, { useState, useRef, useContext } from 'react';
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import saveToEntries from "../../utils/saveToEntries"
import {storage} from "../../firebaseConfig"

import { UserContext } from "../../providers/UserProvider";


// import { storage } from "../../firebaseConfig"
import 'firebase/storage'

const db = firebase.firestore();



function CreateStory() {

    ////For google image upload
    const allInputs = {imgUrl: ''}
    const [imageAsFile, setImageAsFile] = useState('')
    // const [imageAsUrl, setImageAsUrl] = useState("")
    const author = useContext(UserContext);
    let imageAsUrl = ""
    /////

/////FOR IMAGE UPLOAD TO GOOGLE BUCKET
    console.log(imageAsFile)
    // const handleImageAsFile = (e) => {
    //     // e.preventDefault();
    //     const image = e.target.files[0]
    //     setImageAsFile(imageFile => (image));
    //     // await handleFireBaseUpload(e);
    // }
//////////////


function saveToStories(event, id, author, title, imageAsUrl) {
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
        maxEntries: maxEntries.current.value,
        maxUsers: maxCollaborators.current.value,
        upvotes: 0,
        entries: [id],
        useRobotAsPlayer: useRobot.current.checked,
        imageUrl : imageAsUrl,
        genre: storyGenre.current.value,
        timeLimit: deadline.current.value
    })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        }); 
}

    
////For IMAGE UPLOAD TO GOOGLE BUCKET///
    const handleFireBaseUpload = (arenderSynce) => {
        arenderSynce.preventDefault()
        const image = arenderSynce.target.files[0]
        console.log('start of upload')
        // async magic goes here...
        if(image === '' ) {
            console.error(`not an image, the image file is a ${typeof(image)}`);
            return;
        }
        const uploadTask = storage.ref(`/images/${image}.name}`).put(image);
            //initiates the firebase side uploading 
        uploadTask.on('state_changed', 
            (snapShot) => {
            //takes a snap shot of the process as it is happening
            console.log("Snapshot", snapShot)
            }  , (err) => {
            //catches the errors
            console.log("err", err)
            }, () => {
            // gets the functions from storage refences the image storage in firebase by the children
            // gets the download url then sets the image from firebase as the value for the imgUrl key:
            console.log("image.name", image.name)
            storage.ref('images').child(image.name).getDownloadURL()
                .then(fireBaseUrl => {
                console.log('fireBaseUrl', fireBaseUrl);
                imageAsUrl = fireBaseUrl;
                // setImageAsUrl(imageAsUrl => ({...imageAsUrl, imgUrl: fireBaseUrl}))
                console.log("ImageAsUrl",imageAsUrl)
            })
            });

        // setTimeout(() => {
        //     onButtonClick(arenderSynce)
        // }, 3000);
    }

// https://firebasestorage.googleapis.com/v0/b/seniorgryphon-df706.appspot.com/o/images%2F200x200bb.jpg?alt=media&token=fe0b6307-93e0-4ea7-98ba-3f597dc79439
 
// bucket:   seniorgryphon-df706.appspot.com   path   images/200x200bb.jpg
//////////////      

    const inputEl = useRef();
    const id = uuidv4();
    const titleEl = useRef()
    const useRobot = useRef(false);
    const maxEntries = useRef(1);
    const maxCollaborators = useRef(1);
    const storyGenre = useRef("Other");
    const deadline = useRef("5 minutes");

    console.log("IDDD", id)
    
    const onButtonClick = (event) => {
        event.preventDefault();
        
        console.log("UseRobot", useRobot.current.checked)
        console.log("maxEntries", maxEntries.current.value)
        console.log("maxCollaborators", maxCollaborators.current.value)
        console.log("storyGenre", storyGenre.current.value)
        console.log("deadline", deadline.current.value)

        console.log('imageAsUrl in ButtonClick', imageAsUrl);
        // `current` points to the mounted text input element
        // await handleFireBaseUpload(event);
        //   setTimeout(async() => {
        console.log("waiiitinng! for ", imageAsUrl.imgUrl)
        saveToEntries(inputEl.current.value, id, author);
        saveToStories(inputEl.current.value, id, author, titleEl.current.value, imageAsUrl);
        console.log("TITLE", titleEl.current.value)
        console.log("test: is getting data from button?", inputEl, id);
        // }, 2500);
    };
    return (
        <>
            <form className="col-8">
                <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">Enter a title for your story!</label>
                    <input type="text" className="form-control" id="story-title" placeholder="Title" ref={titleEl}/>
                </div>
                <input 
                    type="file"
                    onChange={handleFireBaseUpload}
                />
                <div className="form-group">
                    <label htmlFor="prompt-input">Enter story prompt</label>
                    <textarea className="form-control" ref={inputEl} type="text" rows="10" />
                </div>
                <div className="form-group">
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" ref={useRobot} />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        Use Robot as a player?
                    </label>
                </div>
                <div>
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        Max number of Entries?
                    </label>
                    <input type="number" min="1" step="1" ref={maxEntries} />
                </div>
                <div>
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        Max number of Collaborators?
                    </label>
                    <input type="number" min="1" step="1" ref={maxCollaborators}/>
                </div>
                 <div className="form-group">
                    <label htmlFor="select-deadline">Submission Deadline</label>
                    <select select="true" className = "form-control" id = "exampleFormControlSelect1" ref={deadline}>
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
                <div className="form-group">
                    <label htmlFor="select-deadline">Story Genre</label>
                    <select select="true" className = "form-control" id = "exampleFormControlSelect1" ref={storyGenre}>
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
            </form>
            {/* <form> */}
            {/* <form onSubmit={onButtonClick}> */}
            {/* </form> */}
            {/* <button>Upload your art to firebase Which one is this?</button> */}
            {/* <img src={imageAsUrl} alt="preview" height="50"  width="100"/> */}
            <button id="entry-input" onClick={onButtonClick} className="btn btn-dark">Submit</button>
        </>
    );
}
export default CreateStory;