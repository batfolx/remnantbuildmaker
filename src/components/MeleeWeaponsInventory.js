import {useState} from "react";
import meleeWeaponsJson from "../items/MeleeWeapons.json";
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

export default function MeleeWeaponsInventory({loadouts, currentLoadoutIndex, saveLoadouts}) {
    let loadout = loadouts.loadouts[currentLoadoutIndex];
    const [openMeleeWeaponSearch, setOpenMeleeWeaponSearch] = useState(false);
    const [searchedValue, setSearchedValue] = useState(null);
    const [searchedMeleeWeapons, setSearchedMeleeWeapons] = useState(meleeWeaponsJson);

    const getMeleeWeaponSlot = () => {
        const currentMeleeWeapon = loadout.meleeWeapon;
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
                     setOpenMeleeWeaponSearch(true);
                 }}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{currentMeleeWeapon.itemName}</Typography>
                    <Typography color={'orange'}>Melee Weapon</Typography>
                    <img alt={currentMeleeWeapon.itemImageLinkFullPath} src={currentMeleeWeapon.itemImageLinkFullPath}
                         style={{width: 350, height: 150}}/>
                </Box>
                {highlightText(currentMeleeWeapon.itemDescription)}
            </Box>
        );
    }

    const displaySearchedMeleeWeapons = ()  => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {searchedMeleeWeapons.map((meleeWeapon, index) => {
                if (meleeWeapon.itemName === "") {
                    return <Box key={index}/>
                }

                const longGunIsSelected = loadout.meleeWeapon.itemId === meleeWeapon.itemId;

                return <Box
                    key={meleeWeapon.itemName + index}
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
                        loadout.meleeWeapon = meleeWeapon;
                        setOpenMeleeWeaponSearch(false);
                        setSearchedValue(null);
                        saveLoadouts();
                    }}
                    border={2}
                    borderRadius={3}
                    width={350}
                    justifyContent={'center'}>
                    <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <Typography textAlign={'center'} variant={'h5'}>{meleeWeapon.itemName}</Typography>
                        <Typography color={'orange'}>Melee Weapon</Typography>
                        <img alt={meleeWeapon.itemImageLinkFullPath} src={meleeWeapon.itemImageLinkFullPath}
                             style={{width: 350, height: 150}}/>
                    </Box>
                    {highlightText(meleeWeapon.itemDescription)}
                    {longGunIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}

                </Box>
            })}
        </Box>
    }

    return (
        <Box>
            <Box marginTop={'25px'}>
                <Typography variant={"h4"} fontFamily={'Poppins'}>
                    Melee Weapons
                </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'center'}>
                {getMeleeWeaponSlot()}
            </Box>

            <Dialog
                PaperProps={{
                    sx: {
                        height: "100%",
                    }
                }}
                fullWidth={true}
                maxWidth={'xl'}
                open={openMeleeWeaponSearch} onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return false;
                }
                setOpenMeleeWeaponSearch(false);
            }}>
                <DialogActions>
                    <Autocomplete
                        fullWidth={true}
                        getOptionLabel={(option) => getOptionLabel(option)}
                        value={searchedValue}
                        renderInput={(params) => <TextField {...params} label="Search Melee Weapons" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedValue(newValue);
                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = meleeWeaponsJson.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setSearchedMeleeWeapons(filteredOptions);
                            setSearchedValue(newValue);
                        }}
                        options={meleeWeaponsJson}/>
                    <IconButton onClick={() => setOpenMeleeWeaponSearch(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    {displaySearchedMeleeWeapons()}
                </DialogContent>

            </Dialog>

        </Box>
    )

}
