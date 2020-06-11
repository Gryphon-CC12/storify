import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StoryPreview.styles.scss';
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

function StoryPreview(props) {
  
  const [storyText, setStoryText] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [likes, setLikes] = useState(0);

  function fetchFirstEntryForStory(id) {
    try {
      db.collection('StoryDatabase').where('id', '==', id).get()
        .then(function (querySnapshot) {
          let ids_array = [];
          querySnapshot.forEach(function (doc) {
            setGenre(doc.data().genre);
            setLikes(doc.data().likes);
            setTitle(doc.data().title)
            ids_array.push(doc.data().entries)
          })
          console.log('ids_array:', ids_array)
          return ids_array[0][0];
        })
        .then(async id => {
          const data = await db.collection('Entries').where('id', '==', id).get();
          setStoryText(data.docs.map((doc) => {
            return (doc.data().text.split('. ')[0] + ".").substring(0,100);   // Returns previous only till the first.
          }));
        })
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    fetchFirstEntryForStory(props.storyProp);
    fetchImageURL(props.storyProp);
  }, [props.storyProp])

  // READ FROM DB
  const fetchImageURL = async (id) => {
    const db = firebase.firestore();
    const data = await db.collection('StoryDatabase').where('id', '==', id).get();
    setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  };

  const classes = useStyles();
  if (!props) {
    return <div></div>
  }
  return (
    <div className={classes.root}>
      <Link className="details read-more" to={{ pathname: `/displaystory/${props.storyProp}` }}>
        <Paper className={classes.paper}>
          <Grid id="preview" container spacing={2}>
            <Grid item>
              <img className={classes.img} alt="user-uploaded story artwork" src={imageURL} width="200" height="150" />
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid id="story" item xs>
                  <Typography gutterBottom variant="subtitle1">
                    {title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {storyText}
                  </Typography>
                  
                </Grid>
                <Grid item xs container direction="row" spacing={2}>
                  <Grid item>
                    <p className="details">
                      {genre}
                    </p>
                  </Grid>
                  <Grid item>
                    <p className="details likes" style={{ cursor: 'pointer' }}>
                      <FavoriteIcon id="heart" /> {likes}
                    </p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Link>
    </div>
  );
}

export default StoryPreview;

