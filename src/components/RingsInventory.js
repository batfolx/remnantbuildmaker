import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    TextField
} from "@mui/material";
import PropTypes from "prop-types";
import {useState} from "react";
import {BorderColor, HiLightedTextColor, UnHiLightedTextColor} from "../constants";
import {highlightText, getOptionLabel} from "../utilFunctions";
import {IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import ringsItemsJson from "../items/rings.json"

export default function RingsInventory({loadout, currentLoadoutIndex, saveLoadouts}) {

    const [ringSelectorOpen, setRingSelectorOpen] = useState(false);
    const [selectedRingIndex, setSelectedRingIndex] = useState(0);
    const [searchedRings, setSearchedRings] = useState(ringsItemsJson);
    const [searchedValue, setSearchedValue] = useState(null);

    /**
     * Gets the ring slot component (rings 1-4)
     * @param ring The ring object
     * @param index The index (ring number)
     * @returns {JSX.Element}
     */
    const getRemnantRingSlotComponent = (ring, index) => {
        return (
            <Box key={index} style={{borderColor: BorderColor, cursor: "pointer", boxShadow: '2px 2px 4px rgba(150, 150, 150, 0.1)', transition: 'box-shadow 0.2s'}}
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
                     setSelectedRingIndex(index);
                     setRingSelectorOpen(true);
                 }}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{ring.itemName}</Typography>
                    <Typography color={'orange'}>Ring</Typography>
                    <img alt={ring.itemImageLinkFullPath} src={ring.itemImageLinkFullPath}
                         style={{width: 150, height: 150}}/>
                </Box>
                {highlightText(ring.itemDescription)}
            </Box>
        );
    }

    /**
     * Displays the searched rings to the user
     * @returns {JSX.Element}
     */
    const displaySearchedRings = () => {
        return <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {searchedRings.map((r) => {

                const ringIsSelected = loadout.rings.some(loadoutRing => loadoutRing.itemId === r.itemId)

                return <Box
                    key={r.itemName}
                    style={{borderColor: BorderColor, cursor: "pointer", boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', transition: 'box-shadow 0.2s'}}
                    maxHeight={500} padding={"10px"}
                    onClick={() => {
                        if (ringIsSelected) {
                            return;
                        }
                        loadout.rings[selectedRingIndex] = r;
                        setRingSelectorOpen(false);
                        setSearchedValue(null);
                        saveLoadouts();
                    }}
                    border={2}
                    borderRadius={3}
                    width={250}
                    justifyContent={'center'}>
                    <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <Typography textAlign={'center'} variant={'h5'}>{r.itemName}</Typography>
                        <Typography color={'orange'}>{r.itemType}</Typography>
                        <img alt={r.itemImageLinkFullPath} src={r.itemImageLinkFullPath}
                             style={{width: 150, height: 150}}/>
                    </Box>
                    {highlightText(r.itemDescription)}
                    {ringIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}

                </Box>
            })}
        </Box>
    }

    return (
        <Box>
            <Box marginLeft={'5%'} marginTop={'1%'} display={'flex'} justifyContent={'start'} alignItems={'start'}
                 flexDirection={'column'}>
                <Typography fontFamily={'Poppins'} variant={'h4'}>Rings</Typography>
            </Box>
            <Box display={'flex'} justifyContent={'center'} gap={'10px'} flexWrap={'wrap'}>
                {loadout.rings.map((ring, index) => {
                    return getRemnantRingSlotComponent(ring, index)
                })}
            </Box>

            <Dialog PaperProps={{
                sx: {
                    height: "100%"
                }
            }} open={ringSelectorOpen} onClose={() => setRingSelectorOpen(false)} fullWidth={true} maxWidth={'xl'}
                    onClose={(event, reason) => {
                        if (reason === 'backdropClick') {
                            return false;
                        }
                    }}>
                <DialogActions>
                    <Autocomplete
                        fullWidth={true}
                        getOptionLabel={(option) => getOptionLabel(option)}
                        value={searchedValue}
                        autoComplete={"off"}
                        renderInput={(params) => <TextField {...params} label="Search Rings" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedValue(newValue);

                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = ringsItemsJson.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setSearchedRings(filteredOptions);
                            setSearchedValue(newValue);
                        }}
                        options={ringsItemsJson}/>
                    <IconButton onClick={() => setRingSelectorOpen(false)}>
                        <CloseIcon/>
                    </IconButton>


                </DialogActions>
                <DialogContent>
                    {displaySearchedRings()}
                </DialogContent>
            </Dialog>

        </Box>

    )

}

RingsInventory.propTypes = {
    loadout: PropTypes.object,
    currentLoadoutIndex: PropTypes.number,
    saveLoadouts: PropTypes.func
}
