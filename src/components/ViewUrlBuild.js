import {useLocation, useParams, useNavigate} from "react-router-dom";
import ReactGA from "react-ga4";
import {useEffect, useState} from "react";
import {AppBar, Box, CircularProgress, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
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
export default function ViewUrlBuild() {

    const [loadoutData, setLoadoutData] = useState(null);
    const [fetchingLoadout, setFetchingLoadout] = useState(true);
    const {buildId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBuildLoadout();
    }, [])


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
        } finally {
            setFetchingLoadout(false);
        }
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


        </Box>
    )
}
