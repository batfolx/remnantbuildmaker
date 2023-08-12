import items from "../items/rings.json";
import RemnantItem from "./RemnantItem";
import {Box} from "@mui/material";

/**
 * This is the component that allows the user to scroll through,
 * search, and view all the rings
 * @returns {JSX.Element}
 * @constructor
 */
export function RingsViewer() {
    return (
        <Box>
            {items.map((item) => {
                return <RemnantItem
                    itemName={item.RingsName}
                    imageLink={item.RingsImageLinkFullPath}
                    description={item.RingsDescription}
                    itemType={"Ring"}/>
            })}
        </Box>
    )
}
