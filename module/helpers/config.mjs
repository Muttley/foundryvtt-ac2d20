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
  "fightingFocuses": {
    'CloseQuarters': 'CloseQuarters',
    'Handguns': 'Handguns',
    'Hand-to-Hand': 'Hand-to-Hand',
    'HeavyWeapons': 'HeavyWeapons',
    'MeleeWeapons': 'MeleeWeapons',
    'Rifles': 'Rifles',
    'ThreatAwareness': 'ThreatAwareness',
    'Exotic': 'Exotic'
  },
  "range": {
    "close": "AC2D20.RANGE.close",
    "medium": "AC2D20.RANGE.medium",
    "long": "AC2D20.RANGE.long",
    "extreme": "AC2D20.RANGE.extreme"
  }

}




