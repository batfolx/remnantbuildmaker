import {useParams, useNavigate} from "react-router-dom";
import ReactGA from "react-ga4";
import {useEffect, useState} from "react";
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    MenuItem, Select
} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import RemnantBuildWebApi from "../buildWebApi";
import {
    getHeaderComponent,
    getMutatorPreviewComponent,
    getNonWeaponPreviewComponent,
    getWeaponPreviewComponent,
} from "../utilFunctions";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from '@mui/icons-material/Home';
import {UploadFile} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../reducers/loadoutReducer";
import {sendImportSingleBuildEvent} from "../constants";
export default function ViewUrlBuild() {

    const dispatch = useDispatch();
    const loadouts = useSelector((state) => state.loadouts);
    const [loadoutData, setLoadoutData] = useState(null);
    const [fetchingLoadout, setFetchingLoadout] = useState(true);
    const [selectedBuild, setSelectedBuild] = useState(loadouts.loadouts[0]);
    const [openImportBuild, setOpenImportBuild] = useState(false);
    const {buildId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBuildLoadout();
    }, [buildId])


    ReactGA.send({ hitType: "pageview", page: `/build/${buildId}`, title: "View Build Page Hit" });

    if (!buildId) {
        navigate("/");
        return;
    }

    const fetchBuildLoadout = async () => {
        setFetchingLoadout(true);
        try {
            const resp = await RemnantBuildWebApi.getBuildById(buildId);
            if (!resp.success) {
                throw new Error(`${resp.message}`);
            }
            setLoadoutData(resp.data);
        } catch (e) {
            toast.error(`Error in fetching build ${e}`);
            navigate("/");
        } finally {
            setFetchingLoadout(false);
        }
    }

    const overwriteBuild = (buildData) => {
        const buildDataCopy = {...buildData};
        delete buildDataCopy.buildType;
        const index = loadouts.loadouts.indexOf(selectedBuild);
        dispatch(actions.overwriteBuild({index: index, buildData: buildDataCopy}));
        sendImportSingleBuildEvent();
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
                    <IconButton onClick={() => {
                        if (!loadoutData) {
                            return;
                        }
                        setOpenImportBuild(true)
                    }}>
                        <Tooltip title={"Import This Build"}>
                            <UploadFile/>
                        </Tooltip>
                    </IconButton>

                    <IconButton onClick={() => {navigate("/")}}>
                        <Tooltip title={"Back to Home"}>
                            <HomeIcon/>
                        </Tooltip>
                    </IconButton>

                    <IconButton onClick={() => window.open("https://remnant2.wiki.fextralife.com/Remnant+2+Wiki", "_blank")}>
                        <Tooltip title={"Go to Remnant 2 Wiki"}>
                            <ExitToAppIcon/>
                        </Tooltip>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <ToastContainer/>
            {fetchingLoadout && <Box marginTop={"5%"} display={'flex'} justifyContent={'center'}><CircularProgress/></Box>}
            {loadoutData !== null && (
                <Box marginTop={"25px"}>
                    {loadoutData.rings && <Box display={'flex'} flexDirection={'column'}>
                        {getHeaderComponent("Rings")}
                        <Box display={'flex'} justifyContent={'center'} gap={'15px'} flexWrap={'wrap'}>
                            {loadoutData.rings.map((ring) => getNonWeaponPreviewComponent(ring, "Ring"))}
                        </Box>

                    </Box>}

                    {getHeaderComponent("Amulet")}
                    {loadoutData.amulet && <Box display={'flex'} justifyContent={'center'} marginTop={'25px'}>

                        {getNonWeaponPreviewComponent(loadoutData.amulet, "Amulet")}
                    </Box>}

                    {getHeaderComponent("Relic")}
                    {loadoutData.relic && <Box display={'flex'} justifyContent={'center'}>
                        {getNonWeaponPreviewComponent(loadoutData.relic, "Relic")}
                    </Box>}

                    <Box display={'flex'} justifyContent={'space-around'} flexWrap={'wrap'} alignItems={'start'} marginTop={'25px'}>

                        {loadoutData.longGun && <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={'10px'} >
                            {getHeaderComponent("Long Gun")}
                            {getWeaponPreviewComponent(loadoutData.longGun, "Long Gun")}
                            {getWeaponPreviewComponent(loadoutData.weaponMod, "Weapon Mod")}
                            {getMutatorPreviewComponent(loadoutData.longGunMutator, "Mutator")}
                        </Box>}

                        {loadoutData.handGun && <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={'10px'}>
                            {getHeaderComponent("Hand Gun")}
                            {getWeaponPreviewComponent(loadoutData.handGun, "Hand Gun")}
                            {getWeaponPreviewComponent(loadoutData.handGunWeaponMod, "Weapon Mod")}
                            {getMutatorPreviewComponent(loadoutData.handGunMutator, "Mutator")}
                        </Box>}

                        {loadoutData.meleeWeapon && <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={'10px'}>
                            {getHeaderComponent("Melee Weapon")}
                            {getWeaponPreviewComponent(loadoutData.meleeWeapon, "Hand Gun")}
                            {getWeaponPreviewComponent(loadoutData.meleeWeaponMod, "Weapon Mod")}
                            {getMutatorPreviewComponent(loadoutData.meleeMutator, "Mutator")}
                        </Box>}
                    </Box>

                </Box>
            )}

            <Dialog open={openImportBuild} fullWidth maxWidth={'xl'} onClose={(event, reason) => {setOpenImportBuild(false)}}>
                <DialogTitle>
                    Import this build
                </DialogTitle>
                <DialogContent>
                    <Select fullWidth value={selectedBuild} onChange={e => setSelectedBuild(e.target.value)}>
                        {loadouts.loadouts.map((loadout, index) => {
                            return (<MenuItem key={index + loadout.loadoutName} value={loadout}>
                                Build {index + 1}, {loadout.loadoutName === "" ? "No Loadout Name" : loadout.loadoutName}
                                </MenuItem>)
                        })}
                    </Select>
                    <DialogActions>

                        <Button variant={'contained'} onClick={() => {
                            overwriteBuild(loadoutData)
                            toast.success("Successfully imported build!");
                            setOpenImportBuild(false);
                        }}>
                            Import
                        </Button>

                        <Button variant={'contained'} color={'primary'} onClick={() => setOpenImportBuild(false)}>
                            Close
                        </Button>


                    </DialogActions>


                </DialogContent>

            </Dialog>


        </Box>
    )
}
