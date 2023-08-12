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
import {RingsViewer} from "./RingsViewer";
import { highlightText, getOptionLabel } from "../utilFunctions";
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ringsItemsJson from "../items/rings.json"
export default function RingsInventory({loadout, currentLoadoutIndex}) {

    const [ringSelectorOpen, setRingSelectorOpen] = useState(false);
    const [selectedRingIndex, setSelectedRingIndex] = useState(0);
    const [searchedRings, setSearchedRings] = useState(ringsItemsJson);
    const [searchedValue, setSearchedValue] = useState(null);
    const getRemnantRingSlotComponent = (ring, index) => {
        return (
            <Box key={index} style={{borderColor: BorderColor}}
                 maxHeight={500} padding={"10px"}
                 border={2}
                 borderRadius={3}
                 maxWidth={250}
                 justifyContent={'center'}
                 onClick={() => {
                     setRingSelectorOpen(true);
                     setSelectedRingIndex(index);
                 }}
            >
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography textAlign={'center'} variant={'h5'}>{ring.itemName}</Typography>
                    <Typography color={'orange'}>Ring</Typography>
                    <img alt={ring.itemImageLinkFullPath} src={ring.itemImageLinkFullPath} style={{width: 150, height: 150}}/>
                </Box>
                {highlightText(ring.itemDescription)}
            </Box>
        );
    }

    return (
        <Box>
            <Box marginLeft={'5%'} marginTop={'1%'} display={'flex'} justifyContent={'start'} alignItems={'start'} flexDirection={'column'}>
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
            }} open={ringSelectorOpen} onClose={() => setRingSelectorOpen(false)} fullWidth={true} maxWidth={'xl'} onClose={(event, reason) => {
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
                        renderInput={(params) => <TextField {...params} label="Search Rings" variant="outlined" />}
                        onChange={(event, newValue) => {
                            setSearchedValue(newValue);

                        }}
                        onInputChange={(event, newValue)=> {
                            const filteredOptions = ringsItemsJson.filter((r) => {
                                const label = getOptionLabel(r).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setSearchedRings(filteredOptions);
                            setSearchedValue(newValue.toLowerCase());
                        }}
                        options={ringsItemsJson}/>
                    <IconButton onClick={() => setRingSelectorOpen(false)}>
                        <CloseIcon/>
                    </IconButton>


                </DialogActions>
                <DialogContent>
                        <RingsViewer itemsToDisplay={searchedRings}/>
                </DialogContent>
            </Dialog>

        </Box>

    )

}

RingsInventory.propTypes = {
    loadout: PropTypes.object,
    currentLoadoutIndex: PropTypes.number
}
