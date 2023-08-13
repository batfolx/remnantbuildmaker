import rings from "./items/rings.json";
import amulets from "./items/Amulets.json";
import relics from "./items/Relics.json";
import longGuns from "./items/LongGuns.json";
import meleeWeapons from "./items/MeleeWeapons.json";
import handGuns from "./items/Handguns.json";
import weaponMods from "./items/WeaponMods.json";
import mutators from "./items/Mutators.json";

class RemnantStorageApi {

    static MAX_LOADOUTS = 5;
    static LOADOUT_KEY = "remnantLoadouts";
    static currentVersion = "1.0.0";

    /**
     * Gets the local loadouts
     * @returns {any|*[]}
     */
    static getLocalLoadOuts() {
        const loadouts = localStorage.getItem(this.LOADOUT_KEY);
        if (loadouts === null || loadouts === "") {
            const defaults = this.generateDefaultLoadOut();
            this.saveLocalLoadOuts(defaults);
        }
        return JSON.parse(localStorage.getItem(this.LOADOUT_KEY));
    }

    static saveLocalLoadOuts(loadouts) {
        if (!loadouts) {
            throw new Error("No loadouts supplied")
        }
        localStorage.setItem(this.LOADOUT_KEY, JSON.stringify(loadouts));
    }

    static generateDefaultLoadOut() {
        const firstFourRings = rings.slice(0, 4);
        const firstAmulet = amulets[0];
        const firstRelic = relics[0];
        const d = new Date().toISOString();
        const firstLongGun = longGuns[0];
        const firstMeleeWeapon = meleeWeapons[0];
        const firstHandGun = handGuns[0];
        const firstWeaponMod = weaponMods[1];
        const meleeMutators = mutators.filter((mutator) => mutator.itemDescription.toLowerCase().includes("melee"));
        const rangedMutators = mutators.filter((mutator) => !mutator.itemDescription.toLowerCase().includes("melee"));
        const meleeWeaponMod = weaponMods.filter(w => w.itemName === "Accelerator")[0];
        const entry = {
            loadoutName: "",
            lastEdited: d,
            rings: firstFourRings,
            amulet: firstAmulet,
            relic: firstRelic,
            longGunMutator: rangedMutators[0],
            handGunMutator: rangedMutators[1],
            meleeMutator: meleeMutators[0],
            weaponMod: firstWeaponMod,
            handGunWeaponMod: firstWeaponMod,
            longGun: firstLongGun,
            handGun: firstHandGun,
            meleeWeapon: firstMeleeWeapon,
            meleeWeaponMod: meleeWeaponMod
        };
        const loadouts = Array.from({length: this.MAX_LOADOUTS}, () => ({...entry}))
        return {
            loadouts: loadouts,
            currentLoadoutIndex: 0,
            currentVersion: this.currentVersion
        }
    }

    static clearStorage() {
        localStorage.setItem(this.LOADOUT_KEY, "");
    }


}

export default RemnantStorageApi
