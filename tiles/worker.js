onmessage = event => {
    const KEY = {
        stone: {name: "Stone"},
        wood: {name: "Wood"},
        gold: {name: "Gold"},
        silver: {name: "Silver"},
        clay: {name: "Clay"},
        obsidian: {name: "Obsidian"},
        escape_lantern: {name: "Escape Lantern"},
        dragon_scale: {name: "Dragon Scale"},
        red_dye: {name: "Red Dye"},
        tinder: {name: "Tinder"},
        charcoal: {name: "Charcoal"},
        hide: {name: "Hide"},
        flint: {name: "Flint"},
        bone: {name: "Bone"},
        dirt: {name: "Dirt"},
        bronze: {name: "Bronze"}
    }

    postMessage(Object.entries(Object.values(event.data.floor).concat(Object.values(event.data.build)).reduce((all, item) => {
        for (const key in item.mats) {
            all[key] ||= 0
            all[key] += item.mats[key]
        }

        return all
    }, {})).map(([key, qty]) => KEY[key].name + ": " + qty).join("\n"))
}