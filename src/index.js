import React from 'react';
import ReactDOM from 'react-dom/client';
import RemnantBuilderApp from './RemnantBuilderApp';
import ReactGA from "react-ga4";
ReactGA.initialize("G-3J2SNG6Z0B");


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RemnantBuilderApp />
  </React.StrictMode>
);

