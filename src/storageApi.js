import rings from "./items/rings.json";

class RemnantStorageApi {

    static MAX_LOADOUTS = 5;
    static LOADOUT_KEY = "remnantLoadouts";

    /**
     * Gets the local loadouts
     * @returns {any|*[]}
     */
    static getLocalLoadOuts() {
        const loadouts = localStorage.getItem(this.LOADOUT_KEY);
        if (!loadouts) {
            return [];
        }
        return JSON.parse(loadouts);
    }

    static saveLocalLoadOuts(loadouts) {
        if (!loadouts) {
            throw new Error("No loadouts supplied")
        }
        if (loadouts.length > this.MAX_LOADOUTS) {
            throw new Error("Too many loadouts")
        }
        localStorage.setItem(this.LOADOUT_KEY, JSON.stringify(loadouts));
    }

    static generateDefaultLoadOut() {
        const firstFourRings = rings.slice(0, 4);
        const loadouts = [
            {
                rings: firstFourRings,
                amulet: {},
                relic: {},
                mutators: [],
                weaponMods: []
            },
            {
                rings: firstFourRings,
                amulet: {},
                relic: {},
                mutators: [],
                weaponMods: []
            },
            {
                rings: firstFourRings,
                amulet: {},
                relic: {},
                mutators: [],
                weaponMods: []
            },
            {
                rings: firstFourRings,
                amulet: {},
                relic: {},
                mutators: [],
                weaponMods: []
            },
            {
                rings: firstFourRings,
                amulet: {},
                relic: {},
                mutators: [],
                weaponMods: []
            }
        ];
        return {
            loadouts: loadouts,
            currentLoadoutIndex: 0
        }
    }


}

export default RemnantStorageApi
