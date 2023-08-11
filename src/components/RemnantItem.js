import {Box, Typography} from "@mui/material";
import {BorderColor, UnHiLightedTextColor, HiLightedTextColor} from "../constants";

export default function RemnantItem({itemName, hRef, fullHref, imageLink, description, lore, itemType}) {

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

    return (
      <Box style={{borderColor: BorderColor}}
           maxHeight={500} padding={"10px"}
           border={2}
           borderRadius={3}
           width={250}
           justifyContent={'center'}>
          <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
              <Typography textAlign={'center'} variant={'h5'}>{itemName}</Typography>
              <Typography color={'orange'}>{itemType}</Typography>
              <img alt={imageLink} src={imageLink} style={{width: 150, height: 150}}/>
          </Box>
          {highlightText(description)}

      </Box>
    );

}


