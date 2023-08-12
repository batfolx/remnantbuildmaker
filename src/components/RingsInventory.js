import {Box, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {useState} from "react";
import {BorderColor, HiLightedTextColor, UnHiLightedTextColor} from "../constants";

export default function RingsInventory({loadouts, setLoadouts}) {

    const [ringSelectorOpen, setRingSelectorOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    function containsNumbers(str) {
        return /[0-9]/.test(str);
    }

    const highlightText = (text) => {
        const tokenizedText = text.split(" ");
        return (
            <Box display={"flex"} flexDirection={'row'} flexWrap={'wrap'}>
                {tokenizedText.map((t, index) => {
                    if (containsNumbers(t)) {
                        return <Typography key={index} color={HiLightedTextColor}>{t}&nbsp;</Typography>
                    } else {
                        return <Typography key={index} color={UnHiLightedTextColor}>{t}&nbsp;</Typography>
                    }
                })}

            </Box>
        );
    }

    const getRemnantRingSlotComponent = (ring, index) => {
        return (
            <Box style={{borderColor: BorderColor}}
                 maxHeight={500} padding={"10px"}
                 border={2}
                 borderRadius={3}
                 width={250}
                 justifyContent={'center'}>
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
            <Box display={'flex'} justifyContent={'center'} gap={'10px'}>
                {loadouts.rings.map((ring, index) => {
                    return getRemnantRingSlotComponent(ring, index)
                })}

            </Box>

        </Box>

    )

}

RingsInventory.propTypes = {
    loadouts: PropTypes.array,
    setLoadouts: PropTypes.func
}
