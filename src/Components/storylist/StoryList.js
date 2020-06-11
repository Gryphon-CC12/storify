import React, {useState, useEffect, useRef} from 'react';
import './StoryList.styles.scss';
import StoryPreview from '../storypreview/StoryPreview'
import firebase from '../../firebaseConfig';
import { v4 as uuidv4 } from "uuid";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


function StoryList() {
  const [stories, setStories] = useState([]);
  const classes = useStyles();
  const [genre, setGenre] = useState("All");
  const storyGenre = useRef("");

  useEffect(() => {
    retrieveAllStories(genre);
  }, [genre])

  const selectGenre = (event) => {
    setGenre(event.target.value)
  }

  const retrieveAllStories = async (genre) => {
    
    if (genre === "All" || genre === undefined) {
      const data = await db.collection('StoryDatabase').orderBy('dateCreated').get();
      setStories([]);
      setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
    } else {
      const data = await db.collection('StoryDatabase').where('genre', "==", genre).get();
      setStories([]);
      setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
    }
  };

  return (
    <div className="display-story">
      <CssBaseline />
      
      <Container maxWidth="lg" className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id="select-genre">Filter Stories</InputLabel>
              <Select
                labelId="select-genre"
                id="select-dropdown"
                value={genre}
                onChange={selectGenre}
                ref={storyGenre}
              >
                <MenuItem value={"All"}>All</MenuItem>
                <MenuItem value={"Crime"}>Crime</MenuItem>
                <MenuItem value={"Fan Fiction"}>Fan Fiction</MenuItem>
                <MenuItem value={"Fantasy"}>Fantasy</MenuItem>
                <MenuItem value={"Historical"}>Historical</MenuItem>
                <MenuItem value={"Horror"}>Horror</MenuItem>
                <MenuItem value={"Humor"}>Humor</MenuItem>
                <MenuItem value={"Romance"}>Romance</MenuItem>
                <MenuItem value={"Sci-fi"}>Sci-fi</MenuItem>
                <MenuItem value={"Thriller"}>Thriller</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {stories.map((story) => {         
            return (
              <Grid container item xs={6} key={uuidv4()}>
                <StoryPreview storyProp={story.id}/>
              </Grid>
            )
          })}
        </Grid>
      </Container>
		</div>
  );
}

export default StoryList;
