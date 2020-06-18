import React, { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import StoryPreview from "../storypreview/StoryPreview";
import EntryPreview from "../entrypreview/EntryPreview";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import deleteAllStories from "../../utils/deleteAllStories";
import deleteAllEntries from "../../utils/deleteAllEntries";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "90%", //Was 40% in commit conflict
    marginTop: "5%",
  },
}));

const ProfilePage = () => {
  const user = useContext(UserContext);
  const classes = useStyles();

  const { photoURL, displayName, email } = user;

  const mapUserStories = () => {
    return user.linkToStories.map((story) => {
      return <StoryPreview storyProp={story} />;
    });
  };

  const mapUserEntries = () => {
    return user.linkToEntries.map((entry) => {
      return <EntryPreview storyId={entry.storyId} entryId={entry.entryId} />;
    });
  };

  const renderDeleteButton = () => {
    return (
      <>
        <button className="btn btn-danger" onClick={handleDeleteStories}>
          Delete All Stories
        </button>
        <button className="btn btn-danger" onClick={handleDeleteEntries}>
          Delete All Entries
        </button>
      </>
    );
  };

  async function handleDeleteStories() {
    await deleteAllStories;
  }

  async function handleDeleteEntries() {
    await deleteAllEntries;
  }

  return (
    <div className="display-story">
      <div className="container">
        <div className="row">
          {/* <div style={{ padding: 100 }} id="profile" className={classes.root}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={1}
            ></Grid>
            <Paper className={classes.paper}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={3} // VS spacing={1} in commit conflict
              >
                {user.admin === true ? renderDeleteButton() : ""}
                <Grid item xs={12} md={12} lg={3}>
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
          <div> */}

          <div>
            <h3>My Stories</h3>
            {user.linkToStories ? mapUserStories() : <p>Nothing!</p>}
          </div>

          <div>
            <h3>My Entries</h3>
            {user.linkToStories ? mapUserEntries() : <p>Nothing!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
