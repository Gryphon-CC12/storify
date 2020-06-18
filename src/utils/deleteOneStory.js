import firebase from "../firebaseConfig";
const db = firebase.firestore();

export default function deleteOneStory(storyIdToDelete, userEmail) {
    
    // delete story from user collection
    db.collection('users').where('email', '==', userEmail)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection("users").doc(doc.id).update({ "linkToStories": firebase.firestore.FieldValue.arrayRemove(storyIdToDelete)});
        });
        }
    )

    // get entry ids from story database
    // then delete each of the entries from entry db
    db.collection('StoryDatabase').where('id', '==', storyIdToDelete).get()
      .then(function (querySnapshot) {
        let entriesIdsArray = [];
        querySnapshot.forEach(function (doc) {
            entriesIdsArray.push(doc.data().entries)
        })
          return entriesIdsArray[0];  
        })
        .then(entriesIdsArray => {
            console.log('entriesIdsArray:', entriesIdsArray)
            entriesIdsArray.forEach((id) => {
                db.collection('Entries').where('id', '==', id)
                    .get()
                    .then((querySnapShot) => {
                        querySnapShot.forEach((doc) => {
                            doc.ref.delete()
                        })
                    })
                    .then(()=>{
                        console.log("deleted!")
                    })
                    .catch((error) => {
                    console.error("error!", error)
                })
            })
    })

    //delete story from story db
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
    }, 1000);
};

//62594131-7b98-405b-b75c-932cc3d5a591

// for deleting entries on user this might work:
// db.collection("users")
// .doc('linkToEntries')
// .where("entryId", "==", storyId)

// when updating entries after deletion, need to access story object and look at all users who have collaborated, then go to their specific user obj to delete that story entry from their entries list