import {Box, Typography} from "@mui/material";
import {BorderColor} from "../constants";

export default function RemnantItem({itemName, hRef, fullHref, imageLink, description, lore}) {

    return (
      <Box padding={"5px"} border={1} borderRadius={3} width={250} height={250} justifyContent={'center'}>
          <Typography >{itemName}</Typography>
          <img alt={imageLink} src={imageLink} style={{width: 150, height: 150}}/>
          <Box>
              <Typography>{description}</Typography>
          </Box>
      </Box>
    );

}


