import {useState} from "react";
import relicsItemsJson from "../items/Relics.json";
import {
    Autocomplete,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import {BorderColor, sendRelicSearchEvent} from "../constants";
import {getHeaderComponent, getOptionLabel, highlightText} from "../utilFunctions";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../reducers/loadoutReducer";

export default function RelicsInventory() {

    const loadouts = useSelector((state) => state.loadouts);
    const dispatch = useDispatch();
    const [openRelicSearch, setOpenRelicSearch] = useState(false);
    const [searchedValue, setSearchedValue] = useState(null);
    const [searchedRelics, setSearchedRelics] = useState(relicsItemsJson);

    const getRelicSlotComponent = () => {
        const currentRelic = loadouts.loadouts[loadouts.currentLoadoutIndex].relic;
        return (
            <Box style={{
                borderColor: BorderColor,
                cursor: "pointer",
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
                 onClick={() => {
                     sendRelicSearchEvent();
                     setOpenRelicSearch(true);
                 }}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{currentRelic.itemName}</Typography>
                    <Typography color={'orange'}>Relic</Typography>
                    <img alt={currentRelic.itemImageLinkFullPath} src={currentRelic.itemImageLinkFullPath}
                         style={{width: 150, height: 150}}/>
                </Box>
                {highlightText(currentRelic.itemDescription)}
            </Box>
        );
    }

    const displaySearchedRelics = ()  => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {searchedRelics.map((relic, index) => {
                if (relic.itemName === "") {
                    return <Box key={index}/>
                }

                const relicIsSelected = loadouts.loadouts[loadouts.currentLoadoutIndex].relic.itemId === relic.itemId;

                return <Box
                    key={relic.itemName + index}
                    style={{
                        borderColor: BorderColor,
                        cursor: "pointer",
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'box-shadow 0.2s'
                    }}
                    maxHeight={500} padding={"10px"}
                    onClick={() => {
                        if (relicIsSelected) {
                            return;
                        }
                        dispatch(actions.setLoadoutRelic(relic));
                        setOpenRelicSearch(false);
                        setSearchedValue(null);
                    }}
                    border={2}
                    borderRadius={3}
                    width={250}
                    justifyContent={'center'}>
                    <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <Typography textAlign={'center'} variant={'h5'}>{relic.itemName}</Typography>
                        <Typography color={'orange'}>{relic.itemType}</Typography>
                        <img alt={relic.itemImageLinkFullPath} src={relic.itemImageLinkFullPath}
                             style={{width: 150, height: 150}}/>
                    </Box>
                    {highlightText(relic.itemDescription)}
                    {relicIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}

                </Box>
            })}
        </Box>
    }

    return (
        <Box>
            {getHeaderComponent("Relics")}
            <Box display={'flex'} justifyContent={'center'}>
                {getRelicSlotComponent()}
            </Box>

            <Dialog
                PaperProps={{
                    sx: {
                        height: "100%",
                    }
                }}
                fullWidth={true}
                maxWidth={'xl'}
                open={openRelicSearch} onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return false;
                }
                setOpenRelicSearch(false);
            }}>
                <DialogActions>
                    <Autocomplete
                        fullWidth={true}
                        getOptionLabel={(option) => getOptionLabel(option)}
                        value={searchedValue}
                        renderInput={(params) => <TextField {...params} label="Search Relics" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedValue(newValue);
                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = relicsItemsJson.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setSearchedRelics(filteredOptions);
                            setSearchedValue(newValue);
                        }}
                        options={relicsItemsJson}/>
                    <IconButton onClick={() => setOpenRelicSearch(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    {displaySearchedRelics()}
                </DialogContent>

            </Dialog>

        </Box>
    )

}
