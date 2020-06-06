import React, {useState, useEffect} from 'react';
import './StoryList.styles.scss';
import StoryPreview from '../storypreview/StoryPreview'
import firebase from '../../firebaseConfig';
import { v4 as uuidv4 } from "uuid";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


function StoryList() {
  const [stories, setStories] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    retrieveAllStories();
  }, [])

  const retrieveAllStories = async () => {
    const data = await db.collection('StoryDatabase').orderBy('dateCreated').get();
    setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
  };
  

  return (
    <div className="DisplayStory">
      <CssBaseline />
      <Container maxWidth="lg" className={classes.root}>
        <Grid container spacing={3}>
          {stories.map((story) => {         
            return (
              <Grid container item xs={6} key={uuidv4()}>
                <StoryPreview storyProp={story}/>
              </Grid>
            )
          })}
        </Grid>
      </Container>
		</div>
  );
}

export default StoryList;