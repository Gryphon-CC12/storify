import React from "react";
import { Link } from 'react-router-dom'
import rightChevron from '../../assets/rightChevron.svg'
import "./About.styles.scss";

function About() {
  return (
    <div id="about" className="container">
      <div className="row">
        <div className="col-12">
          <div className="header">
            <h1> About <span className="styled">Storify</span> </h1>
          </div>
  
          <div className="box">
          <h2>What is Storify?</h2>
            <p>
            Storify is a collaborative story-writing platform between humans and
            artificial intelligence.{" "}
            </p>
            <p>
              Create your own Story that others can participate in by clicking "Create Story", or browse the list of already submitted Stories for one to join. If you create your own Story, you can choose to have Robo-Writer participate too. Watch as the AI takes your adventures to exciting, unknown places!
            </p>
            </div>
          
            <div className="box">
          <h2>How does Storify work?</h2>
            <p>Anyone can join and collaborate in Storify!<br />Please take a moment to read the information below to have the best possible experience.</p>
            <h3>Creating Your Own Stories</h3>
            <p className="create-link">
            <Link to="/about"><img src={rightChevron} alt="right icon" /> Create Story page</Link>
            </p>
              <ul>
                <li>  
                  Title:<br/>The title for your Story. 
                </li> 
                <li>  
                  Text:<br/>This will be the beginning of the Story to which any collaborators will contribute.
                </li> 
                <li>  
                  Image:<br/>You can choose to add  an image that helps set the scene for the Story. (A default image will be used if none is uploaded). 
                </li>      
                <li>
                  Number of Human Collaborators:<br/>How many human participants the Story will have. Cannot be more than the number of entries set. Selecting 'one' will mean you are the only person able to participate.
                </li>
                <li>
                  Use Robo-Writer:<br/>You can choose to add Robo-Writer to contribute in your Story when it is its turn to write. 
                </li>
                <li>
                  Private Story:<br/>A private Story is hidden from the main list. You can share the link to people you'd like to collaborate with you. Keep in mind that anyone with the link can read and may join as collaborators if there are available slots. A private Story cannot be made into a public Story after the Story prompt is created.
                </li>
                <li>
                  Number of Entries:<br/>How many entries you'd like the Story to have before it's finished.
                </li>
              </ul>

          <h3>Collaborating in Others' Stories</h3> 
            <ul>
              <li>
                Joining:<br/>You can join and collaborate any Story provided there are still empty collaborator slots. Stories that have empty slots will have a 'Join the Story' button at the bottom of the Story's page. Once you join, you will be added to the collaborator list and when it becomes your turn, you'll receive an email notification stating when you should submit your entry by. (The deadline is decided by the Story creator.) 
              </li>
              <li>
                Story Flow:<br/>Keep in mind that once you submit an entry, it cannot be changed. This is done so the flow of the story is not altered, particularly after other users have continued on from where your original entry left off at.
              </li>
              <li>
                Entry Deadline:<br/>Make sure you’re not missing your turns. You will be skipped over if you don’t add your entry by the end of the designated time limit (e.g. if it’s 5 minutes, you have to add your entry within five minutes or the next player in the queue will become “in turn”. You can see the deadline next to the text input area where you add your entries.
              </li>
              <li>
                Passing Turns:<br/>You can pass your turn to the next collaborator in line if you do not feel like submitting an entry during your turn. If you don't manage to submit an entry by your deadline, you will also forfeit your turn.
              </li>
            </ul>
            </div>
          
          <div className="disclaimer-box">
          <h2 className="disclaimer-heading">Disclaimer:</h2>
          <p className="disclaimer">
            Storify uses <a target="_blank" rel="noopener noreferrer" href="https://openai.com/blog/better-language-models/">Open AI GPT-2</a>, a large-scale, unsupervised language model to generate coherent paragraphs of text. Given the unsupervised nature of Open AI GPT-2, it's impossible to predict the contents of the AI-generated text. For this reason, it's possible that swear words, sexual topics, or other NSFW elements may be included in the story. Please keep this in mind while using Storify.
          </p>
          </div>

            <p className="styled bigger">
              Happy writing!
            </p>
          </div>
        </div>
    </div>
    
  ); 
}

export default About;
