import {Box, Typography} from "@mui/material";
import {
    BulwarkTextColor,
    BurningTextColor,
    HiLightedTextColor,
    ShockTextColor,
    SuppressionTextColor,
    UnHiLightedTextColor,
    BleedingTextColor, AcidTextColor, ACTION_EXPORT_BUILD, CATEGORY_BUILDMAKER, BorderColor
} from "./constants";
import ReactGA from "react-ga4";

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
                    let color = UnHiLightedTextColor;
                    if (t.includes("BURNING") || t.includes("FIRE")) {
                        color = BurningTextColor;
                    } else if (t.includes("SUPPRESSION")) {
                        color = SuppressionTextColor;
                    } else if (t.includes("SHOCK")) {
                        color = ShockTextColor;
                    } else if (t.includes("BLEED")) {
                        color = BleedingTextColor;
                    } else if (t.includes("BULWARK")) {
                        color = BulwarkTextColor;
                    } else if (t.includes("CORRO") || t.includes("ACID")) {
                        color = AcidTextColor;
                    }


                    return <Typography key={index} color={color}>{t}&nbsp;</Typography>
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
    const blob = new Blob([JSON.stringify(loadouts, null, 2)]);
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    const d = new Date();
    link.download = `remnant_build-${d.toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_EXPORT_BUILD,
        label: `Export Build ${buildType}`
    });
}

export function getNonWeaponPreviewComponent(item, itemType) {
    if (!item || !item.itemName) {
        return <Box/>
    }
    return (<Box style={{
            borderColor: BorderColor,
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
                 maxWidth={250}
                 justifyContent={'center'}
        >
            <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                <Typography textAlign={'center'} variant={'h5'}>{item.itemName}</Typography>
                <Typography color={'orange'}>{itemType}</Typography>
                <img alt={item.itemImageLinkFullPath} src={item.itemImageLinkFullPath}
                     style={{width: 150, height: 150}}/>
            </Box>
            {highlightText(item.itemDescription)}
        </Box>
    )
}

export function getWeaponPreviewComponent(item, itemType) {

    if (!item || !item.itemName) {
        return <Box/>
    }

    return (<Box style={{
            borderColor: BorderColor,
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
        >
            <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                <Typography textAlign={'center'} variant={'h5'}>{item.itemName}</Typography>
                <Typography color={'orange'}>{itemType}</Typography>
                <img alt={item.itemImageLinkFullPath} src={item.itemImageLinkFullPath}
                     style={{width: 350, height: 150}}/>
            </Box>
            {highlightText(item.itemDescription)}
        </Box>
    )
}


export function getMutatorPreviewComponent(item, itemType) {

    if (!item || !item.itemName) {
        return <Box/>
    }

    return (<Box style={{
            borderColor: BorderColor,
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
        >
            <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                <Typography textAlign={'center'} variant={'h5'}>{item.itemName}</Typography>
                <Typography color={'orange'}>{itemType}</Typography>
                <img alt={item.itemImageLinkFullPath} src={item.itemImageLinkFullPath}
                     style={{width: 200, height: 200}}/>
            </Box>
            {highlightText(item.itemDescription)}
        </Box>
    )
}


export function getHeaderComponent(itemHeaderName) {
    return (
        <Box marginLeft={'5%'} display={'flex'} justifyContent={'start'} alignItems={'start'}
             flexDirection={'column'}>
            <Typography fontFamily={'Poppins'} variant={'h4'}>{itemHeaderName}</Typography>
        </Box>
    );
}

