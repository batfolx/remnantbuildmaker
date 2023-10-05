import {
    AppBar,
    Box,
    Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
    MenuItem, Select,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {
    BorderColor,
    sendImportFullBuildEvent, sendImportSingleBuildEvent, REPO_NAME, sendShareUrlBuildEvent
} from "./constants";
import RingsInventory from "./components/RingsInventory";
import AmuletsInventory from "./components/AmuletsInventory";
import RelicsInventory from "./components/RelicsInventory";
import LongGunsInventory from "./components/LongGunsInventory";
import HandGunsInventory from "./components/HandGunsInventory";
import MeleeWeaponsInventory from "./components/MeleeWeaponsInventory";
import ArchetypesInventory from "./components/ArchetypesInventory";
import RemnantStorageApi from "./storageApi";
import {useState} from "react";
import {UploadFile} from "@mui/icons-material";
import {useFilePicker} from 'use-file-picker';
import {exportBuildFile, isProduction} from "./utilFunctions";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter1Icon from '@mui/icons-material/Filter1';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ReactGA from "react-ga4";
import RemnantBuildWebApi from "./buildWebApi";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {useDispatch, useSelector} from "react-redux";
import {actions, saveLoadouts} from "./reducers/loadoutReducer";

function RemnantBuilderApp() {

    const loadouts = useSelector(state => state.loadouts);
    const dispatch = useDispatch();
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

                if (buildData.loadouts.length !== RemnantStorageApi.MAX_LOADOUTS) {
                    toast.error(`Expected build data loadouts length to be ${RemnantStorageApi.MAX_LOADOUTS}, but was not.`);
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
    const [selectedBuild, setSelectedBuild] = useState(loadouts.loadouts[0]);
    const [shareBuildOpen, setShareBuildOpen] = useState(false);
    const [sharedBuildUrl, setSharedBuildUrl] = useState("");
    const [shareBuildLoading, setShareBuildLoading] = useState(false);
    ReactGA.send({ hitType: "pageview", page: "/", title: "Main Page Hit" });

    const overwriteBuild = (buildData) => {
        const buildDataCopy = {...buildData};
        delete buildDataCopy.buildType;
        const index = loadouts.loadouts.indexOf(selectedBuild);
        dispatch(actions.overwriteBuild({index: index, buildData: buildDataCopy}));
        sendImportSingleBuildEvent();
    }

    const importFullBuild = (data) => {
        data.currentLoadoutIndex = 0;
        RemnantStorageApi.saveLocalLoadOuts(data);
        dispatch(actions.saveLoadouts(data));
        setSelectedBuild(loadouts.loadouts[0]);
        sendImportFullBuildEvent();
    }

    const getLoadoutSelector = (romanNumeral, index) => {
        const isHighlighted = loadouts.currentLoadoutIndex === index;
        return (
            <Box
                height={100}
                width={100}
                style={{cursor: 'pointer', borderColor: BorderColor}}
                onClick={() => {
                    dispatch(actions.setCurrentLoadOutIndex(index));
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

            <Box>
                <AppBar position={'static'}>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                        >
                            Remnant Builder
                        </Typography>
                        <IconButton onClick={() => window.open("https://remnant2.wiki.fextralife.com/Remnant+2+Wiki", "_blank")}>
                            <Tooltip title={"Go to Remnant 2 Wiki"}>
                                <ExitToAppIcon/>
                            </Tooltip>
                        </IconButton>
                        {<IconButton onClick={() => setShareBuildOpen(true)}>
                            <Tooltip title={"Generate Build URL"}>
                                <ShareIcon/>
                            </Tooltip>
                        </IconButton>}
                        <IconButton variant={'outlined'} onClick={() => openFileSelector()}>
                            <Tooltip title={"Import Build File"}>
                                <UploadFile/>
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => {
                            exportBuildFile(loadouts, "full");
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
                            saveLoadouts(l);
                            dispatch(actions.reset());
                            setSelectedBuild(l.loadouts[0]);
                            toast.success("Successfully reset all builds!");
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
                        value={loadouts.loadouts[loadouts.currentLoadoutIndex].loadoutName}
                        label={"Loadout Name"}
                        onChange={(e) => {
                            dispatch(actions.setLoadoutName(e.target.value));
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
                    {getLoadoutSelector("VI", 5)}
                    {getLoadoutSelector("VII", 6)}
                    {getLoadoutSelector("VIII", 7)}
                    {getLoadoutSelector("IX", 8)}
                    {getLoadoutSelector("X", 9)}
                </Box>
                <ToastContainer/>

                <ArchetypesInventory />
                <RingsInventory />
                <AmuletsInventory />
                <RelicsInventory />
                <Box display={'flex'} flexWrap={'wrap'} justifyContent={'space-around'} alignContent={'start'}>
                    <LongGunsInventory />
                    <HandGunsInventory />
                    <MeleeWeaponsInventory/>
                </Box>


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
                                    {loadouts.loadouts.map((l, index) => {
                                        return (
                                            <MenuItem key={index + l.loadoutName} value={l}>
                                                Build {index + 1}, {l.loadoutName === "" ? "No Loadout Name" : l.loadoutName}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                                <DialogActions>
                                    <Button variant={'contained'} onClick={() => {
                                        overwriteBuild(importedBuildData);
                                        setBuildPreviewOpen(false);
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
                                    <Button variant={'contained'} onClick={() => {
                                        setBuildPreviewOpen(false);
                                        setImportedBuildData({});
                                    }}>
                                        Close

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
                            fullWidth={true}
                            value={selectedBuild}
                            onChange={(e) => setSelectedBuild(e.target.value)}>
                            {loadouts.loadouts.map((l, index) => {
                                return (
                                    <MenuItem key={index} value={l}>
                                        Build {index + 1}, {l.loadoutName === "" ? "No Loadout Name" : l.loadoutName}
                                    </MenuItem>
                                )
                            })}


                        </Select>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            exportBuildFile(selectedBuild, 'single');
                            setSelectedBuild(loadouts.loadouts[0]);
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


                <Dialog fullWidth={true} maxWidth={'xl'} open={shareBuildOpen} onClose={(event, reason) => {
                    setShareBuildOpen(false);
                }}>
                    <DialogTitle>
                        Share Build
                    </DialogTitle>
                    <DialogContent>
                        <Select
                            label={"Select Build to share"}
                            fullWidth={true}
                            value={selectedBuild} onChange={(e) => setSelectedBuild(e.target.value)}>
                            {loadouts.loadouts.map((l, index) => {
                                return (
                                    <MenuItem key={index} value={l}>
                                        Build {index + 1}, {l.loadoutName === "" ? "No Loadout Name" : l.loadoutName}
                                    </MenuItem>
                                )
                            })}
                        </Select>

                        {shareBuildLoading && <CircularProgress/>}
                        {sharedBuildUrl !== "" && <Box marginTop={'25px'}>
                            <Box display={'flex'} justifyContent={"center"} alignItems={"center"} flexWrap={'wrap'}>
                                <Typography variant={'h6'} overflow={'hidden'}>{sharedBuildUrl}</Typography>
                                <IconButton onClick={() => {
                                    navigator.clipboard.writeText(sharedBuildUrl);
                                    toast.success("Copied to clipboard!")
                                }}>
                                    <ContentCopyIcon/>
                                </IconButton>
                            </Box>
                            <Box display={'flex'} justifyContent={"center"}>
                                <Typography>Make sure to copy this URL; it is unique to your build.</Typography>

                            </Box>

                        </Box>}

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={async () => {
                            setShareBuildLoading(true);
                            setSharedBuildUrl("");
                            try {
                                const resp = await RemnantBuildWebApi.uploadBuild(selectedBuild);
                                if (!resp.success) {
                                    throw new Error(resp.message);
                                }
                                const buildId = resp.data.buildId;
                                sendShareUrlBuildEvent(buildId);
                                let generatedLink;
                                if (isProduction) {
                                    generatedLink = `${window.location.origin}/${REPO_NAME}/#/build/${buildId}`;
                                } else {
                                    generatedLink = `${window.location.origin}/#/build/${buildId}`;
                                }

                                setSharedBuildUrl(generatedLink);
                            } catch (e) {
                                toast.error(`Something went wrong with sharing build ${e}`);
                            }
                            setSelectedBuild(loadouts.loadouts[0]);
                            setExportSingleBuildOpen(false);
                            setShareBuildLoading(false);
                        }}>
                            Share
                        </Button>
                        <Button onClick={() => {
                            setShareBuildOpen(false);
                        }} color={'primary'} variant={'contained'}>
                            Close
                        </Button>
                    </DialogActions>

                </Dialog>
            </Box>
    );
}

export default RemnantBuilderApp;
