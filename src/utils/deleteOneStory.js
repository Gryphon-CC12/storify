import firebase from "../firebaseConfig";
const db = firebase.firestore();

export default function deleteOneStory(storyIdToDelete, userEmail) {
    
    
    db.collection('users').where('email', '==', userEmail)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection("users").doc(doc.id).update({ "linkToStories": firebase.firestore.FieldValue.arrayRemove(storyIdToDelete)});
        });
        }
    )

    db.collection("StoryDatabase")
    .where('id', '==', storyIdToDelete)
    .get()
    .then(storyArray => {
        storyArray.forEach(story => {
            story.ref.delete();
        });
    });

    setTimeout(() => {
        window.location.reload(false);
    }, 500);
};

//62594131-7b98-405b-b75c-932cc3d5a591

// for deleting entries on user this might work:
// db.collection("users")
// .doc('linkToEntries')
// .where("entryId", "==", storyId)

// when updating entries after deletion, need to access story object and look at all users who have collaborated, then go to their specific user obj to delete that story entry from their entries list