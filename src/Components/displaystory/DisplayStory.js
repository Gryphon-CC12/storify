import React from 'react';
import './DisplayStory.styles.scss';
import firebase from '../../firebaseConfig';

const db = firebase.firestore();

// READ FROM DB
const fetchData = async () => {
    const data = await db.collection('Entries').orderBy('date').get();
    //setGames(data.docs.map((doc) => doc.data()));
    console.log("data", data)
  };



function DisplayStory() {

  
  return (
    <div className="DisplayStory">
      Here is a story:
    {fetchData}
    </div>
  );
}

export default DisplayStory;