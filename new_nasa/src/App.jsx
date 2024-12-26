import { useState } from "react";
import nasaLogo from "./assets/nasa-6.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://www.nasa.gov/" target="_blank">
          <img src={nasaLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>API integration</h1>
    </>
  );
}

export default App;
