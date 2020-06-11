import firebase from "../firebaseConfig";
// import {v4 as uuidv4} from "uuid";
const db = firebase.firestore();

export default function saveToEntries(storyId, event, id, author) {
    console.log("e for entries", event, id)
    db.collection("Entries").add({
        id: id,
        story: storyId,
        text: event,
        date: new Date(),
        likes: 0,
        author: author.displayName,
        email: author.email
    })
    .then(function () {
        console.log("Document successfully written!");
    })
    .catch(function (error) {
        console.error("Error writing document: ", error);
    });
}