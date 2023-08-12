import {Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {useState} from "react";
import {BorderColor, HiLightedTextColor, UnHiLightedTextColor} from "../constants";
import {RingsViewer} from "./RingsViewer";
import { highlightText } from "../utilFunctions";

export default function RingsInventory({loadout, currentLoadoutIndex}) {

    const [ringSelectorOpen, setRingSelectorOpen] = useState(false);
    const [selectedRingIndex, setSelectedRingIndex] = useState(0);
    const getRemnantRingSlotComponent = (ring, index) => {
        return (
            <Box style={{borderColor: BorderColor}}
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
                    <Typography textAlign={'center'} variant={'h5'}>{ring.RingsName}</Typography>
                    <Typography color={'orange'}>Ring</Typography>
                    <img alt={ring.RingsImageLinkFullPath} src={ring.RingsImageLinkFullPath} style={{width: 150, height: 150}}/>
                </Box>
                {highlightText(ring.RingsDescription)}
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

            <Dialog open={ringSelectorOpen} onClose={() => setRingSelectorOpen(false)} fullWidth={true} maxWidth={'xl'}>
                <DialogTitle>
                    Ring Selector
                </DialogTitle>
                <DialogActions>

                </DialogActions>
                <DialogContent>
                        <RingsViewer/>
                </DialogContent>


            </Dialog>

        </Box>

    )

}

RingsInventory.propTypes = {
    loadout: PropTypes.object,
    currentLoadoutIndex: PropTypes.number
}
