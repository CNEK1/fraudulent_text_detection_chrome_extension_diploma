import { useState, useEffect } from "react";
import Spinner from "./Spinner/Spinner";
import Button from "./Button/Button";
import styles from "./App.module.css";

const App = () => {
  const [scriptResp, setScriptResp] = useState("Answer for your text");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDisabled(false), 2500);
    return () => clearTimeout(timer);
  }, [disabled]);
  const handleClick = async () => {
    setDisabled(true);
    setLoading(true);
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      NPLAPI: "someTab",
    });
    setScriptResp(response);
    setLoading(false);
  };

  // Function to interpret the response
  const interpretResponse = (response) => {
    if (response.length === 0) {
      return "No response yet";
    }
    return response[0] === 0 ? "Not fraudulent" : "Fraudulent";
  };
  return (
    <div className={styles.app}>
      <h1>Text Analysis Tool</h1>
      <Button disabled={disabled} onClick={handleClick}>
        Analyze text
      </Button>
      <h2>Text analysis results</h2>
      <p>{loading ? <Spinner /> : interpretResponse(scriptResp)}</p>
    </div>
  );
};
export default App;
