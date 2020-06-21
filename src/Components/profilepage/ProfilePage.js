import React, { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import StoryPreview from "../storypreview/StoryPreview";
import EntryPreview from "../entrypreview/EntryPreview";
import deleteAllStories from "../../utils/deleteAllStories";
import deleteAllEntries from "../../utils/deleteAllEntries";
import "./ProfilePage.styles.scss";

const ProfilePage = () => {
  const user = useContext(UserContext);
  const { displayName } = user;

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
          <div className="greeting">Welcome to your page, {displayName}!</div>

          <div>
            <h3 className="title">My Stories</h3>
            {user.linkToStories ? mapUserStories() : <p>You don't have any Stories yet!</p>}
          </div>

          <div>
            <h3 className="title">My Entries</h3>
            {user.linkToStories ? mapUserEntries() : <p>You don't have any entries yet!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
