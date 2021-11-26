export const AC2D20 = {};

AC2D20.attributes = {
  "agi": "AC2D20.AbilityAgi",
  "bra": "AC2D20.AbilityBra",
  "coo": "AC2D20.AbilityCoo",
  "ins": "AC2D20.AbilityIns",
  "rea": "AC2D20.AbilityRea",
  "wil": "AC2D20.AbilityWil",
};

AC2D20.abilityAbbreviations = {
  "agi": "AC2D20.AbilityAgiAbr",
  "bra": "AC2D20.AbilityBraAbr",
  "coo": "AC2D20.AbilityCooAbr",
  "ins": "AC2D20.AbilityInsAbr",
  "rea": "AC2D20.AbilityReaAbr",
  "wil": "AC2D20.AbilityWilAbr",
};

AC2D20.SKILLS = [
  {
    'label': 'ACADEMIA',
    'focuses': ['Art', 'Cryptography', 'Finance', 'History', 'Linguistics', 'Occultism', 'Science']
  },
  {
    'label': 'ATHLETICS',
    'focuses': ['Climbing', 'Lifting', 'PhysicalTraining', 'Running', 'Swimming', 'Throwing']
  },
  {
    'label': 'ENGINEERING',
    'focuses': ['Architecture', 'CombatEngineering', 'Electronics', 'Explosives', 'MechanicalEngineering']
  },
  {
    'label': 'FIGHTING',
    'focuses': ['CloseQuarters', 'Handguns', 'Hand-to-Hand', 'HeavyWeapons', 'MeleeWeapons', 'Rifles',
      'ThreatAwareness', 'Exotic']
  },
  {
    'label': 'MEDICINE',
    'focuses': ['FirstAid', 'InfectiousDiseases', 'Pharmacology', 'Psychiatry', 'Surgery', 'Toxicology']
  },
  {
    'label': 'OBSERVATION',
    'focuses': ['Hearing', 'Instincts', 'Sight', 'SmellAndTaste']
  },
  {
    'label': 'PERSUASION',
    'focuses': ['Charm', 'Innuendo', 'Intimidation', 'Negotiation', 'Rhetoric', 'Deceive', 'Invocation']
  },
  {
    'label': 'RESILIENCE',
    'focuses': ['Fortitude', 'Discipline', 'Immunity']
  },
  {
    'label': 'STEALTH',
    'focuses': ['Camouflage', 'Disguise', 'RuralStealth', 'UrbanStealth']
  },
  {
    'label': 'SURVIVAL',
    'focuses': ['AnimalHandling', 'Foraging', 'Hunting', 'Mysticism', 'Orienteering', 'Tracking']
  },
  {
    'label': 'TACTICS',
    'focuses': ['AirForce', 'Army', 'CovertOperations', 'Leadership', 'Navy', 'TechnicalProjects']
  },
  {
    'label': 'VEHICLES',
    'focuses': ['Cars', 'Motorcycles', 'HeavyVehicles', 'Tanks', 'Aircraft', 'Watercraft']
  }
];



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




