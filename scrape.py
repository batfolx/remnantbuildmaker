import json
import time
import bs4
import requests

base_url = 'https://remnant2.wiki.fextralife.com'
weapon_mods_url = "Weapon+Mods"
mutators_mod = "Mutators"
amulet_url = "Amulets"
ring_url = "Rings"
relics_url = "Relics"
rings_filename = 'rings.json'
long_guns_url = "Long+Guns"
handguns_url = "Handguns"
melee_weapons_url = "Melee+Weapons"
# relics_url, weapon_mods_url, mutators_mod, amulet_url, ring_url,
# long_guns_url, handguns_url, melee_weapons_url
endpoints = [long_guns_url]


def get_remnant_data():

    for endpoint in endpoints:
        url = f"{base_url}/{endpoint}"
        r = requests.get(url)
        soup = bs4.BeautifulSoup(r.content, 'html.parser')
        class_name = "col-sm-2 col-xs-6"
        elements = soup.find_all(class_=class_name)
        items = []
        for i, remnantItem in enumerate(elements):
            title = remnantItem.find('a')
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


        item_filename = f"{endpoint}.json"
        with open(item_filename, 'w+') as f:
            json.dump(items, f)

get_remnant_data()
