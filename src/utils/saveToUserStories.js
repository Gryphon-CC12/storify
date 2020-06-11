import firebase from "../firebaseConfig";
const db = firebase.firestore();

export default async function saveToUserStories(userEmail, storyId) {
    db.collection('users').where('email', '==', userEmail)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("users").doc(doc.id).update({"linkToStories": firebase.firestore.FieldValue.arrayUnion(storyId)});
            });
        }
    )
}