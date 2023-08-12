import {alpha, AppBar, Box, IconButton, InputBase, styled, Toolbar, Typography} from "@mui/material";
import RemnantItem from "./components/RemnantItem";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {BorderColor} from "./constants";
import RingsInventory from "./components/RingsInventory";
import RemnantStorageApi from "./storageApi";
import {useState} from "react";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function RemnantBuilderApp() {

    let internalLoadouts = RemnantStorageApi.getLocalLoadOuts();
    if (internalLoadouts.length === 0) {
       RemnantStorageApi.saveLocalLoadOuts(RemnantStorageApi.generateDefaultLoadOut());
       internalLoadouts = RemnantStorageApi.getLocalLoadOuts();
    }
    const [loadouts, setLoadouts] = useState(internalLoadouts.loadouts);
    const [currentLoadoutIndex, setCurrentLoadoutIndex] = useState(internalLoadouts.currentLoadoutIndex);



    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Box>
                <AppBar position={'static'}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                        >
                            Remnant Builder
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon/>
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{'aria-label': 'search'}}
                            />
                        </Search>
                    </Toolbar>
                </AppBar>

                <RingsInventory loadout={loadouts[currentLoadoutIndex]} currentLoadoutIndex={currentLoadoutIndex}/>

            </Box>
        </ThemeProvider>

    );
}

export default RemnantBuilderApp;
