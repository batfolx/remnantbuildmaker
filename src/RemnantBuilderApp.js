import {alpha, AppBar, Box, IconButton, InputBase, styled, TextField, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {BorderColor} from "./constants";
import RingsInventory from "./components/RingsInventory";
import RemnantStorageApi from "./storageApi";
import {useState} from "react";
import AmuletsInventory from "./components/AmuletsInventory";
import RelicsInventory from "./components/RelicsInventory";

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

    const [internalLoadouts, setInternalLoadouts] = useState(RemnantStorageApi.getLocalLoadOuts());
    if (internalLoadouts.length === 0) {
        RemnantStorageApi.saveLocalLoadOuts(RemnantStorageApi.generateDefaultLoadOut());
        setInternalLoadouts(RemnantStorageApi.getLocalLoadOuts());
    }
    const [currentLoadoutIndex, setCurrentLoadoutIndex] = useState(internalLoadouts.currentLoadoutIndex);
    const [loadoutName, setLoadoutName] = useState("");

    const saveLoadouts = (index) => {
        if (!index) {
            index = currentLoadoutIndex
        }
        internalLoadouts.currentLoadoutIndex = index;
        RemnantStorageApi.saveLocalLoadOuts(internalLoadouts);
    }

    const getLoadoutSelector = (romanNumeral, index) => {
        const isHighlighted = currentLoadoutIndex === index;
        return (
            <Box
                height={100}
                width={100}
                style={{ cursor: 'pointer', borderColor: BorderColor}}
                onClick={() => {
                    setCurrentLoadoutIndex(index);
                    saveLoadouts(index);
                    setLoadoutName(internalLoadouts.loadouts[index].loadoutName);
                }}
                backgroundColor={isHighlighted ? 'white': 'clear'}
                border={1}
                borderRadius={5}
                padding={"5px"}
                display={'flex'}
                justifyContent={'center'} alignItems={'center'}>
                <Typography variant={'h2'} color={isHighlighted ? 'black' : 'white'}>
                    {romanNumeral}
                </Typography>
            </Box>
        )

    }

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
                <Box marginLeft={"5%"}>
                    <Typography fontFamily={'Poppins'} variant={'h4'}>Loadout</Typography>
                </Box>
                <Box display={'flex'} justifyContent={'center'}>
                    <TextField
                        value={loadoutName}
                        defaultValue={internalLoadouts.loadouts[currentLoadoutIndex].loadoutName}
                        label={"Loadout Name"}
                        onChange={(e) => {
                            setLoadoutName(e.target.value);
                            internalLoadouts.loadouts[currentLoadoutIndex].loadoutName = e.target.value;
                        }}
                    >

                    </TextField>
                </Box>
                <Box display={'flex'} margin={'25px'} gap={"25px"} justifyContent={'center'} flexWrap={'wrap'}>
                    {getLoadoutSelector("I", 0)}
                    {getLoadoutSelector("II", 1)}
                    {getLoadoutSelector("III", 2)}
                    {getLoadoutSelector("IV", 3)}
                    {getLoadoutSelector("V", 4)}
                </Box>

                <RingsInventory loadouts={internalLoadouts} currentLoadoutIndex={currentLoadoutIndex}
                                saveLoadouts={saveLoadouts}/>
                <AmuletsInventory loadouts={internalLoadouts} currentLoadoutIndex={currentLoadoutIndex}
                                  saveLoadouts={saveLoadouts}/>
                <RelicsInventory loadouts={internalLoadouts} currentLoadoutIndex={currentLoadoutIndex}
                                  saveLoadouts={saveLoadouts}/>

            </Box>
        </ThemeProvider>

    );
}

export default RemnantBuilderApp;
