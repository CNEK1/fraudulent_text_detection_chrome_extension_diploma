import axios from "axios";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  (async () => {
    if (request.NPLAPI === "someTab") {
      let selectedText = window.getSelection();
      if (selectedText && selectedText.toString().trim() !== "") {
        try {
          await axios
            .post("https://dzherela.com/textFraud/", {
              text: selectedText.toString(),
            })
            .then((tabResp) => {
              const result = JSON.stringify(tabResp.data.prediction);
              sendResponse(result);
            });
        } catch (error) {
          if (error.code === "ECONNABORTED") {
            sendResponse("Request timed out");
          } else {
            sendResponse(error.message);
          }
        }
      } else {
        sendResponse("No text selected");
      }
    }
  })();
  return true;
});

