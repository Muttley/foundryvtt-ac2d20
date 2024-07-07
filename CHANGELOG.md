## v11.6.3

### Enhancement
- [#120] Add support for the Catalan language

### Bugfix
- [#118] GM Threat "-" button not working
- [#122] Issue adding combatants to combat tracker

### Chores
- [#119] Merge new Polish translation updates from Crowdin

*Many thanks to **trombonecat** for contributing the Catalan language translations*

---

## v11.6.2

### Bugfix
- [#114] Spell cost roll not displaying result in chat

### Chores
- [#113] Merge new Polish translation updates from Crowdin

---

## v11.6.1

### Enhancement
- [#109] Add support for the Polish language

### Bugfixq
- [#110] Adding Truth to NPC or Vehicle record in a Compendium Throws error

### Chores
- [#108] Merge new French and Polish translation updates from Crowdin

*Many thanks to **Kazek360** for contributing the Polish language translations*

---

## v11.6.0

### Enhancement
- [#104] Added Experimental weapon quality

### Bugfix
- [#103] Ensure custom Dice So Nice theme dice values are readable

---

## v11.5.3

### Bugfix
- [#101] Dice So Nice not rolling the dice when using Skills, etc

### Chores
- [#100] Merge new French translation updates from Crowdin

---

## v11.5.2

### Bugfix
- [#97] Some missing Focus and Skill localization on Character sheet

### Chores
- [#96] Merge new Portuguese/Brazilian translation updates from Crowdin

*Many thanks to **lozanoje** for contributing code included in this build*

---

## v11.5.1

### Bugfix
- [#93] Release notes not showing on new version

---

## v11.5.0

### Ehancement
- [#74] Add styling to the journals

### Bugfix
- [#65] Fix un-localized strings in Actor abilities template
- [#66] Hardcoded skills in autocalc MaxStress
- [#71] Skill localization not working on NPCs
- [#73] Typo in max stress calculation meant Will+Resilience not used when it should
- [#75] Error in char sheet talent listing text enrichments used in description

### Chores
- [#67] Merge new Portuguese/Brazilian translation updates from Crowdin
- [#72] Merge new French and Portuguese/Brazilian translation updates from Crowdin
- [#78] Merge new Spanish and Portuguese/Brazilian translation updates from Crowdin
- [#79] Merge new Portuguese/Brazilian translation updates from Crowdin
- [#87] Unable to alter max momentum setting if you reduce it to zero
- [#88] Retire the Skills Compendium world setting now that it is no longer required
- [#89] Retire the hoversJsonLocation setting now it is no longer needed
- [#90] Merge new French translation updates from Crowdin
- [#91] Rolling a one on a skill test should always count as a critical, regardless of skill/focus values

*Many thanks to **lozanoje** for contributing code and translations included in this build*

---

## v11.4.0

### Enhancement
- [#19] Turn skills compendium config setting into a selector of available Item compendiums
- [#31] Automatic update of char sheet
- [#33] Add languages field to character sheet
- [#35] Add XP field to character sheet
- [#52] Create a better method and data structure for managing truths on character sheets

	* Each truth is now an individual entry that can be edited or deleted.  Most existing free text truths should be migrated safely, but there's the odd chance you may need to fix things up manually if you had any newline characters in the middle of a Truth.

- [#54] Auto-calculate max Stress value

	* Also modifes the max stress by fatigue. If the max value is being affected by fatigue then the value is coloured red to indicate this
	* The max value can be adjusted by active effects using the `system.stress.mod` key if necessary

- [#55] Auto-calculate Attribute bonuses
- [#57] Update flat injuries values for standard character so they can be utilised by macros or modules

	* Number of untreated injuries: `system.injuries.value`
	* Number of treated injuries: `system.injuries.treated`

- [#58] On character sheet, sort skill focuses alphabetically by i18n name
- [#59] Save screen real estate on character Talents tab by moving talent description to hover tooltip

	* You can still expand the item to have it displayed on the sheet if needed

- [#60] Enable toggling skill focus on/off with Ctrl+LeftMouse on character sheet
- [#62] Add system/login page background image courtesy of Modiphius

### Bugfix
- [#1] compendium-skills setting needs to re-run some of the setup in Ready hook when changed
- [#34] Skill complication range calculation on a NPC Sheet
- [#51] Skill and Focus names not translated on character sheet

### Chore
- [#21] Fix "singleSeat:" vehicle template field name
- [#41] Ensure the system has no compatibility issues in Foundry V12 Development Releases
- [#42] globalThis.mergeObject which must now be accessed via foundry.utils.mergeObject *(Foundry v12 compatibility)*
- [#43] The {{select}} handlebars helper is deprecated *(Foundry v12 compatibility)*
- [#44] ActiveEffect._getSourceName is deprecated *(Foundry v12 compatibility)*
- [#45] ActiveEffect#icon has been migrated to ActiveEffect#img *(Foundry v12 compatibility)*
- [#48] Add contributed Portuguese, Brazilian translation
- [#56] The async option for Roll#evaluate has been removed *(Foundry v12 compatibility)*

*Many thanks to **Leo Tusi** for providing **Portuguese, Brazilian** translation data.*

*Many thanks to **Modiphius** for allowing us to use on of their excellent **Achtung! Cthulhu** wallpaper images.*

---

## v11.3.0

### Enhancement
- [#28] Added onhover description for vehicle qualities as in the weapon sheet
- [#38] Add support for French language translations

### Chore
- [#32] Merged additional Spanish translations.
- [#37] Merge French translation updates from Crowdin

*Many thanks to **lozanoje** for contributing code and translations included in this build*

*Many thanks to **Dniektr** for contributing French language translations for this build.  The French language i18n file now has 100% coverage*

---

## v11.2.0

### Enhancement
- [#20] Implement schema migration tools
- [#22] Open new item automatically when using the Create Item buttons on a character sheet
- [#23] Display release notes automatically at first on update or for a new world

### Bugfix
- [#14] Some localization fixes (lozanoje)
- [#15] Cannot open spell sheet when changing language
- [#16] Enable the prosemirror editor for item descriptions (lozanoje)
- [#17] Text enricher for Cthulhu symbol not displaying the correct character

*Many thanks to lozanoje for contributing code included in this build*

---

## v11.1.2

### Bugfix
- [#8] Weapon sizes not correctly displayed on Gear tab of character sheet
- [#9] Gear category labels for Skill Kits and Equipment not translated
- [#10] Spellcasting type always shows as Traditional when posted to chat
- [#11] Don't show brackets on spell display unless it has a Focus set

---

## v11.1.1

### Bugfix
- [#3] Actor skills being overwritten when an Actor is duplicated

### Chore
- Translation updates are now all handled via Crowdin to simplify the process of contributing translations.  See here for more details: https://github.com/Muttley/foundryvtt-ac2d20/wiki/Other-ways-to-contribute#translation

---

## v11.1.0

- System migrated to new home and build process
- Compendiums now contained within a top-level system folder

---

## v11.0.2

- Initiative-Tracker Overhaul, brought to you by Muttley.
(If you had Lancer mod for tracking initiative you can disable it since the system now handles initiative tracking)
Also, check the settings where You can toggle Momentum decreasement at the end of the round.
Many thanks to Muttley for sharing his initiative tracker modifications and spending his time to implement it.

---

## v11.0.1

- Item Sheets now look in the skill compendium when creating list of skills and focuses in dropdowns.
You can set what compendium to use for skills in AC2d20 settings

---

## v11.0.0

- Foundry V11 compatible

---

## v10.0.10

- Necessary changes to TextEnricher to support full async methods
- Fixed Item to Chat button

---

## v10.0.9

- Added option in the settings to point to your json file that contains custom **descriptions** for weapon's effects/qualities. (It is a way to override those descriptions like 'pg.99' .etc)

---

## v10.0.8

- Added delete button to skills

---

## v10.0.7

- Added text enrichers for AC2D20 special symbols like the small cthulhu head or the cross.
Write the **Cthulhu Head Icon(symbol)** in texts by typing **@s** ot **@stress** or **@c** or **@challenge**
Write the **The Cross symbol** in texts by typing **@x** or **@xross**
---

## v10.0.6

- Fixed custom skill compendium usage

---

## v10.0.5

- Added carry capacity autocalculation

---

## v10.0.4

- Spellcasting types are now defined by Actor and not the spells. Traditional, Researcher and Dabbler are now set on the Character/NPC sheet under the "Spells" tab.

---

## v10.0.3

- Fixed item qualities display in chat messages
---

## v10.0.2

- Small changes to roller so it works with Maestro Module item tracks

---

## v10.0.1

- Added Spanish translation (Thanks to Viajero Salvaje)

---

## v10.0.0

- System is compatible with Foundry v10
- Added Fatigue value to the character sheet

---

## v1.0.5

Fixed bug with Personal Truths and Injuries on the Actor sheet.
Due to the nature of the bug data model is changed and no migration is provided
If you want to check what truths and injuries that actor previously had you can use a SCRIPT macro that will log those thruths and injuries in the console. If the actor's truths and injuries were corrupted you will see an empty list unfortunately.

Here is a SCRIPT macro (select the actor's token on the stage and click the macro):

```
let act = canvas.tokens.controlled[0]?.actor
if(act == undefined){
console.log('select a token first')
return;
}
console.log("TRUTHS")
console.log(act.data.data.truths)
console.log("INJURIES")
console.log(act.data.data.injuries.list)
```
---

## v1.0.4

- Setting added: "Show GM Momentum To Player"
- Setting added: "Players Can Setup Party's Max App"
- Changed releases manifest and package.

---

## v1.0.3

- Bumped version to v9
- Changed the power on the spell tab so it only has a single numerical field
- Creating new spells now leaves the focus field empty

---

## v1.0.2

- Added Ritual fields for Spells.

---

## v1.0.1

- Added two new weapon qualities found in GM guide. Bane and Hunger.
