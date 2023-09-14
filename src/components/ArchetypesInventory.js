import {
    Autocomplete,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    Typography,
    TextField,
    Zoom
} from "@mui/material";
import {useState} from "react";
import {BorderColor, sendArchetypeSearchEvent} from "../constants";
import {highlightText, getArchetypeLabel, getHeaderComponent} from "../utilFunctions";
import {IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import archetypesJson from "../data/Archetypes.json";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../reducers/loadoutReducer";

export default function ArchetypesInventory() {

    const loadouts = useSelector((state) => state.loadouts);
    const [archetypeSelectorOpen, setArchetypeSelectorOpen] = useState(false);
    const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState(0);
    const [searchedArchetypes, setSearchedArchetypes] = useState(archetypesJson);
    const [searchedValue, setSearchedValue] = useState(null);
    const dispatch = useDispatch();

    /**
     * Gets the archetype slot component (primary or secondary)
     * @param archetype The archetype object
     * @param index The index (archetype number)
     * @returns {JSX.Element}
     */
    const getRemnantArchetypeSlotComponent = (archetype, index) => {
        return(
            <Zoom in={true} style={{transitionDelay: `${index * 75}ms`}}>
                <Box key={archetype.archetypeName + index} 
                    style={{
                        borderColor: BorderColor,
                        cursor: "pointer",
                        boxShadow: '2px 2px 4px rgba(150, 150, 150, 0.1)',
                        transition: 'box-shadow 0.2s'
                    }}
                    sx={{
                        ':hover': {
                            boxShadow: 20
                        }
                    }}
                    maxHeight={500}
                    padding={"10px"}
                    border={2}
                    borderRadius={3}
                    maxWidth={250}
                    justifyContent={'center'}
                    onClick={() => {
                        sendArchetypeSearchEvent();
                        setSelectedArchetypeIndex(index);
                        setArchetypeSelectorOpen(true);
                    }}
                    >
                        <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                            <Typography textAlign={'center'} variant={'h5'}>{archetype.archetypeName}</Typography>
                            <Typography color={'orange'}>Archetype {index === 0 ? "(Prime)" : ""}</Typography>
                            <img alt={archetype.archetypeImageLinkFullPath} src={archetype.archetypeImageLinkFullPath}
                                style={{width: 150, height: 150}}/>
                        </Box>
                        {highlightText(archetype.archetypeDescription)}
                </Box>
            </Zoom>
        )
    }

    /**
     * Displays the searched archetypes to the user
     * @returns {JSX.Element}
     */
    const displaySearchedArchetype = () => {
        return (
            <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'15px'}>
                {searchedArchetypes.map((c) => {
                    const archetypeIsSelected = loadouts.loadouts[loadouts.currentLoadoutIndex].archetypes.some(loadoutArchetype => loadoutArchetype.archetypeId === c.archetypeId);
                    return <Box
                        key={c.archetypeName}
                        style={{
                            borderColor: BorderColor,
                            cursor: "pointer",
                            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                            transition: 'box-shadow 0.2s'
                        }}
                        maxHeight={500}
                        padding={"10px"}
                        onClick={() => {
                            if (archetypeIsSelected) {
                                return;
                            }

                            const currentArchetypes =[...loadouts.loadouts[loadouts.currentLoadoutIndex].archetypes];
                            currentArchetypes[selectedArchetypeIndex] = c;
                            dispatch(actions.setLoadOutArchetypes(currentArchetypes));
                            setArchetypeSelectorOpen(false);
                            setSearchedValue(null);
                        }}
                        border={2}
                        borderRadius={3}
                        width={250}
                        justifyContent={'center'}>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                            <Typography textAlign={'center'} variant={'h5'}>{c.archetypeName}</Typography>
                            <Typography color={'orange'}>{"Archetype"}</Typography>
                            <img alt={c.archetypeImageLinkFullPath} src={c.archetypeImageLinkFullPath}
                                    style={{width: 150, height: 150}}/>
                        </Box>
                        {highlightText(c.archetypeDescription)}
                        {archetypeIsSelected && <CircleIcon style={{color: 'orange'}}></CircleIcon>}
                    </Box>
                })}
            </Box>
        )
    }

    return (
        <Box marginTop={'25px'}>
            {getHeaderComponent("Archetypes")}
            <Box display={'flex'} justifyContent={'center'} gap={'10px'} flexWrap={'wrap'}>
                {loadouts.loadouts[loadouts.currentLoadoutIndex].archetypes.map((archetype, index) => {
                    return getRemnantArchetypeSlotComponent(archetype, index)
                })}
            </Box>
            <Dialog PaperProps={{
                sx: {
                    height: "100%"
                }
            }}
            open={archetypeSelectorOpen}
            fullWidth={true}
            maxWidth={'xl'}
            onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return false;
                }
                setArchetypeSelectorOpen(false);
            }}>
                <DialogActions>
                    <Autocomplete
                        fullWidth={true}
                        getOptionLabel={(option) => getArchetypeLabel(option)}
                        value={searchedValue}
                        renderInput={(params) => <TextField {...params} label="Search Archetypes" variant="outlined"/>}
                        onChange={(event, newValue) => {
                            setSearchedValue(newValue);
                        }}
                        onInputChange={(event, newValue) => {
                            const filteredOptions = archetypesJson.filter((c) => {
                                const label = getArchetypeLabel(c).toLowerCase();
                                return label.includes(newValue.toLowerCase());
                            });
                            setSearchedArchetypes(filteredOptions);
                            setSearchedValue(newValue);
                        }}
                        options={archetypesJson}/>
                        <IconButton onClick={() => setArchetypeSelectorOpen(false)}>
                            <CloseIcon/>
                        </IconButton>
                </DialogActions>
                <DialogContent>
                    {displaySearchedArchetype()}
                </DialogContent>
            </Dialog>
        </Box>
    )
}

ArchetypesInventory.propTypes = {}
