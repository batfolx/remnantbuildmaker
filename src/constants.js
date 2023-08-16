import ReactGA from "react-ga4";
import {isProduction} from "./utilFunctions";
ReactGA.initialize("G-3J2SNG6Z0B");
export const BorderColor = 'rgb(48, 48, 48)';
export const UnHiLightedTextColor = 'rgb(180, 178, 176)';
export const HiLightedTextColor = 'rgb(255, 255, 255)';
export const AcidTextColor = 'rgb(88, 153, 97)'
export const BleedingTextColor = 'rgb(150, 66, 79)';
export const BulwarkTextColor = 'rgb(241, 241, 207)';
export const ShockTextColor = 'rgb(101, 101, 129)';
export const SuppressionTextColor = 'rgb(63, 65, 91)';
export const BurningTextColor = 'rgb(159, 103, 78)';

export const ACTION_EXPORT_BUILD = "EXPORT_BUILD";
const ACTION_IMPORT_BUILD = "IMPORT_BUILD";
const ACTION_SWITCH_BUILD = "SWITCH_BUILD";
const ACTION_AMULET_SEARCH = "AMULET_SEARCH";
const ACTION_HANDGUN_SEARCH = "ACTION_HANDGUN_SEARCH";
const ACTION_LONGGUN_SEARCH = "ACTION_LONGGUN_SEARCH";
const ACTION_RELIC_SEARCH = "ACTION_RELIC_SEARCH";
const ACTION_RING_SEARCH = "ACTION_RING_SEARCH";
const ACTION_MELEE_SEARCH = "ACTION_MELEE_SEARCH";
const ACTION_LONGGUN_WEAPON_MOD_SEARCH = "ACTION_LONGGUN_WEAPON_MOD_SEARCH";
const ACTION_HANDGUN_WEAPON_MOD_SEARCH = "ACTION_HANDGUN_WEAPON_MOD_SEARCH";
const ACTION_MUTATOR_MOD_SEARCH = "ACTION_MUTATOR_MOD_SEARCH";
const ACTION_BUILD_URL_SHARE = "ACTION_BUILD_URL_SHARE";
const ACTION_BUILD_URL_IMPORT = "ACTION_BUILD_URL_IMPORT";
export  const CATEGORY_BUILDMAKER = "CATERGORY_BUILDMAKER";

export const sendLongGunWeaponModSearchEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_LONGGUN_WEAPON_MOD_SEARCH,
        label: `Search Long Gun Weapon Mods PROD: ${isProduction}`
    });
}

export const sendHandGunWeaponModSearchEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_HANDGUN_WEAPON_MOD_SEARCH,
        label: `Search Hand Gun Weapon Mods PROD: ${isProduction}`
    });
}

export const sendMutatorSearchEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_MUTATOR_MOD_SEARCH,
        label: `Search Mutators PROD: ${isProduction}`
    });
}

export const sendSaveLoadoutEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_AMULET_SEARCH,
        label: `Save Loadouts PROD: ${isProduction}`
    });
}

export const sendMeleeSearchEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_MELEE_SEARCH,
        label: `Melee Search PROD: ${isProduction}`
    });
}

export const sendAmuletSearchEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_AMULET_SEARCH,
        label: `Amulet Search PROD: ${isProduction}`
    });
}

export const sendLongGunSearchEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_LONGGUN_SEARCH,
        label: `Long Gun Search PROD: ${isProduction}`
    });
}

export const sendHandGunSearchEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_HANDGUN_SEARCH,
        label: `Hand Gun Search PROD: ${isProduction}`
    });
}

export const sendRingSearchEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_RING_SEARCH,
        label: `Ring Search PROD: ${isProduction}`
    });
}

export const sendRelicSearchEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_RELIC_SEARCH,
        label: `Relic Search PROD: ${isProduction}`
    });
}

export const sendImportSingleBuildEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_IMPORT_BUILD,
        label: `Import Single Build PROD: ${isProduction}`
    });
}

export const sendImportFullBuildEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_IMPORT_BUILD,
        label: `Import Full Build PROD: ${isProduction}`
    });
}

export const sendLoadoutSwitchEvent = (currentLoadoutIndex, index) => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_SWITCH_BUILD,
        label: `Switch build from ${currentLoadoutIndex + 1} to ${index + 1} PROD: ${isProduction}`
    });
}

export const sendSearchLongGunWeaponModEvent = () => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_LONGGUN_WEAPON_MOD_SEARCH,
        label: `Search Long Gun Weapon Mod PROD: ${isProduction}`
    });
}

export const sendShareUrlBuildEvent = (buildId) => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_BUILD_URL_SHARE,
        label: `Share a build with ID ${buildId} PROD: ${isProduction}`
    });
}

export const importBuildFromUrlEvent = (buildId) => {
    ReactGA.event({
        category: CATEGORY_BUILDMAKER,
        action: ACTION_BUILD_URL_IMPORT,
        label: `Import a build with ID ${buildId} PROD: ${isProduction}`
    });
}


export const REPO_NAME = "remnantbuildmaker";
