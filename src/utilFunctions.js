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

export function getOptionLabel(item) {
    if (typeof item === 'string') {
        return item;
    }
    return `${item.itemName} ${item.itemDescription}`
}

export async function exportBuildFile(loadouts, buildType) {
    loadouts.buildType = buildType;
    const blob = new Blob([JSON.stringify(loadouts)]);
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    const d = new Date();
    link.download = `remnant_build-${d.toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

