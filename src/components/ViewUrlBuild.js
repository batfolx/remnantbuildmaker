import {useLocation, useParams, useNavigate} from "react-router-dom";
import ReactGA from "react-ga4";
import {useEffect, useState} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import RemnantBuildWebApi from "../buildWebApi";
import {BorderColor, sendAmuletSearchEvent} from "../constants";
import {highlightText} from "../utilFunctions";

export default function ViewUrlBuild() {

    const [loadoutData, setLoadoutData] = useState(null);
    const [fetchingLoadout, setFetchingLoadout] = useState(true);
    const location = useLocation();
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

    const getLoadoutItem = (item, itemType) => {
        return (
            <Box style={{
                borderColor: BorderColor,
                boxShadow: '2px 2px 4px rgba(150, 150, 150, 0.1)',
                transition: 'box-shadow 0.2s'
            }}
                 sx={{
                     ':hover': {
                         boxShadow: 20
                     }
                 }}
                 maxHeight={500} padding={"10px"}
                 border={2}
                 borderRadius={3}
                 maxWidth={250}
                 justifyContent={'center'}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{item.itemName}</Typography>
                    <Typography color={'orange'}>{itemType}</Typography>
                    <img alt={item.itemImageLinkFullPath} src={item.itemImageLinkFullPath}
                         style={{width: 150, height: 150}}/>
                </Box>
                {highlightText(item.itemDescription)}
            </Box>
        );
    }



    return (
        <Box>
            <ToastContainer/>
            {fetchingLoadout && <Box marginTop={"5%"} display={'flex'} justifyContent={'center'}><CircularProgress/></Box>}
            {loadoutData !== null && (
                <Box>
                    {getLoadoutItem(loadoutData.amulet)}
                    {getLoadoutItem(loadoutData.relic)}
                    {loadoutData.rings.map((ring) => getLoadoutItem(ring, "Ring"))}
                    {getLoadoutItem(loadoutData.longGun)}
                    {getLoadoutItem(loadoutData.handGun)}

                </Box>
            )}


        </Box>
    )
}
