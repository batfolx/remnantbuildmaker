import {Box, Typography} from "@mui/material";
import {BorderColor} from "../constants";
import { highlightText } from "../utilFunctions";

export default function RemnantItem({itemName, hRef, fullHref, imageLink, description, lore, itemType}) {

    return (
      <Box key={itemName} style={{borderColor: BorderColor}}
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


