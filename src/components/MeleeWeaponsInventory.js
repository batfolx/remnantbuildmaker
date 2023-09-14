import {useState} from "react";
import meleeWeaponsJson from "../data/MeleeWeapons.json";
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
import {BorderColor, sendMeleeSearchEvent, sendMutatorSearchEvent} from "../constants";
import {getHeaderComponent, getOptionLabel, highlightText} from "../utilFunctions";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import weaponModsJson from "../data/WeaponMods.json";
import mutators from "../data/Mutators.json";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../reducers/loadoutReducer";

export default function MeleeWeaponsInventory() {
    const loadouts = useSelector((state) => state.loadouts);
    const dispatch = useDispatch();
    const [openMeleeWeaponSearch, setOpenMeleeWeaponSearch] = useState(false);
    const [searchedValue, setSearchedValue] = useState(null);
    const [searchedMeleeWeapons, setSearchedMeleeWeapons] = useState(meleeWeaponsJson);

    const meleeMutators = mutators.filter((mutator) => mutator.itemDescription.toLowerCase().includes("melee"));


    const [openMutatorModSearch, setOpenMutatorModSearch] = useState(false);
    const [searchedMutatorValue, setSearchedMutatorValue] = useState(null);
    const [mutatorSearchResults, setMutatorSearchResults] = useState(meleeMutators);

    const getMeleeWeaponSlot = () => {
        const currentMeleeWeapon = loadouts.loadouts[loadouts.currentLoadoutIndex].meleeWeapon;
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
                     sendMeleeSearchEvent();
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

                const longGunIsSelected = loadouts.loadouts[loadouts.currentLoadoutIndex].meleeWeapon.itemId === meleeWeapon.itemId;

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
                        console.log("Melee Weapon", meleeWeapon);

                        if (meleeWeapon.isSpecialWeapon) {
                            const weaponModName = meleeWeapon.lockedModInfo.modName;
                            const filteredWeaponMod = weaponModsJson.filter((weaponMod) => weaponMod.itemName === weaponModName);
                            if (!filteredWeaponMod || filteredWeaponMod.length === 0) {
                                dispatch(actions.setMeleeWeaponMod({itemName: ""}));
                            } else {
                                dispatch(actions.setMeleeWeaponMod(filteredWeaponMod[0]));
                            }

                        } else {
                            dispatch(actions.setMeleeWeaponMod({itemName: ""}));
                        }
                        dispatch(actions.setMeleeWeapon(meleeWeapon));
                        setOpenMeleeWeaponSearch(false);
                        setSearchedValue(null);
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

    const getWeaponModSlotComponent = () => {
        const currentWeaponMod = loadouts.loadouts[loadouts.currentLoadoutIndex].meleeWeaponMod;
        if (currentWeaponMod.itemName === "") {
            return <Box/>
        }
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
                 padding={"10px"}
                 border={2}
                 borderRadius={3}
                 maxWidth={350}
                 justifyContent={'center'}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{currentWeaponMod.itemName}</Typography>
                    <Typography color={'orange'}>Weapon Mod</Typography>
                    <img alt={currentWeaponMod.itemImageLinkFullPath} src={currentWeaponMod.itemImageLinkFullPath}
                         style={{width: 200, height: 200}}/>
                </Box>
                {highlightText(currentWeaponMod.itemDescription)}
            </Box>
        );
    }


    const getMutatorSlotComponent = () => {
        const currentMutator = loadouts.loadouts[loadouts.currentLoadoutIndex].meleeMutator;
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
                 padding={"10px"}
                 border={2}
                 borderRadius={3}
                 maxWidth={350}
                 justifyContent={'center'}
                 onClick={() => {
                     sendMutatorSearchEvent();
                     setOpenMutatorModSearch(true);
                 }}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{currentMutator.itemName}</Typography>
                    <Typography color={'orange'}>Mutator</Typography>
                    <img alt={currentMutator.itemImageLinkFullPath} src={currentMutator.itemImageLinkFullPath}
                         style={{width: 200, height: 200}}/>
                </Box>
                {highlightText(currentMutator.itemDescription)}
            </Box>
        );
    }

    const displaySearchedMutators = () => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {mutatorSearchResults.map((mutator, index) => {
                if (mutator.itemName === "") {
                    return <Box key={index}/>
                }
                const mutatorIsSelected = loadouts.loadouts[loadouts.currentLoadoutIndex].meleeMutator.itemId === mutator.itemId;
                return <Box
                    key={mutator.itemName + index}
                    style={{
                        borderColor: BorderColor,
                        cursor: "pointer",
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'box-shadow 0.2s'
                    }}
                    padding={"10px"}
                    onClick={() => {
                        if (mutatorIsSelected) {
                            return;
                        }
                        dispatch(actions.setLoadoutMeleeMutator(mutator));
                        setOpenMutatorModSearch(false);
                        setSearchedMutatorValue(null);
                    }}
                    border={2}
                    borderRadius={3}
                    width={350}
                    justifyContent={'center'}>
                    <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <Typography textAlign={'center'} variant={'h5'}>{mutator.itemName}</Typography>
                        <Typography color={'orange'}>Weapon Mods</Typography>
                        <img alt={mutator.itemImageLinkFullPath} src={mutator.itemImageLinkFullPath}
                             style={{width: 250, height: 250}}/>
                    </Box>
                    {highlightText(mutator.itemDescription)}
                    {mutatorIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}
                </Box>
            })}
        </Box>
    }

    return (
        <Box>
            {getHeaderComponent("Melee Weapons")}
            <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={'10px'}>
                {getMeleeWeaponSlot()}
                {getWeaponModSlotComponent()}
                {getMutatorSlotComponent()}
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


            <Dialog
                PaperProps={{
                    sx: {
                        height: "100%",
                    }
                }}
                fullWidth={true}
                maxWidth={'xl'}
                open={openMutatorModSearch} onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return false;
                }
                setOpenMutatorModSearch(false);
            }}>
                <DialogActions>
                    <Autocomplete
                        fullWidth={true}
                        getOptionLabel={(option) => getOptionLabel(option)}
                        value={searchedMutatorValue}
                        renderInput={(params) => <TextField {...params} label="Search Mutators" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedMutatorValue(newValue);
                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = meleeMutators.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setMutatorSearchResults(filteredOptions);
                            setSearchedMutatorValue(newValue);
                        }}
                        options={meleeMutators}/>
                    <IconButton onClick={() => setOpenMutatorModSearch(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    {displaySearchedMutators()}
                </DialogContent>
            </Dialog>

        </Box>
    )

}
