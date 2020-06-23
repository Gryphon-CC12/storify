/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import "./StoryList.styles.scss";
import StoryPreview from "../storypreview/StoryPreview";
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import rightChevron from '../../assets/rightChevron.svg'
import downChevron from '../../assets/downChevron.svg'


const db = firebase.firestore();


// setInterval(function(){ callAPI(); }, 60000);
// let last_enty_uri = '"Yes...." the cat said, feeling out of shape and not quite what he used to be. "Well how about I tell you one of the stories of a hit I had. Maybe then youll believe me... Back in June of 2001 I had been assigned to remove a high profile target, however things werent going to be that easy...';
  
// function callAPI() {
// fetch("http://ec2-3-115-72-145.ap-northeast-1.compute.amazonaws.com/generate/" + last_enty_uri)
//           .then(response => {
//             return response.json()
//           })
//             .then(async output=>{
//               console.log("output.result", output.result)
//               // let entry_id = uuidv4()
//               // let trimmed_output = output.result.trim();
//               // let trimmed_output_arr = trimmed_output.split(/\n/g);
//               // let unique_output = [...new Set(trimmed_output_arr)].join("\n"); 
//               // console.log("unique_output", unique_output)
//               // await saveToEntries(story_id, unique_output, entry_id, robot_user);
//               // await saveToUserEntries(robot_user.email, entry_id, story_id)
//               // await pushToStory(story_id, entry_id, robot_user, currentTimeLimit); 
//           })
//         }













function StoryList() {
  const [stories, setStories] = useState([]);
  // const [storiesComp, setStoriesComp] = useState([]);
  const [genre, setGenre] = useState("All");
  const storyGenre = useRef("");
  const storyCompletion = useRef("");
  const [completion, setCompletion] = useState("All")
  const [like, setLike] = useState("By Newest");
  const storyLike = useRef("");

  useEffect(() => {
    retrieveStoriesByAllFilters(completion, genre, like);
  }, [completion, genre, like])

  const selectGenre = (event) => {
    setGenre(event.target.value)
  }
  const selectCompletion = (event) => {
    setCompletion(event.target.value)
  }
  const selectLike = (event) => {
    setLike(event.target.value)
  }

  const retrieveStoriesByAllFilters = async (completion, genre, like) => {

    let isCompleted;
    if (completion == "Finished") {
      isCompleted = true;
    } else if (completion == "Unfinished") {
      isCompleted = false;
    }

    let byLikes;
    if (like === "By Newest" || like === undefined) {
      byLikes = "dateCreated";
    } else {
      byLikes = "likes";
    }


    if (completion == "All" || completion == undefined) {
      if (genre === "All" || genre === undefined) {
        setStories([]);
        const data = await db
        .collection("StoryDatabase")
        .where("isPrivate", "==", false)
        .orderBy(byLikes, 'desc')
        .get();

        setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
      } else {
        setStories([]);
        const data = await db
        .collection("StoryDatabase")
        .where("isPrivate", "==", false)
        .where("genre", "==", genre)
        .orderBy(byLikes, 'desc')
        .get();

        setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
      }
    } else {

      if (genre === "All" || genre === undefined) {
        setStories([]);
        const data = await db
        .collection("StoryDatabase")
        .where("isPrivate", "==", false)
        .where('isCompleted', "==", isCompleted)
        .orderBy(byLikes, 'desc')
        .get();
        
        setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
      } else {

        const data = await db
        .collection("StoryDatabase")
        .where("isPrivate", "==", false)
        .where("genre", "==", genre)
        .where('isCompleted', "==", isCompleted)
        .orderBy(byLikes, 'desc')
        .get();
        setStories([]);

        setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
      }
    }
  };
  
  const handleFilterButtonClick = () => {
    const filters = document.body.querySelector(".select-wrapper");
    const filterIcon = document.body.querySelector("#filter-button-icon");
    const filterContainer = document.body.querySelector(".filter-wrapper");
    if (filters.style.display === "none") {
      filters.style.display = "flex";
      filterContainer.style.backgroundColor = "rgb(255, 255, 255)";
      filterContainer.style.boxShadow = "0px 3px 9px rgba(0,0,0,0.12), 0px 3px 18px rgba(0,0,0,0.08)"
      filterIcon.src = downChevron;
    } else {
      filters.style.display = "none";
      filterIcon.src = rightChevron;
      filterContainer.style.backgroundColor = "inherit";
      filterContainer.style.boxShadow = "none"
    }
  }

  return (
    <div className="display-story">     
      <div className="container">
        <div className="row">
          <div className="col filter-wrapper g-0 hvr-sweep-to-right">
            <div className="col-12 filter-button" onClick={handleFilterButtonClick}>Filter Stories{" "}
            <img id="filter-button-icon" src={rightChevron} alt="filter button icon" />
            </div>
            <div className="select-wrapper" style={{ display: "none" }} >
              <div className="selects">
              <div className="genre-filter">
                <form>
                  <label id="select-genre">Genre:</label>
                  <select
                    labelid="select-genre"
                    id="select-dropdown"
                    value={genre}
                    onChange={selectGenre}
                    ref={storyGenre}
                  >
                    <option value={"All"}>All</option>
                    <option value={"Crime"}>Crime</option>
                    <option value={"Fan Fiction"}>Fan Fiction</option>
                    <option value={"Fantasy"}>Fantasy</option>
                    <option value={"Historical"}>Historical</option>
                    <option value={"Horror"}>Horror</option>
                    <option value={"Humor"}>Humor</option>
                    <option value={"Romance"}>Romance</option>
                    <option value={"Sci-fi"}>Sci-fi</option>
                    <option value={"Thriller"}>Thriller</option>
                    <option value={"Other"}>Other</option>
                  </select>
              </form>
              </div>

              <div className="sort-filter">
                <form>
                  <label id="select-sort">Sort by:</label>
                  <select
                    labelid="select-sort"
                    id="sort-dropdown"
                    value={like}
                    onChange={selectLike}
                    ref={storyLike}
                  >
                    <option value={"By Newest"}>By Newest</option>
                    <option value={"Most Liked"}>By Likes</option>
                  </select>
                </form>
              </div>
              
              <div className="completion-filter">
                <form>
                  <label id="select-completion">Completion:</label>
                  <select
                    labelid="select-completion"
                    id="completion-dropdown"
                    value={completion}
                    onChange={selectCompletion}
                    ref={storyCompletion}
                  >
                    <option value={"All"}>All</option>
                    <option value={"Finished"}>Finished</option>
                    <option value={"Unfinished"}>Unfinished</option>
                  </select>
                </form>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="g-0">

            {
              stories.map((story) => {
                return (
                  <div className="container-fluid g-0" key={uuidv4()}>
                    <StoryPreview storyProp={story.id} />
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryList;