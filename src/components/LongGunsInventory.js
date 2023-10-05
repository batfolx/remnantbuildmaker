import {useState} from "react";
import longGunsJson from "../data/LongGuns.json";
import weaponModsJson from "../data/WeaponMods.json";
import handGunsJson from "../data/Handguns.json";
import mutators from "../data/Mutators.json";
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
import {
    BorderColor,
    sendLongGunSearchEvent, sendMutatorSearchEvent, sendSearchLongGunWeaponModEvent
} from "../constants";
import {getHeaderComponent, getOptionLabel, highlightText} from "../utilFunctions";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../reducers/loadoutReducer";
export default function LongGunsInventory() {

    const loadouts = useSelector((state) => state.loadouts);
    const dispatch = useDispatch();

    // this line just looks through the hand guns and long guns and find all of the special weapons so that we can
    // filter
    const specialWeapons = [...handGunsJson.filter((handGun) => handGun.isSpecialWeapon).map((handGun) => handGun.lockedModInfo.modName),
        ...longGunsJson.filter((longGun) => longGun.isSpecialWeapon).map((longGun) => longGun.lockedModInfo.modName)];
    const chooseableMods = weaponModsJson.filter((weaponMod) => !specialWeapons.includes(weaponMod.itemName));
    const rangedMutators = mutators.filter((mutator) => !mutator.itemDescription.toLowerCase().includes("melee"));
    const [openLongGunSearch, setOpenLongGunSearch] = useState(false);
    const [searchedLongGunValue, setSearchedLongGunValue] = useState(null);
    const [searchedLongGuns, setSearchedLongGuns] = useState(longGunsJson);

    const [openWeaponModSearch, setOpenWeaponModSearch] = useState(false);
    const [searchedModValue, setSearchedModValue] = useState(null);
    const [modSearchResults, setModSearchResults] = useState(chooseableMods);

    const [openMutatorModSearch, setOpenMutatorModSearch] = useState(false);
    const [searchedMutatorValue, setSearchedMutatorValue] = useState(null);
    const [mutatorSearchResults, setMutatorSearchResults] = useState(rangedMutators);


    const getLongGunSlotComponent = () => {
        const currentLongGun = loadouts.loadouts[loadouts.currentLoadoutIndex].longGun;
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
                     sendLongGunSearchEvent();
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

    const getWeaponModSlotComponent = () => {
        const currentWeaponMod = loadouts.loadouts[loadouts.currentLoadoutIndex].weaponMod;
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
                     if (loadouts.loadouts[loadouts.currentLoadoutIndex].longGun.isSpecialWeapon) {
                         return;
                     }
                     sendSearchLongGunWeaponModEvent();
                     setOpenWeaponModSearch(true);
                 }}
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
        const currentMutator = loadouts.loadouts[loadouts.currentLoadoutIndex].longGunMutator;
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

    const displaySearchedLongGuns = ()  => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {searchedLongGuns.map((longGun, index) => {
                if (longGun.itemName === "") {
                    return <Box key={index}/>
                }

                const longGunIsSelected = loadouts.loadouts[loadouts.currentLoadoutIndex].longGun.itemId === longGun.itemId;

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
                        // need to find the correct mod now for this weapon
                        if (longGun.isSpecialWeapon) {
                            const weaponModName = longGun.lockedModInfo.modName;
                            const filteredWeaponMod = weaponModsJson.filter((weaponMod) => weaponMod.itemName === weaponModName);
                            dispatch(actions.setLongGunWeaponMod(filteredWeaponMod[0]));
                        } else {
                            dispatch(actions.setLongGunWeaponMod(chooseableMods[0]));
                        }
                        dispatch(actions.setLongGun(longGun));
                        setOpenLongGunSearch(false);
                        setSearchedLongGunValue(null);
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

    const displaySearchedMods = () => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {modSearchResults.map((weaponMod, index) => {
                if (weaponMod.itemName === "") {
                    return <Box key={index}/>
                }
                const modIsSelected = loadouts.loadouts[loadouts.currentLoadoutIndex].weaponMod.itemId === weaponMod.itemId;
                return <Box
                    key={weaponMod.itemName + index}
                    style={{
                        borderColor: BorderColor,
                        cursor: "pointer",
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'box-shadow 0.2s'
                    }}
                    padding={"10px"}
                    onClick={() => {
                        if (modIsSelected) {
                            return;
                        }
                        dispatch(actions.setLongGunWeaponMod(weaponMod));
                        setOpenWeaponModSearch(false);
                        setSearchedModValue(null);
                    }}
                    border={2}
                    borderRadius={3}
                    width={350}
                    justifyContent={'center'}>
                    <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <Typography textAlign={'center'} variant={'h5'}>{weaponMod.itemName}</Typography>
                        <Typography color={'orange'}>Weapon Mods</Typography>
                        <img alt={weaponMod.itemImageLinkFullPath} src={weaponMod.itemImageLinkFullPath}
                             style={{width: 250, height: 250}}/>
                    </Box>
                    {highlightText(weaponMod.itemDescription)}
                    {modIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}
                </Box>
            })}
        </Box>
    }


    const displaySearchedMutators = () => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {mutatorSearchResults.map((mutator, index) => {
                if (mutator.itemName === "") {
                    return <Box key={index}/>
                }
                const modIsSelected = loadouts.loadouts[loadouts.currentLoadoutIndex].longGunMutator.itemId === mutator.itemId;
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
                        if (modIsSelected) {
                            return;
                        }
                        dispatch(actions.setLoadoutLongGunMutator(mutator));
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
                    {modIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}
                </Box>
            })}
        </Box>
    }

    return (
        <Box>
            {getHeaderComponent("Long Guns")}
            <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={'10px'}>
                {getLongGunSlotComponent()}
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
                        value={searchedLongGunValue}
                        renderInput={(params) => <TextField {...params} label="Search Long Guns" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedLongGunValue(newValue);
                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = longGunsJson.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setSearchedLongGuns(filteredOptions);
                            setSearchedLongGunValue(newValue);
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


            <Dialog
                PaperProps={{
                    sx: {
                        height: "100%",
                    }
                }}
                fullWidth={true}
                maxWidth={'xl'}
                open={openWeaponModSearch} onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return false;
                }
                setOpenWeaponModSearch(false);
            }}>
                <DialogActions>
                    <Autocomplete
                        fullWidth={true}
                        getOptionLabel={(option) => getOptionLabel(option)}
                        value={searchedModValue}
                        renderInput={(params) => <TextField {...params} label="Search Weapon Mods" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedModValue(newValue);
                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = chooseableMods.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setModSearchResults(filteredOptions);
                            setSearchedModValue(newValue);
                        }}
                        options={chooseableMods}/>
                    <IconButton onClick={() => setOpenWeaponModSearch(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    {displaySearchedMods()}
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
                            const filteredOptions = rangedMutators.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setMutatorSearchResults(filteredOptions);
                            setSearchedMutatorValue(newValue);
                        }}
                        options={rangedMutators}/>
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
