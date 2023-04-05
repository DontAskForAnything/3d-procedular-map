import React from 'react';
import ReactDOM from 'react-dom/client';
import Model from './model';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div id="cover">
      <h1>Procedural Map Generator</h1>
      <p>Refresh page to generate new map</p>

      <p className="bottomText" >Made by <a href="https://github.com/DontAskForAnything/">DontAskForAnything</a></p>
    </div>
    <Model />
  </React.StrictMode>
);

