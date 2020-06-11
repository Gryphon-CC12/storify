import firebase from "../firebaseConfig";

const db = firebase.firestore();
// DELETE ALL ENTRIES FROM DB
export default function deleteAllEntries() {
    db.collection("Entries")
        .get()
        .then(res => {
            res.forEach(element => {
                element.ref.delete();
            });
        });
    
    setTimeout(() => {
        window.location.reload(false);
    }, 500);
};