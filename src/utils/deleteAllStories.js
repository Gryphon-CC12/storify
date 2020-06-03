import firebase from "../firebaseConfig";

const db = firebase.firestore();
// DELETE ALL ENTRIES FROM deleteAllStoryDatabase
export default function deleteAllStoryDatabase() {
    db.collection("StoryDatabase")
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
