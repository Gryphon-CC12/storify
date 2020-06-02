import React, { useState } from "react";

function APITest() {

  const deepai = require('deepai'); 
  const [outputText, setOutputText] = useState("Temp");
  
  function fetchAIStory(){
    
    deepai.setApiKey('85b4427e-815e-4efd-99e2-de892b8f2d22');
  
    (async function() {
        let resp = await deepai.callStandardApi("text-generator", {
                text: "My cats are playing, running around and making lots of noise",
        });
        console.log(resp);
        console.log(resp.output)
        await receiveStory(resp.output);
    })()
  }
  
  fetchAIStory();
  
  function receiveStory(story){
    setOutputText(story)
  }



  return (
    <div>
      <p>{outputText} Hello world 2!</p>
    </div>
  );
};

export default APITest;
