import React, { useRef, useContext } from 'react';
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import saveToEntries from "../../utils/saveToEntries"
import {storage} from "../../firebaseConfig"

import { UserContext } from "../../providers/UserProvider";
import 'firebase/storage'

import emailjs from 'emailjs-com';

require('dotenv').config()

const {SERVICE_ID,TEMPLATE_ID,USER_ID} = process.env;

const db = firebase.firestore();




function CreateStory() {

    ////For google image upload
    // const allInputs = {imgUrl: ''}
    // const [imageAsFile, setImageAsFile] = useState('')
    const author = useContext(UserContext);
    let imageAsUrl = ""
    /////

/////FOR IMAGE UPLOAD TO GOOGLE BUCKET
    // const handleImageAsFile = (e) => {
    //     // e.preventDefault();
    //     const image = e.target.files[0]
    //     setImageAsFile(imageFile => (image));
    //     // await handleFireBaseUpload(e);
    // }
//////////////

function saveToStories(event, id, author, title, imageAsUrl) {
    if (imageAsUrl === ""){
        imageAsUrl = "https://bit.ly/2MEQ1yJ"
    }
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



        //////  SEND EMAIL  ////
        let template_params = {
            "email": "chesswikipedia@gmail.com",
            "reply_to": "storify.io@gmail.com",
            "from_name": "Carlos222",
            "to_name": "Cherry",
            "message_html": "<h1>Your turn!</h1>"
         }
         
         emailjs.send(SERVICE_ID, TEMPLATE_ID, template_params, USER_ID)
            .then(function(response) {
               console.log('SUCCESS!', response.status, response.text);
            }, function(error) {
               console.log('FAILED...', error);
            });

        //Service Id: storify_io_gmail_com
        //UserId: user_70NWDG8bnJ3Vr3RmVjtBT
        //templateID: storifytest

        // let template_params = {
        //     "email": "gymnast1979@gmail.com",
        //     "reply_to": "storify.io@gmail.com",
        //     "from_name": "Carloooos",
        //     "to_name": "Gizmo",
        //     "message_html": "message_html_value"
        //  }
         
        //  var service_id = "default_service";
        //  var template_id = "template_vIZ8pRhu";
        //  emailjs.send('storify_io_gmail_com', 'storifytest', template_params, 'user_70NWDG8bnJ3Vr3RmVjtBT');


        // var template_params = {
        //     "reply_to": "storify.io@gmail.com",
        //     "from_name": "storify.io@gmail.com",
        //     "to_name": "to_name_value",
        //     "message_html": "message_html_value"
        //  }
         
        //  var service_id = "storify_io_gmail_com";
        //  var template_id = "template_vIZ8pRhu";
        //  emailjs.send(service_id, template_id, template_params);

}
    
////For IMAGE UPLOAD TO GOOGLE BUCKET///
    const handleFireBaseUpload = (arenderSynce) => {
        arenderSynce.preventDefault()
        const image = arenderSynce.target.files[0]
        // async magic goes here...
        if(image === '' ) {
            console.error(`not an image, the image file is a ${typeof(image)}`);
            return;
        }
        const uploadTask = storage.ref(`/images/${image.name}`).put(image);
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
                storage.ref('images').child(image.name).getDownloadURL()
                .then(fireBaseUrl => {
                imageAsUrl = fireBaseUrl;
            })
            });
    }

    const inputEl = useRef();
    const id = uuidv4();
    const titleEl = useRef()
    const useRobot = useRef(false);
    const maxEntries = useRef(1);
    const maxCollaborators = useRef(1);
    const storyGenre = useRef("Other");
    const deadline = useRef("5 minutes");

    
    const onButtonClick = (event) => {
        event.preventDefault();
        
        saveToEntries(inputEl.current.value, id, author);
        saveToStories(inputEl.current.value, id, author, titleEl.current.value, imageAsUrl);
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
            <button id="entry-input" onClick={onButtonClick} className="btn btn-dark">Submit</button>
        </>
    );
}
export default CreateStory;