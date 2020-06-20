import React from "react";
import "./About.styles.scss";

function About() {
  return (
    <div id="about" className="container">
      <div className="row">
        <div className="col-12">
          <h1 style={{ color: "grey" }}> About <span className="styled">Storify</span> </h1>
            <br />
            <p>
              Storify is a collaborative story-writing platform between humans and
              Artificial Intelligence.{" "}
            </p>
            <p>
              Join today to create your own story, invite friends to continue that
              story, and watch the Storify Bot take your adventure to exciting, unknown places.
            </p>
            <br></br>
            <b>How does Storify work?</b>
            <p>Anyone can join and collaborate in Storify! Please take a moment to read the rules below to have the best possible experience.</p>
          <ul>
            <li>
              🖋 Create a Story. The story creator decides key elements of the story.
            </li> 
            <li>  
              🖋 Set a title of the story. 
            </li> 
            <li>  
              🖋 Add an image that represents the story (a default image will be used if none is uploaded). 
            </li> 
            <li>  
              🖋 Enter your story prompt. This will be the beginning of the story to which your collaborators and Robo-Writer will contribute.
            </li>      
            <li>
              🖋 Robo-Writer. You can choose to add Robo-Writer to contribute in your story when it is it's turn to write. 
            </li>
            <li>
              🖋 Private Stories. A private story is hidden from the main story list page. You can share the link to people you'd like to collaborate with you.  Keep in mind that anyone with the link can read and may join as collaborators if there are available slots. A private story cannot be made into a public story after the story prompt is created.
            </li>
            <li>
              🖋 Set maximum number of Entries and Human Collaborators. Number of Human collaborators should not exceed the number of entries so each colaborator could add at least one entry.
            </li>

          </ul>
          <p>Collaborate in a Story.</p> 
          <ul>
            <li>
              🖋 You can join and collaborate any story provided that there are empty collaborator slots.  Click on 'Join as Collaborator' button to add yourself to the story. You will be added to the list and when your turn is up you'll be notified along with the time limit you have to submit your entry. 
            </li>
            <li>
              🖋 Story Flow. Keep in mind once you submit an entry it cannot be changed. This is done so the flow of the story is not altered particularly after other users have continued where you left at.
            </li>
            <li>
              🖋 Entry Deadline. Make sure you’re not missing your turns. You will be skipped over if you don’t add your entry by the end of the designated time limit (e.g. if it’s 5 minutes, you have to reply within five minutes or the next player in the queue will become “in turn.”. You can see the deadline time near the text input area.
            </li>
            <li>
              🖋 Pass turns. You can pass your turn to the next collaborator in line if you do not feel like submitting an entry on your turn.
            </li>
          </ul>
          <ul>
            <li>
            <b>
              🖋 DISCLAIMER: Storify uses <a target="_blank" rel="noopener noreferrer" href="https://openai.com/blog/better-language-models/">Open AI GPT-2</a>, a large-scale, unsupervised language model to generate coherent paragraphs of text. Given the unsupervised nature of Open AI GPT-2, it's impossible to predict the contents of the AI-generated text. For this reason, it's possible that swear words, sexual topics, or other NSFW elements may be included in the story. Please keep this in mind while using Storify.
            </b>
            </li>
           </ul> 
            <p className="styled bigger">
              Happy writing!
            </p>
          </div>
        </div>
    </div>
  ); 
}

export default About;
