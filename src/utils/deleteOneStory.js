import firebase from "../firebaseConfig";
const db = firebase.firestore();

export default function deleteOneStory(storyId) {
    db.collection("StoryDatabase")
        .where('id', '==', storyId)
        .get()
        .then(storyArray => {
            storyArray.forEach(story => {
                story.ref.delete();
            });
        });
};
