import {
    AppBar,
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
    MenuItem, Select,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {BorderColor} from "./constants";
import RingsInventory from "./components/RingsInventory";
import RemnantStorageApi from "./storageApi";
import {useState} from "react";
import AmuletsInventory from "./components/AmuletsInventory";
import RelicsInventory from "./components/RelicsInventory";
import {UploadFile} from "@mui/icons-material";
import {useFilePicker} from 'use-file-picker';
import {exportBuildFile} from "./utilFunctions";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter1Icon from '@mui/icons-material/Filter1';
import DeleteIcon from '@mui/icons-material/Delete';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function RemnantBuilderApp() {

    const [openFileSelector,] = useFilePicker({
        accept: '.json',
        multiple: 'false',
        onFilesRejected: data => {
            toast.error("Not a valid build file.")
        },
        onFilesSuccessfulySelected: ({plainFiles, filesContent}) => {
            if (!filesContent) {
                toast.error("No file content found.");
                return;
            }
            let buildData = null;
            try {
                buildData = JSON.parse(filesContent[0].content);
            } catch (e) {
                toast.error("Not a valid build file.");
                return;
            }

            if (!buildData.buildType) {
                toast.error("No build type found.");
                return;
            }

            if (buildData.buildType === "single") {


            } else {
                if (!buildData.loadouts) {
                    toast.error("Expected build data to have loadouts key, but did not.")
                    return;
                }

                if (!Array.isArray(buildData.loadouts)) {
                    toast.error("Expected build data loadouts to be of type Array, but was not.");
                    return;
                }

                if (buildData.loadouts.length !== 5) {
                    toast.error("Expected build data loadouts length to be 5, but was not.");
                    return;
                }
            }
            setImportedBuildType(buildData.buildType);
            setImportedBuildData(buildData);
            setBuildPreviewOpen(true);
        }
    });
    const [buildPreviewOpen, setBuildPreviewOpen] = useState(false);
    const [importedBuildData, setImportedBuildData] = useState({});
    const [importedBuildType, setImportedBuildType] = useState("single");
    const [exportSingleBuildOpen, setExportSingleBuildOpen] = useState(false);
    const [internalLoadouts, setInternalLoadouts] = useState(RemnantStorageApi.getLocalLoadOuts());
    const [selectedBuild, setSelectedBuild] = useState(internalLoadouts.loadouts[0]);
    const [currentLoadoutIndex, setCurrentLoadoutIndex] = useState(internalLoadouts.currentLoadoutIndex);
    const [loadoutName, setLoadoutName] = useState("");

    const overwriteBuild = (buildData) => {
        delete buildData.buildType;
        const index = internalLoadouts.loadouts.indexOf(selectedBuild);
        internalLoadouts.loadouts[index] = buildData;
        delete buildData.selectedIndex;
        saveLoadouts();
    }

    const importFullBuild = (data) => {
        RemnantStorageApi.saveLocalLoadOuts(data);
        const l = RemnantStorageApi.getLocalLoadOuts();
        setInternalLoadouts(l);
        setSelectedBuild(l.loadouts[0]);
    }

    const saveLoadouts = (index) => {
        if (!index) {
            index = currentLoadoutIndex;
        }
        internalLoadouts.currentLoadoutIndex = index;
        RemnantStorageApi.saveLocalLoadOuts(internalLoadouts);
        setInternalLoadouts(RemnantStorageApi.getLocalLoadOuts());
    }

    const getLoadoutSelector = (romanNumeral, index) => {
        const isHighlighted = currentLoadoutIndex === index;
        return (
            <Box
                height={100}
                width={100}
                style={{cursor: 'pointer', borderColor: BorderColor}}
                onClick={() => {
                    setCurrentLoadoutIndex(index);
                    saveLoadouts(index);
                    setLoadoutName(internalLoadouts.loadouts[index].loadoutName);
                }}
                backgroundColor={isHighlighted ? 'white' : 'clear'}
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
                        <IconButton variant={'outlined'} onClick={() => openFileSelector()}>
                            <Tooltip title={"Import Build File"}>
                                <UploadFile/>
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => {
                            exportBuildFile(internalLoadouts, "full");
                        }}>
                            <Tooltip title={"Export Full Build File"}>
                                <Filter5Icon/>
                            </Tooltip>
                        </IconButton>

                        <IconButton onClick={() => {
                            setExportSingleBuildOpen(true);
                        }}>
                            <Tooltip title={"Export Single Build"}>
                                <Filter1Icon/>
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => {
                            RemnantStorageApi.clearStorage();
                            const l = RemnantStorageApi.getLocalLoadOuts();
                            setInternalLoadouts(l);
                            setSelectedBuild(l.loadouts[0]);
                        }}>
                            <Tooltip title={"Remove all builds"}>
                                <DeleteIcon style={{color: 'red'}}/>
                            </Tooltip>
                        </IconButton>

                    </Toolbar>
                </AppBar>
                <Box marginLeft={"5%"}>
                    <Typography fontFamily={'Poppins'} variant={'h4'}>Loadout</Typography>
                </Box>
                <Box display={'flex'} justifyContent={'center'}>
                    <TextField
                        value={loadoutName}
                        label={"Loadout Name"}
                        onChange={(e) => {
                            setLoadoutName(e.target.value);
                            internalLoadouts.loadouts[currentLoadoutIndex].loadoutName = e.target.value;
                            saveLoadouts();
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
                <ToastContainer/>

                <RingsInventory loadouts={internalLoadouts} currentLoadoutIndex={currentLoadoutIndex}
                                saveLoadouts={saveLoadouts}/>
                <AmuletsInventory loadouts={internalLoadouts} currentLoadoutIndex={currentLoadoutIndex}
                                  saveLoadouts={saveLoadouts}/>
                <RelicsInventory loadouts={internalLoadouts} currentLoadoutIndex={currentLoadoutIndex}
                                 saveLoadouts={saveLoadouts}/>

                <Dialog open={buildPreviewOpen} onClose={(event, reason) => {
                    setBuildPreviewOpen(false);
                }} fullWidth={true} maxWidth={'xl'}>
                    <DialogTitle>
                        Import {importedBuildType} build
                    </DialogTitle>
                    <DialogContent>
                        {importedBuildType === 'single' ?
                            <Box>
                                <Typography>
                                    Choose which build to overwrite
                                </Typography>
                                <Select
                                    fullWidth
                                    value={selectedBuild}
                                    label={"Select Build to Overwrite"}
                                    onChange={(e) => setSelectedBuild(e.target.value)}
                                >
                                    {internalLoadouts.loadouts.map((l, index) => {
                                        return (
                                            <MenuItem value={l}>
                                                Build {index + 1}, {l.loadoutName === "" ? "No Loadout Name" : l.loadoutName}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                                <DialogActions>
                                    <Button variant={'contained'} onClick={() => {
                                        overwriteBuild(importedBuildData);
                                        setBuildPreviewOpen(false);
                                        const l = RemnantStorageApi.getLocalLoadOuts();
                                        setSelectedBuild(l.loadouts[0]);
                                        toast.success(`Successfully imported build!`);
                                    }}>
                                        Import
                                    </Button>
                                    <Button variant={'contained'} onClick={() => {
                                        setBuildPreviewOpen(false);
                                    }}>
                                        Close
                                    </Button>
                                </DialogActions>

                            </Box> :
                            <Box>
                                <Typography>
                                    Clicking "Import" will overwrite all of your builds. Continue?
                                </Typography>
                                <DialogActions>
                                    <Button onClick={() => {
                                        importFullBuild(importedBuildData);
                                        toast.success("Successfully imported all builds.");
                                        setBuildPreviewOpen(false);
                                        setImportedBuildData({});
                                    }}>
                                        Import
                                    </Button>
                                    <Button>

                                    </Button>
                                </DialogActions>

                            </Box>
                        }

                    </DialogContent>


                </Dialog>

                <Dialog fullWidth={true} maxWidth={'xl'} open={exportSingleBuildOpen} onClose={(event, reason) => {
                    setExportSingleBuildOpen(false);
                }}>
                    <DialogTitle>
                        Export Single Build
                    </DialogTitle>
                    <DialogContent>
                        <Select
                            label={"Select Build"}
                            fullWidth={true} value={selectedBuild} onChange={(e) => setSelectedBuild(e.target.value)}>
                            {internalLoadouts.loadouts.map((l, index) => {
                                return (
                                    <MenuItem value={l}>
                                        Build {index + 1}, {l.loadoutName === "" ? "No Loadout Name" : l.loadoutName}
                                    </MenuItem>
                                )
                            })}


                        </Select>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            exportBuildFile(selectedBuild, 'single');
                            setExportSingleBuildOpen(false);
                        }}>
                            Export
                        </Button>
                        <Button onClick={() => {
                            setExportSingleBuildOpen(false);
                        }} color={'primary'} variant={'contained'}>
                            Close
                        </Button>
                    </DialogActions>

                </Dialog>
            </Box>
        </ThemeProvider>

    );
}

export default RemnantBuilderApp;
