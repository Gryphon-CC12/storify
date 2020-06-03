import firebase from "../firebaseConfig";
// import {v4 as uuidv4} from "uuid";
const db = firebase.firestore();

export default function saveToEntries(event, id) {
    console.log("e", event)
    db.collection("Entries").add({
            id: id,
            text: event,
            date: new Date(),
            likes: 0,
            author: "Harry Potter",
        })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}