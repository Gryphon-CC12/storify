import firebase from "../firebaseConfig";
const db = firebase.firestore();

export default async function saveToUserEntries(userEmail, entryId, storyId) {

    db.collection('users').where('email', '==', userEmail)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("users").doc(doc.id).update({ "linkToEntries": firebase.firestore.FieldValue.arrayUnion({entryId: entryId, storyId: storyId})});
            });
        }
    )
}