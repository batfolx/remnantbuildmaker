import React from 'react';
import ReactDOM from 'react-dom/client';
import RemnantBuilderApp from './RemnantBuilderApp';
import ReactGA from "react-ga4";
import {HashRouter, Route, Routes} from "react-router-dom";
import ViewUrlBuild from "./components/ViewUrlBuild";
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {REPO_NAME} from "./constants";
import store from "./store/store";
import {Provider} from "react-redux";

ReactGA.initialize("G-3J2SNG6Z0B");


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <HashRouter>
                    <Routes>
                        <Route path={"/"} element={<RemnantBuilderApp/>}/>
                        <Route path={`${REPO_NAME}`} element={<RemnantBuilderApp/>}/>
                        <Route path={"/build/:buildId"} element={<ViewUrlBuild/>}/>
                    </Routes>

                </HashRouter>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);

