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
            <p>
              Keep in mind once you submit an entry it cannot be changed. This is done so the flow of the story is not altered particularly after other users have continued where you left at.
            </p>
            <p><b>
              DISCLAIMER: Storify uses <a target="_blank" rel="noopener noreferrer" href="https://openai.com/blog/better-language-models/">Open AI GPT-2</a>, a large-scale, unsupervised language model to generate coherent paragraphs of text. Given the unsupervised nature of Open AI GPT-2, it's impossible to predict the contents of the AI-generated text. For this reason, it's possible that swear words, sexual topics, or other NSFW elements may be included in the story. Please keep this in mind while using Storify.
            </b></p>
            <p className="styled bigger">
              Happy writing!
            </p>
          </div>
        </div>
    </div>
  );
}

export default About;
