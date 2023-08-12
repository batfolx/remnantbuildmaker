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
# weapon_mods_url, mutators_mod, amulet_url, ring_url,
endpoints = [relics_url]


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

            if endpoint == 'Relics':
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
            item_payload = {
                "itemId": i,
                "itemName": item_name,
                "itemHref": item_href,
                "itemFullHref": item_full_href,
                "itemImageLinkPath": item_img,
                "itemImageLinkFullPath": f'{base_url}{item_img}',
                "itemDescription": item_description,
                "itemLore": item_lore,
                "itemType": endpoint

            }
            print(f"Currently on item {i + 1} / {len(elements)}, item name being {item_name}")
            time.sleep(1)

            items.append(item_payload)


        item_filename = f"{endpoint}.json"
        with open(item_filename, 'w+') as f:
            json.dump(items, f)

get_remnant_data()
