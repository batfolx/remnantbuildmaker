import React from 'react';
import ReactDOM from 'react-dom/client';
import RemnantBuilderApp from './RemnantBuilderApp';
import ReactGA from "react-ga4";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ViewUrlBuild from "./components/ViewUrlBuild";
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {REPO_NAME} from "./constants";

ReactGA.initialize("G-3J2SNG6Z0B");


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<RemnantBuilderApp/>}/>
                    <Route path={`${REPO_NAME}`} element={<RemnantBuilderApp/>}/>
                    <Route path={"/build/:buildId"} element={<ViewUrlBuild/>}/>
                </Routes>

            </BrowserRouter>
        </ThemeProvider>

    </React.StrictMode>
);

