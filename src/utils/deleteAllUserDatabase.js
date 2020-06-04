import firebase from "../firebaseConfig";

const db = firebase.firestore();
// DELETE ALL ENTRIES FROM DB
export default function deleteAllUserDatabase() {
    db.collection("UserDatabase")
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