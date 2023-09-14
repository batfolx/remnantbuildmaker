import json
import time
import bs4
import requests
import os

json_folder_url = "./src/data/"
base_url = 'https://remnant2.wiki.fextralife.com'
weapon_mods_url = "Weapon+Mods"
mutators_url = "Mutators"
amulet_url = "Amulets"
ring_url = "Rings"
relics_url = "Relics"
rings_filename = 'rings.json'
long_guns_url = "Long+Guns"
handguns_url = "Handguns"
melee_weapons_url = "Melee+Weapons"
armor_head_url = "Head+Armor"
armor_gloves_url = "Gloves"
armor_body_url = "Body+Armor"
armor_legs_url = "Leg+Armor"
traits_url = "Traits"
# relics_url, weapon_mods_url, mutators_url, amulet_url, ring_url,
# long_guns_url, handguns_url, melee_weapons_url
endpoints = [relics_url, weapon_mods_url, mutators_url, amulet_url, ring_url,long_guns_url, handguns_url, melee_weapons_url]
# armor_head_url, armor_gloves_url, armor_body_url, armor_legs_url
armor_endpoints = [armor_head_url, armor_gloves_url, armor_body_url, armor_legs_url]

def get_title(element):
    title = element.find("a", {"class": "wiki_tooltip"})
    if title:
        return title
    else:
        title = element.find("a", {"class": "wiki_link"})
        if title:
            return title
        else:
            return

def get_trait_data():
    url = f"{base_url}/Traits"
    r = requests.get(url)
    soup = bs4.BeautifulSoup(r.content, 'html.parser')
    class_name = "col-sm-3"
    elements = soup.find_all(class_=class_name)
    traits = []
    for i, remnantTrait in enumerate(elements):
        title = get_title(remnantTrait)
        img = remnantTrait.find("img")
        trait_name = ''
        trait_href = ''
        trait_img = ''
        if title:
            trait_name = title.getText();
            trait_href = title.get("href")
        else:
            print(f"Currently on trait {i + 1} / {len(elements)}, no data found, skipping")
            continue
        if img:
            trait_img = img.get("src")

        trait_full_href = f"{base_url}{trait_href}"
        r = requests.get(trait_full_href)
        trait_soup = bs4.BeautifulSoup(r.content, 'lxml')
        trait_description = trait_soup.find_all('tr', class_="infobox_a_description")
        if trait_description:
            trait_description = trait_description[0]
            trait_description = trait_description.getText()
        else:
            trait_description = "No trait description found."

        trait_payload = {
                "traitId": i,
                "traitName": trait_name,
                "traitHref": trait_href,
                "traitFullHref": trait_full_href,
                "traitImageLinkPath": trait_img,
                "traitImageLinkFullPath": f'{base_url}{trait_img}',
                "traitDescription": trait_description
        }
        print(f"Currently on trait {i + 1} / {len(elements)}, trait name being {trait_name}")
        time.sleep(1)
        traits.append(trait_payload)

    trait_filename = f"{json_folder_url}Traits.json"
    os.makedirs(os.path.dirname(trait_filename), exist_ok=True)
    with open(trait_filename, 'w+') as f:
        json.dump(traits, f)

def get_archetype_data():
    url = f"{base_url}/Classes"
    r = requests.get(url)
    soup = bs4.BeautifulSoup(r.content, 'html.parser')
    class_name = "tabcontent All-tab tabcurrent"
    elements = soup.find_all(class_=class_name)
    class_name = "col-sm-3"
    elements = elements[0].find_all(class_=class_name)
    archetypes = []
    for i, remnantArchetype in enumerate(elements):
        title = get_title(remnantArchetype)
        img = remnantArchetype.find("img")
        archetype_name = ''
        archetype_href = ''
        archetype_img = ''
        if title:
            archetype_name = title.getText().strip()
            archetype_href = title.get("href")
        else:
            print(f"Currently on archetype {i + 1} / {len(elements)}, no data found, skipping")
            continue

        if img:
            archetype_img = img.get("src")

        archetype_full_href = f"{base_url}{archetype_href}"
        r = requests.get(archetype_full_href)
        archetype_soup = bs4.BeautifulSoup(r.content, 'lxml')

        archetype_description = archetype_soup.find_all('blockquote')
        if archetype_description:
            archetype_description = archetype_description[0]
            archetype_description = archetype_description.getText()

        additional_archetype_info = {}
        archetype_info = archetype_soup.find_all(class_="infobox")
        if archetype_info:
            archetype_info = archetype_info[0]
            prime_perk_info = archetype_info.find(lambda tag: tag.name == "td" and "Prime Perk" in tag.text).find_next_sibling().find("a")
            arch_trait_info = archetype_info.find(lambda tag: tag.name == "td" and "Archetype Trait" in tag.text).find_next_sibling().find("a")
            archetype_perk_name = prime_perk_info.getText()
            archetype_perk_href = prime_perk_info.get("href")
            archetype_trait_name = arch_trait_info.getText()
            archetype_trait_href = arch_trait_info.get("href")
            additional_archetype_info["primePerk"] = archetype_perk_name
            additional_archetype_info["primePerkUrl"] = archetype_perk_href
            additional_archetype_info["archetypeTrait"] = archetype_trait_name
            additional_archetype_info["archetypeTraitHref"] = archetype_trait_href

        archetype_payload = {
            "archetypeId": i,
            "archetypeName": archetype_name,
            "archetypeHref": archetype_href,
            "archetypeFullHref": archetype_full_href,
            "archetypeImageLinkPath": archetype_img,
            "archetypeImageLinkFullPath": f'{base_url}{archetype_img}',
            "archetypeDescription": archetype_description,
            "archetypeInfo": additional_archetype_info
        }
        print(f"Currently on archetype {i + 1} / {len(elements)}, item name being {archetype_name}")

        time.sleep(1)
        archetypes.append(archetype_payload)

    archetype_filename = f"{json_folder_url}Archetypes.json"
    os.makedirs(os.path.dirname(archetype_filename), exist_ok=True)
    with open(archetype_filename, 'w+') as f:
        json.dump(archetypes, f) 
        
def get_armor_data():
    for endpoint in armor_endpoints:
        url = f"{base_url}/{endpoint}"
        r = requests.get(url)
        soup = bs4.BeautifulSoup(r.content, 'html.parser')
        class_name = "col-sm-2 col-xs-6"
        elements = soup.find_all(class_=class_name)
        items = []
        for i, remnantItem in enumerate(elements):
            title = get_title(remnantItem)
            img = remnantItem.find("img")
            item_name = ''
            item_href = ''
            item_img = ''
            if title:
                item_name = title.getText()
                item_href = title.get("href")
            else:
                print(f"Currently on item {i + 1} / {len(elements)}, no data found, skipping")
                continue

            if img:
                item_img = img.get("src")

            item_full_href = f"{base_url}{item_href}"
            r = requests.get(item_full_href)
            item_soup = bs4.BeautifulSoup(r.content, 'lxml')
            item_description = item_soup.find_all('tr', class_="infobox_a_description")
            if item_description:
                item_description = item_description[0]
                item_description = item_description.getText()
            else:
                item_description = "No item description found."

            item_lore = item_soup.find_all('blockquote')
            if item_lore:
                item_lore = item_lore[0]
                item_lore = item_lore.getText()
            else:
                item_lore = "No item lore found."

            additional_armor_info = {}
            armor_info = item_soup.find_all('tr', class_='infobox_a_damage')
            if armor_info:
                armor_info = armor_info[0]
                armor_stats = armor_info.find_all_next('h4')
                if armor_stats:
                    print(armor_stats)
                    armor_value = armor_stats[0].getText()
                    armor_weight = armor_stats[1].getText()
                    armor_bleed_resist = armor_stats[2].getText()
                    armor_fire_resist = armor_stats[3].getText()
                    armor_shock_resist = armor_stats[4].getText()
                    armor_blight_resist = armor_stats[5].getText()
                    armor_toxin_resist = armor_stats[6].getText()
                    additional_armor_info["armorValue"] = armor_value
                    additional_armor_info["armorWeight"] = armor_weight
                    additional_armor_info["armorBleedResist"] = armor_bleed_resist
                    additional_armor_info["armorFireResist"] = armor_fire_resist
                    additional_armor_info["armorShockResist"] = armor_shock_resist
                    additional_armor_info["armorBlightResist"] = armor_blight_resist
                    additional_armor_info["armorToxinResist"] = armor_toxin_resist

            item_payload = {
                "itemId": i,
                "itemName": item_name,
                "itemHref": item_href,
                "itemFullHref": item_full_href,
                "itemImageLinkPath": item_img,
                "itemImageLinkFullPath": f'{base_url}{item_img}',
                "itemDescription": item_description,
                "itemLore": item_lore,
                "itemType": endpoint,
                "armorInfo": additional_armor_info
            }
            print(f"Currently on item {i + 1} / {len(elements)}, class name being {item_name}")

            time.sleep(1)
            items.append(item_payload)

        sanitized_filename = endpoint.replace("+","")
        item_filename = f"{json_folder_url}{sanitized_filename}.json"
        os.makedirs(os.path.dirname(item_filename), exist_ok=True)
        with open(item_filename, 'w+') as f:
            json.dump(items, f)
        
def get_remnant_data():
    for endpoint in endpoints:
        url = f"{base_url}/{endpoint}"
        r = requests.get(url)
        soup = bs4.BeautifulSoup(r.content, 'html.parser')
        class_name = "col-sm-2 col-xs-6"
        elements = soup.find_all(class_=class_name)
        items = []
        for i, remnantItem in enumerate(elements):
            title = get_title(remnantItem)
            img = remnantItem.find("img")
            item_name = ''
            item_href = ''
            item_img = ''
            if title:
                item_name = title.getText()
                item_href = title.get("href")

            if img:
                item_img = img.get("src")

            item_full_href = f"{base_url}{item_href}"
            r = requests.get(item_full_href)
            item_soup = bs4.BeautifulSoup(r.content, 'lxml')
            item_description = item_soup.find_all('tr', class_="infobox_a_description")
            if item_description:
                item_description = item_description[0]
                item_description = item_description.getText()
            else:
                item_description = "No item description found."

            if "Monster-Hunter-World" in item_img:
                additional_item_img = item_soup.find_all('td', class_='infobox_a_image_background')
                if additional_item_img:
                    additional_item_img = additional_item_img[0].find_next('img')
                    item_img = additional_item_img.get('src')

            item_lore = item_soup.find_all('blockquote')
            if item_lore:
                item_lore = item_lore[0]
                item_lore = item_lore.getText()
            else:
                item_lore = "No item lore found."

            special_weapon = item_soup.find_all("div", class_="infobox_a_mod_content")
            locked_mod_payload = {}
            if special_weapon:
                mod_img = special_weapon[0].find_next("img")
                locked_mod_payload["modImage"] = mod_img.get("src")
                locked_mod_payload["modImageFullPath"] = f"{base_url}{mod_img.get('src')}"

            mod_info = item_soup.find_all("div", class_="infobox_a_mod_text")
            if mod_info:
                mod_name = mod_info[0].find_next("a").getText()
                mod_description = mod_info[0].find_next("p").getText()
                locked_mod_payload["modName"] = mod_name
                locked_mod_payload["modDescription"] = mod_description

            additional_gun_info = {}
            gun_info = item_soup.find_all('tr', class_='infobox_a_damage')
            if gun_info:
                gun_info = gun_info[0]
                gun_dmg_stats = gun_info.find_all_next('h4')
                if gun_dmg_stats:
                    print(gun_dmg_stats)
                    gun_dmg = gun_dmg_stats[0].getText()
                    if endpoint != melee_weapons_url:
                        gun_rps = gun_dmg_stats[1].getText()
                        gun_mag_size = gun_dmg_stats[2].getText()
                        additional_gun_info["gunDamage"] = gun_dmg
                        additional_gun_info["gunRPS"] = gun_rps
                        additional_gun_info["gunMagSize"] = gun_mag_size

            gun_stats = item_soup.find_all('tr', class_='infobox_a_stats')
            if gun_stats:
                gun_stats = gun_stats[0]
                accuracy_l = gun_stats.find_next('span', class_='a_accuracy_bar_l')
                if accuracy_l:
                    accuracy = accuracy_l.get("style").split(" ")[1].replace(";", "")
                    print("Accuracy width", accuracy)
                    additional_gun_info["accuracy"] = accuracy

                additional_stats = gun_stats.find_all('span', class_='a_stat_value')
                if additional_stats:
                    if endpoint == melee_weapons_url:
                        crit_chance = additional_stats[0].getText()
                        weakspot_dmg_bonus = additional_stats[1].getText()
                        stagger_modifier = additional_stats[2].getText()
                        additional_gun_info["critChance"] = crit_chance
                        additional_gun_info["weakspotDamageBonus"] = weakspot_dmg_bonus
                        additional_gun_info["staggerModifier"] = stagger_modifier
                    else:
                        ideal_range = additional_stats[0].getText()
                        falloff_range = additional_stats[1].getText()
                        max_ammo = additional_stats[2].getText()
                        crit_chance = additional_stats[3].getText()
                        weakspot_dmg_bonus = additional_stats[4].getText()
                        stagger_modifier = additional_stats[5].getText()
                        additional_gun_info["idealRange"] = ideal_range
                        additional_gun_info["falloffRange"] = falloff_range
                        additional_gun_info["maxAmmo"] = max_ammo
                        additional_gun_info["critChance"] = crit_chance
                        additional_gun_info["weakspotDamageBonus"] = weakspot_dmg_bonus
                        additional_gun_info["staggerModifier"] = stagger_modifier

            item_payload = {
                "itemId": i,
                "itemName": item_name,
                "itemHref": item_href,
                "itemFullHref": item_full_href,
                "itemImageLinkPath": item_img,
                "itemImageLinkFullPath": f'{base_url}{item_img}',
                "itemDescription": item_description,
                "itemLore": item_lore,
                "itemType": endpoint,
                "isSpecialWeapon": bool(special_weapon),
                "lockedModInfo": locked_mod_payload,
                "weaponInfo": additional_gun_info
            }
            print(f"Currently on item {i + 1} / {len(elements)}, item name being {item_name}")

            time.sleep(1)
            items.append(item_payload)


        sanitized_filename = endpoint.replace("+","")
        item_filename = f"{json_folder_url}{sanitized_filename}.json"
        os.makedirs(os.path.dirname(item_filename), exist_ok=True)
        with open(item_filename, 'w+') as f:
            json.dump(items, f)

print(f"-----FETCHING TRAIT DATA-----")
get_trait_data()
print(f"-----FETCHING CLASS DATA-----")
get_archetype_data()
print(f"-----FETCHING ARMOR DATA-----")
get_armor_data()
print(f"---FETCHING REMAINING DATA---")
get_remnant_data()
print("-------------DONE-------------")
