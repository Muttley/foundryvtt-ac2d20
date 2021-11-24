export const AC2D20 = {};

AC2D20.attributes = {
  "str": "AC2D20.AbilityStr",
  "per": "AC2D20.AbilityPer",
  "end": "AC2D20.AbilityEnd",
  "cha": "AC2D20.AbilityCha",
  "int": "AC2D20.AbilityInt",
  "agi": "AC2D20.AbilityAgi",
  "luc": "AC2D20.AbilityLuc"
};

AC2D20.abilityAbbreviations = {
  "str": "AC2D20.AbilityStrAbbr",
  "per": "AC2D20.AbilityPerAbbr",
  "end": "AC2D20.AbilityEndAbbr",
  "cha": "AC2D20.AbilityChaAbbr",
  "int": "AC2D20.AbilityIntAbbr",
  "agi": "AC2D20.AbilityAgiAbbr",
  "luc": "AC2D20.AbilityLucAbbr"
};

AC2D20.SKILLS = ["Athletics", "Barter", "Big Guns", "Energy Weapons", "Explosives", "Lockpick", "Medicine", "Melee Weapons", "Pilot", "Repair", "Science", "Small Guns", "Sneak", "Speech", "Survival", "Throwing", "Unarmed"];
AC2D20.CREATURE = {
  "skills": {
    "melee": "AC2D20.CREATURE.melee",
    "guns": "AC2D20.CREATURE.guns",
    "other": "AC2D20.CREATURE.other"
  },
  "attributes": {
    "body": "AC2D20.CREATURE.body",
    "mind": "AC2D20.CREATURE.mind",
  }
}

AC2D20.APPAREL_TYPE = {
  "clothing": "AC2D20.APPAREL.clothing",
  "outfit": "AC2D20.APPAREL.outfit",
  "armor": "AC2D20.APPAREL.armor",
  "headgear": "AC2D20.APPAREL.headgear",
  "powerArmor": "AC2D20.APPAREL.powerArmor"
}
AC2D20.ROBOT_APPAREL_TYPE = {
  "plating": "AC2D20.APPAREL.plating",
  "armor": "AC2D20.APPAREL.armor"
}

AC2D20.BodyValues = {
  "head": "1-2",
  "torso": "3-8",
  "armL": "9-11",
  "armR": "12-14",
  "legL": "15-17",
  "legR": "18-20",
}

AC2D20.powerLevel = {
  "normal": "normal",
  "mighty": "mighty",
  "legendary": "legendary"
}

AC2D20.resistanceIcons = {
  'physical': 'fas fa-fist-raised',
  'energy': 'fas fa-bolt',
  'radiation': 'fas fa-radiation',
  'poison': 'fas fa-biohazard',
}

AC2D20.WEAPONS = {
  "weaponType": {
    "bigGuns": "AC2D20.WEAPONS.weaponType.bigGuns",
    "energyWeapons": "AC2D20.WEAPONS.weaponType.energyWeapons",
    "explosives": "AC2D20.WEAPONS.weaponType.explosives",
    "meleeWeapons": "AC2D20.WEAPONS.weaponType.meleeWeapons",
    "smallGuns": "AC2D20.WEAPONS.weaponType.smallGuns",
    "throwing": "AC2D20.WEAPONS.weaponType.throwing",
    "unarmed": "AC2D20.WEAPONS.weaponType.unarmed",
    "creatureAttack": "AC2D20.WEAPONS.weaponType.creatureAttack"
  },
  "weaponSkill": {
    "bigGuns": "Big Guns",
    "energyWeapons": "Energy Weapons",
    "explosives": "Explosives",
    "meleeWeapons": "Melee Weapons",
    "smallGuns": "Small Guns",
    "throwing": "Throwing",
    "unarmed": "Unarmed",
    "creatureAttack": "Melee"
  },
  "damageType": {
    'physical': 'AC2D20.WEAPONS.damageType.physical',
    'energy': 'AC2D20.WEAPONS.damageType.energy',
    'radiation': 'AC2D20.WEAPONS.damageType.radiation',
    'poison': 'AC2D20.WEAPONS.damageType.poison',
  },
  "range": {
    "close": "AC2D20.RANGE.close",
    "medium": "AC2D20.RANGE.medium",
    "long": "AC2D20.RANGE.long",
    "extreme": "AC2D20.RANGE.extreme"
  },
  "damageEffect": {
    "burst": { "label": "AC2D20.WEAPONS.damageEffect.burst", "value": false, "description": "" },
    "breaking": { "label": "AC2D20.WEAPONS.damageEffect.breaking", "value": false, "description": "" },
    "persistent": { "label": "AC2D20.WEAPONS.damageEffect.persistent", "value": false, "description": "" },
    "piercing": { "label": "AC2D20.WEAPONS.damageEffect.piercing", "value": false, "rank": 1, "description": "" },
    "radioactive": { "label": "AC2D20.WEAPONS.damageEffect.radioactive", "value": false, "description": "" },
    "spread": { "label": "AC2D20.WEAPONS.damageEffect.spread", "value": false, "description": "" },
    "stun": { "label": "AC2D20.WEAPONS.damageEffect.stun", "value": false, "description": "" },
    "vicious": { "label": "AC2D20.WEAPONS.damageEffect.vicious", "value": false, "description": "" }
  },
  "weaponQuality": {
    "accurate": { "label": "AC2D20.WEAPONS.weaponQuality.accurate", "value": false, "description": "" },
    "blast": { "label": "AC2D20.WEAPONS.weaponQuality.blast", "value": false, "description": "" },
    "closeQuarters": { "label": "AC2D20.WEAPONS.weaponQuality.closeQuarters", "value": false, "description": "" },
    "concealed": { "label": "AC2D20.WEAPONS.weaponQuality.concealed", "value": false, "description": "" },
    "debilitating": { "label": "AC2D20.WEAPONS.weaponQuality.debilitating", "value": false, "description": "" },
    "gatling": { "label": "AC2D20.WEAPONS.weaponQuality.gatling", "value": false, "description": "" },
    "inaccurate": { "label": "AC2D20.WEAPONS.weaponQuality.inaccurate", "value": false, "description": "" },
    "mine": { "label": "AC2D20.WEAPONS.weaponQuality.mine", "value": false, "description": "" },
    "nightVision": { "label": "AC2D20.WEAPONS.weaponQuality.nightVision", "value": false, "description": "" },
    "parry": { "label": "AC2D20.WEAPONS.weaponQuality.parry", "value": false, "description": "" },
    "recon": { "label": "AC2D20.WEAPONS.weaponQuality.recon", "value": false, "description": "" },
    "reliable": { "label": "AC2D20.WEAPONS.weaponQuality.reliable", "value": false, "description": "" },
    "suppressed": { "label": "AC2D20.WEAPONS.weaponQuality.suppressed", "value": false, "description": "" },
    "thrown": { "label": "AC2D20.WEAPONS.weaponQuality.thrown", "value": false, "description": "" },
    "twoHanded": { "label": "AC2D20.WEAPONS.weaponQuality.twoHanded", "value": false, "description": "" },
    "unreliable": { "label": "AC2D20.WEAPONS.weaponQuality.unreliable", "value": false, "description": "" }
  }

}

AC2D20.consumableTypes = {
  "food": "AC2D20.FOOD",
  "beverage": "AC2D20.BEVERAGE",
  "chem": "AC2D20.CHEM",
  "other": "AC2D20.OTHER"
}



