import {useState} from "react";
import handGunsJson from "../items/Handguns.json";
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
import {BorderColor} from "../constants";
import {getOptionLabel, highlightText} from "../utilFunctions";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";

export default function HandGunsInventory({loadouts, currentLoadoutIndex, saveLoadouts}) {
    let loadout = loadouts.loadouts[currentLoadoutIndex];
    const [openHandGunSearch, setOpenHandGunSearch] = useState(false);
    const [searchedValue, setSearchedValue] = useState(null);
    const [searchedHandGuns, setSearchedHandGuns] = useState(handGunsJson);

    const getHandGunSlotComponent = () => {
        const currentHandGun = loadout.handGun;
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
                 maxWidth={350}
                 justifyContent={'center'}
                 onClick={() => {
                     setOpenHandGunSearch(true);
                 }}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{currentHandGun.itemName}</Typography>
                    <Typography color={'orange'}>Hand Gun</Typography>
                    <img alt={currentHandGun.itemImageLinkFullPath} src={currentHandGun.itemImageLinkFullPath}
                         style={{width: 350, height: 150}}/>
                </Box>
                {highlightText(currentHandGun.itemDescription)}
            </Box>
        );
    }

    const displaySearchedHandGuns = ()  => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {searchedHandGuns.map((handGun, index) => {
                if (handGun.itemName === "") {
                    return <Box key={index}/>
                }

                const longGunIsSelected = loadout.handGun.itemId === handGun.itemId;

                return <Box
                    key={handGun.itemName + index}
                    style={{
                        borderColor: BorderColor,
                        cursor: "pointer",
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'box-shadow 0.2s'
                    }}
                    maxHeight={500} padding={"10px"}
                    onClick={() => {
                        if (longGunIsSelected) {
                            return;
                        }
                        loadout.handGun = handGun;
                        setOpenHandGunSearch(false);
                        setSearchedValue(null);
                        saveLoadouts();
                    }}
                    border={2}
                    borderRadius={3}
                    width={350}
                    justifyContent={'center'}>
                    <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <Typography textAlign={'center'} variant={'h5'}>{handGun.itemName}</Typography>
                        <Typography color={'orange'}>Hand Gun</Typography>
                        <img alt={handGun.itemImageLinkFullPath} src={handGun.itemImageLinkFullPath}
                             style={{width: 350, height: 150}}/>
                    </Box>
                    {highlightText(handGun.itemDescription)}
                    {longGunIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}

                </Box>
            })}
        </Box>
    }

    return (
        <Box>
            <Box marginTop={'25px'}>
                <Typography variant={"h4"} fontFamily={'Poppins'}>
                    Hand Guns
                </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'center'}>
                {getHandGunSlotComponent()}
            </Box>

            <Dialog
                PaperProps={{
                    sx: {
                        height: "100%",
                    }
                }}
                fullWidth={true}
                maxWidth={'xl'}
                open={openHandGunSearch} onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return false;
                }
                setOpenHandGunSearch(false);
            }}>
                <DialogActions>
                    <Autocomplete
                        fullWidth={true}
                        getOptionLabel={(option) => getOptionLabel(option)}
                        value={searchedValue}
                        renderInput={(params) => <TextField {...params} label="Search Hand Guns" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedValue(newValue);
                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = handGunsJson.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setSearchedHandGuns(filteredOptions);
                            setSearchedValue(newValue);
                        }}
                        options={handGunsJson}/>
                    <IconButton onClick={() => setOpenHandGunSearch(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    {displaySearchedHandGuns()}
                </DialogContent>

            </Dialog>

        </Box>
    )

}
