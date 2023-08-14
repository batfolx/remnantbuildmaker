import {
    Box,
    Typography,
    Dialog,
    DialogActions,
    Autocomplete,
    TextField,
    IconButton,
    DialogContent
} from "@mui/material";
import amuletsItemsJson from "../items/Amulets.json";
import { BorderColor, sendAmuletSearchEvent} from "../constants";
import {getOptionLabel, highlightText} from "../utilFunctions";
import {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";

export default function AmuletsInventory({loadouts, currentLoadoutIndex, saveLoadouts}) {

    let loadout = loadouts.loadouts[currentLoadoutIndex];
    const [openAmuletSearch, setOpenAmuletSearch] = useState(false);
    const [searchedValue, setSearchedValue] = useState(null);
    const [searchedAmulets, setSearchedAmulets] = useState(amuletsItemsJson);

    const getAmuletSlotComponent = () => {
        const currentAmulet = loadout.amulet;
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
                     sendAmuletSearchEvent();
                     setOpenAmuletSearch(true);
                 }}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{currentAmulet.itemName}</Typography>
                    <Typography color={'orange'}>Amulet</Typography>
                    <img alt={currentAmulet.itemImageLinkFullPath} src={currentAmulet.itemImageLinkFullPath}
                         style={{width: 150, height: 150}}/>
                </Box>
                {highlightText(currentAmulet.itemDescription)}
            </Box>
        );
    }

    const displaySearchedAmulets = ()  => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {searchedAmulets.map((amulet, index) => {
                if (amulet.itemName === "") {
                    return <Box key={index}/>
                }

                const amuletIsSelected = loadout.amulet.itemId === amulet.itemId;

                return <Box
                    key={amulet.itemName + index}
                    style={{
                        borderColor: BorderColor,
                        cursor: "pointer",
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'box-shadow 0.2s'
                    }}
                    maxHeight={500} padding={"10px"}
                    onClick={() => {
                        if (amuletIsSelected) {
                            return;
                        }
                        loadout.amulet = amulet;
                        setOpenAmuletSearch(false);
                        setSearchedValue(null);
                        saveLoadouts();
                    }}
                    border={2}
                    borderRadius={3}
                    width={250}
                    justifyContent={'center'}>
                    <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <Typography textAlign={'center'} variant={'h5'}>{amulet.itemName}</Typography>
                        <Typography color={'orange'}>{amulet.itemType}</Typography>
                        <img alt={amulet.itemImageLinkFullPath} src={amulet.itemImageLinkFullPath}
                             style={{width: 150, height: 150}}/>
                    </Box>
                    {highlightText(amulet.itemDescription)}
                    {amuletIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}

                </Box>
            })}
        </Box>
    }

    return (
        <Box>
            <Box marginLeft={"5%"} marginTop={'25px'}>
                <Typography variant={"h4"} fontFamily={'Poppins'}>
                    Amulets
                </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'center'}>
                {getAmuletSlotComponent()}
            </Box>

            <Dialog
                PaperProps={{
                    sx: {
                        height: "100%",
                    }
                }}
                fullWidth={true}
                maxWidth={'xl'}
                open={openAmuletSearch} onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return false;
                }
                setOpenAmuletSearch(false);
            }}>
                <DialogActions>
                    <Autocomplete
                        fullWidth={true}
                        getOptionLabel={(option) => getOptionLabel(option)}
                        value={searchedValue}
                        renderInput={(params) => <TextField {...params} label="Search Amulets" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedValue(newValue);
                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = amuletsItemsJson.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setSearchedAmulets(filteredOptions);
                            setSearchedValue(newValue);
                        }}
                        options={amuletsItemsJson}/>
                    <IconButton onClick={() => setOpenAmuletSearch(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    {displaySearchedAmulets()}
                </DialogContent>

            </Dialog>

        </Box>
    )

}
