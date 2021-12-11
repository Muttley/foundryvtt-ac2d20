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
    'key': "Academia",
    'focuses': ['Art', 'Cryptography', 'Finance', 'History', 'Linguistics', 'Occultism', 'Science']
  },
  {
    'label': 'ATHLETICS',
    'key': "Athletics",
    'focuses': ['Climbing', 'Lifting', 'PhysicalTraining', 'Running', 'Swimming', 'Throwing']
  },
  {
    'label': 'ENGINEERING',
    'key': "Engineering",
    'focuses': ['Architecture', 'CombatEngineering', 'Electronics', 'Explosives', 'MechanicalEngineering']
  },
  {
    'label': 'FIGHTING',
    'key': "Fighting",
    'focuses': ['CloseQuarters', 'Handguns', 'Hand-to-Hand', 'HeavyWeapons', 'MeleeWeapons', 'Rifles',
      'ThreatAwareness', 'Exotic']
  },
  {
    'label': 'MEDICINE',
    'key': "Medicine",
    'focuses': ['FirstAid', 'InfectiousDiseases', 'Pharmacology', 'Psychiatry', 'Surgery', 'Toxicology']
  },
  {
    'label': 'OBSERVATION',
    'key': "Obseration",
    'focuses': ['Hearing', 'Instincts', 'Sight', 'SmellAndTaste']
  },
  {
    'label': 'PERSUASION',
    'key': "Persuasion",
    'focuses': ['Charm', 'Innuendo', 'Intimidation', 'Negotiation', 'Rhetoric', 'Deceive', 'Invocation']
  },
  {
    'label': 'RESILIENCE',
    'key': "Resilience",
    'focuses': ['Fortitude', 'Discipline', 'Immunity']
  },
  {
    'label': 'STEALTH',
    'key': "Stealth",
    'focuses': ['Camouflage', 'Disguise', 'RuralStealth', 'UrbanStealth']
  },
  {
    'label': 'SURVIVAL',
    'key': "Survival",
    'focuses': ['AnimalHandling', 'Foraging', 'Hunting', 'Mysticism', 'Orienteering', 'Tracking']
  },
  {
    'label': 'TACTICS',
    'key': "Tactics",
    'focuses': ['AirForce', 'Army', 'CovertOperations', 'Leadership', 'Navy', 'TechnicalProjects']
  },
  {
    'label': 'VEHICLES',
    'key': "Vehicles",
    'focuses': ['Cars', 'Motorcycles', 'HeavyVehicles', 'Tanks', 'Aircraft', 'Watercraft']
  }
];

AC2D20.Size = ["Trivial", "Minor", "Major"];

AC2D20.WEAPONS = {
  "range": {
    "close": "AC2D20.RANGE.close",
    "medium": "AC2D20.RANGE.medium",
    "long": "AC2D20.RANGE.long",
    "extreme": "AC2D20.RANGE.extreme"
  },
  "weaponTypes": [{
    'label': "Melee",
    'bonusAttribute': 'agi'
  },
  {
    'label': "Ranged",
    'bonusAttribute': 'coo'
  },
  {
    'label': "Mental",
    'bonusAttribute': 'wil'
  }]
}



