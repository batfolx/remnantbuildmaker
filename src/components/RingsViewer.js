import items from "../items/rings.json";
import RemnantItem from "./RemnantItem";
import {Box} from "@mui/material";
import PropTypes from "prop-types";

/**
 * This is the component that allows the user to scroll through,
 * search, and view all the rings
 * @returns {JSX.Element}
 * @constructor
 */
export function RingsViewer({itemsToDisplay}) {
    return (
        <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
            {itemsToDisplay.map((item) => {
                return <RemnantItem
                    itemName={item.itemName}
                    imageLink={item.itemImageLinkFullPath}
                    description={item.itemDescription}
                    itemType={"Ring"}/>
            })}
        </Box>
    )
}

RingsViewer.propTypes = {
    itemsToDisplay: PropTypes.array
}
