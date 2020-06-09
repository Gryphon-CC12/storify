import React, { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import { auth } from "../../firebaseConfig";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "40%",
  },
}));

const ProfilePage = () => {
  const user = useContext(UserContext);
  const classes = useStyles();

  const { photoURL, displayName, email } = user;

  return (
    <div style={{ padding: 100 }} id="profile" className={classes.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        <Paper className={classes.paper}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={3}>
              <div
                style={{
                  background: `url(${
                    photoURL ||
                    "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
                  })  no-repeat center center`,
                  backgroundSize: "cover",
                  height: "100px",
                  width: "100px",
                }}
              ></div>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <Typography>{email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>{displayName}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
};

export default ProfilePage;
