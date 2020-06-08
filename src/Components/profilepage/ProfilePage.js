import React, { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import { auth } from "../../firebaseConfig";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));


const ProfilePage = () => {
  const user = useContext(UserContext);
  const classes = useStyles();
  
  const { photoURL, displayName, email } = user;
  
  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12}></Grid>
          <Grid item xs={3}>
          <div
            style={{
              background: `url(${photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'})  no-repeat center center`,
              backgroundSize: "cover",
              height: "100px",
              width: "100px"
            }}
          ></div>
          </Grid>
          <Grid item xs={9}>
            <Typography>{displayName}</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography>{email}</Typography>
          </Grid>

        </Grid>
        <button className="btn btn-info" onClick ={() => {auth.signOut()}}>Sign out</button>
        </Container>
      </div>
  ) 
};

export default ProfilePage;