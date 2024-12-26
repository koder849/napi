import { useState } from "react";
import nasaLogo from "./assets/nasa-6.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://www.nasa.gov/" target="_blank">
          <img src={nasaLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>API integration</h1>
    </>
  );
}

export default App;
