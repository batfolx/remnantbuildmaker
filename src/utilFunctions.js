import {Box, Typography} from "@mui/material";
import {HiLightedTextColor, UnHiLightedTextColor} from "./constants";

export function containsNumbers(str) {
    return /[0-9]/.test(str);
}

export const highlightText = (text) => {
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

