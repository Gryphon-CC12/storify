import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EntryPreview.styles.scss';
import firebase from "../../firebaseConfig";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';


const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'justified',
    color: theme.palette.text.secondary,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },

}));

function EntryPreview(props) {

  const [storyTitle, setStoryTitle] = useState([]);
  const [entryText, setEntryText] = useState("");
  const [entryLikes, setEntryLikes] = useState(0);

  function fetchStoryTitle(storyId) {
    db.collection('StoryDatabase').where('id', '==', storyId).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          setStoryTitle(doc.data().title);
        })
      })
  };

  const fetchEntryDetails = (entryId) => {
    db.collection('Entries').where('id', '==', entryId).get()
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          setEntryText(doc.data().text);
          setEntryLikes(doc.data().likes);
        })
      }
    )
  }

  useEffect(() => {
    fetchStoryTitle(props.storyId);
    fetchEntryDetails(props.entryId);
  }, [props.storyId, props.entryId])

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Link className="details read-more" to={{ pathname: `/displaystory/${props.storyId}` }}>
        <Paper className={classes.paper}>
          <Grid id="preview" container spacing={2}>
                <Grid id="story" item xs>
                  <Typography gutterBottom variant="subtitle1">
                    {storyTitle}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {entryText}
                  </Typography>
                  
                </Grid>
                <Grid item xs container direction="row" spacing={2}>
                  <Grid item>
                    <p className="details likes" style={{ cursor: 'pointer' }}>
                      <FavoriteIcon id="heart" /> {entryLikes}
                    </p>
                  </Grid>
                </Grid>
          </Grid>
        </Paper>
      </Link>
    </div>
  );
}

export default EntryPreview;

