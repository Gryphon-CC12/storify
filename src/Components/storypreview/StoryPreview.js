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
  const [genre, setGenre] = useState("");
  const [likes, setLikes] = useState(0);



  function fetchFirstEntryForStory(id) {
    db.collection('StoryDatabase').where('id', '==', id).get()
      .then(function (querySnapshot) {
        let ids_array = [];
        querySnapshot.forEach(function (doc) {
          setGenre(doc.data().genre);
          setLikes(doc.data().likes);
          ids_array.push(doc.data().entries)
        })
        return ids_array[0][0];
      })
      .then(async id => {
        const data = await db.collection('Entries').where('id', '==', id).get();
        setStoryText(data.docs.map((doc) => {
          return doc.data().text.split('.')[0] + ".";   // Returns previous only till the first .
        }));
      })
  };

  useEffect(() => {
    fetchFirstEntryForStory(props.storyProp.id);
    fetchImageURL(props.storyProp.id);
  }, [props.storyProp.id])

  // READ FROM DB
  const fetchImageURL = async (id) => {
    const db = firebase.firestore();
    const data = await db.collection('StoryDatabase').where('id', '==', id).get();
    setImageURL(data.docs.map((doc) => doc.data().imageUrl));
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid id="preview" container spacing={2}>
          <Grid item>
            <img className={classes.img} alt="user-uploaded story artwork" src={imageURL} width="200" height="150" />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid id="story" item xs>
                <Typography gutterBottom variant="title">
                  {props.storyProp.title}
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
                <Grid item>
                  <Link className="details read-more" to={{ pathname: `/displaystory/${props.storyProp.id}` }}><p>Read more</p></Link>
                </Grid>
              </Grid>
              
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default StoryPreview;

