import React from "react";
import "./About.styles.scss";

function About() {
  return (
    <div className="About">
      <h1 style={{ color: "grey" }}> About Storify </h1>
      <br />
      <p>
        Storify is a collaborative story-writing platform between humans and
        Artificial Intelligence.{" "}
      </p>
      <p>
        Join today to create your own story, invite friends to continue that
        story and watch robot take it to exciting unknown paths.
      </p>
      <p><b>
        DISCLAIMER: Storify uses <a target="_blank" href="https://openai.com/blog/better-language-models/">Open AI GPT-2</a>, a large-scale unsupervised language model which generates coherent paragraphs of text and achieves state-of-the-art performance on many language modeling benchmarks. Given the unsupervised nature of GPT-2 it's impossible to predict the contents of the AI generated text. For this reason it's possible that swear words, sexual topics, and other NSFW text is generated and displayed within the story. Please keep this in mind whilst you use Storify.
      </b></p>
      <p>
        Happy writing!.
      </p>
    </div>
  );
}

export default About;
