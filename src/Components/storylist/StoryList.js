import React, {useState, useEffect, useRef} from 'react';
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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
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
  const [genre, setGenre] = useState("");
  const storyGenre = useRef("");

  const handleChange = (event) => {
    setGenre(event.target.value);
  };

  useEffect(() => {
    console.log('storyGenre in USE EFFECT', storyGenre.current.value);
    
    retrieveAllStories(storyGenre.current.value);
  }, [genre])

  const selectGenre = () => {
    setGenre(storyGenre.current.value)
  }

  const retrieveAllStories = async (genre) => {
    // console.log('genre FOR STORY LIST', genre);

    if (genre === "All") {
      const data = await db.collection('StoryDatabase').orderBy('dateCreated').get();
      setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
    } else {
      const data = await db.collection('StoryDatabase').where('genre', "==", genre).get();
      setStories([]);
      setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
      console.log('data genre FOR STORY LIST ', data);
    }

    

  };
  return (
    <div className="DisplayStory">
      <CssBaseline />
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
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
          <MenuItem value={"Sci-Fi"}>Sci-fi</MenuItem>
          <MenuItem value={"Thriller"}>Thriller</MenuItem>
          <MenuItem value={"Other"}>Other</MenuItem>
        </Select>
      </FormControl>
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