import {useState} from "react";
import longGunsJson from "../items/LongGuns.json";
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
export default function LongGunsInventory({loadouts, currentLoadoutIndex, saveLoadouts}) {

    let loadout = loadouts.loadouts[currentLoadoutIndex];
    const [openLongGunSearch, setOpenLongGunSearch] = useState(false);
    const [searchedValue, setSearchedValue] = useState(null);
    const [searchedLongGuns, setSearchedLongGuns] = useState(longGunsJson);

    const getLongGunSlotComponent = () => {
        const currentLongGun = loadout.longGun;
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
                     setOpenLongGunSearch(true);
                 }}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{currentLongGun.itemName}</Typography>
                    <Typography color={'orange'}>Long Gun</Typography>
                    <img alt={currentLongGun.itemImageLinkFullPath} src={currentLongGun.itemImageLinkFullPath}
                         style={{width: 350, height: 150}}/>
                </Box>
                {highlightText(currentLongGun.itemDescription)}
            </Box>
        );
    }

    const displaySearchedLongGuns = ()  => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {searchedLongGuns.map((longGun, index) => {
                if (longGun.itemName === "") {
                    return <Box key={index}/>
                }

                const longGunIsSelected = loadout.longGun.itemId === longGun.itemId;

                return <Box
                    key={longGun.itemName + index}
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
                        loadout.longGun = longGun;
                        setOpenLongGunSearch(false);
                        setSearchedValue(null);
                        saveLoadouts();
                    }}
                    border={2}
                    borderRadius={3}
                    width={350}
                    justifyContent={'center'}>
                    <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <Typography textAlign={'center'} variant={'h5'}>{longGun.itemName}</Typography>
                        <Typography color={'orange'}>Long Guns</Typography>
                        <img alt={longGun.itemImageLinkFullPath} src={longGun.itemImageLinkFullPath}
                             style={{width: 350, height: 150}}/>
                    </Box>
                    {highlightText(longGun.itemDescription)}
                    {longGunIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}

                </Box>
            })}
        </Box>
    }

    return (
        <Box>
            <Box marginLeft={"5%"} marginTop={'25px'}>
                <Typography variant={"h4"} fontFamily={'Poppins'}>
                    Long Guns
                </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'center'}>
                {getLongGunSlotComponent()}
            </Box>

            <Dialog
                PaperProps={{
                    sx: {
                        height: "100%",
                    }
                }}
                fullWidth={true}
                maxWidth={'xl'}
                open={openLongGunSearch} onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return false;
                }
                setOpenLongGunSearch(false);
            }}>
                <DialogActions>
                    <Autocomplete
                        fullWidth={true}
                        getOptionLabel={(option) => getOptionLabel(option)}
                        value={searchedValue}
                        renderInput={(params) => <TextField {...params} label="Search Long Guns" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedValue(newValue);
                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = longGunsJson.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setSearchedLongGuns(filteredOptions);
                            setSearchedValue(newValue);
                        }}
                        options={longGunsJson}/>
                    <IconButton onClick={() => setOpenLongGunSearch(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    {displaySearchedLongGuns()}
                </DialogContent>

            </Dialog>

        </Box>
    )

}
