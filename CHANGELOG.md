# v11.2.0

## Bugfix
- [#14] Some localization fixes (lozanoje)
- [#16] Enable the prosemirror editor for item descriptions (lozanoje)
- [#17] Text enricher for Cthulhu symbol not displaying the correct character

*Many thanks to lozanoje for contributing code included in this build*

# v11.1.2

## Bugfix
- [#8] Weapon sizes not correctly displayed on Gear tab of character sheet
- [#9] Gear category labels for Skill Kits and Equipment not translated
- [#10] Spellcasting type always shows as Traditional when posted to chat
- [#11] Don't show brackets on spell display unless it has a Focus set

# v11.1.1

## Bugfix
- [#3] Actor skills being overwritten when an Actor is duplicated

## Chore
- Translation updates are now all handled via Crowdin to simplify the process of contributing translations.  See here for more details: https://github.com/Muttley/foundryvtt-ac2d20/wiki/Other-ways-to-contribute#translation

# v11.1.0

- System migrated to new home and build process
- Compendiums now contained within a top-level system folder

# v11.0.2

- Initiative-Tracker Overhaul, brought to you by Muttley.
(If you had Lancer mod for tracking initiative you can disable it since the system now handles initiative tracking)
Also, check the settings where You can toggle Momentum decreasement at the end of the round.
Many thanks to Muttley for sharing his initiative tracker modifications and spending his time to implement it.

# v11.0.1

- Item Sheets now look in the skill compendium when creating list of skills and focuses in dropdowns.
You can set what compendium to use for skills in AC2d20 settings

# v11.0.0

- Foundry V11 compatible

# v10.0.10

- Necessary changes to TextEnricher to support full async methods
- Fixed Item to Chat button

# v10.0.9

- Added option in the settings to point to your json file that contains custom **descriptions** for weapon's effects/qualities. (It is a way to override those descriptions like 'pg.99' .etc)

# v10.0.8

- Added delete button to skills

# v10.0.7

- Added text enrichers for AC2D20 special symbols like the small cthulhu head or the cross.
Write the **Cthulhu Head Icon(symbol)** in texts by typing **@s** ot **@stress** or **@c** or **@challenge**
Write the **The Cross symbol** in texts by typing **@x** or **@xross**
# v10.0.6

- Fixed custom skill compendium usage

# v10.0.5

- Added carry capacity autocalculation

# v10.0.4

- Spellcasting types are now defined by Actor and not the spells. Traditional, Researcher and Dabbler are now set on the Character/NPC sheet under the "Spells" tab.

# v10.0.3

- Fixed item qualities display in chat messages
# v10.0.2

- Small changes to roller so it works with Maestro Module item tracks

# v10.0.1

- Added Spanish translation (Thanks to Viajero Salvaje)

# v10.0.0

- System is compatible with Foundry v10
- Added Fatigue value to the character sheet

# v 1.0.5

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
# v 1.0.4

- Setting added: "Show GM Momentum To Player"
- Setting added: "Players Can Setup Party's Max App"
- Changed releases manifest and package.

# v 1.0.3

- Bumped version to v9
- Changed the power on the spell tab so it only has a single numerical field
- Creating new spells now leaves the focus field empty

# v 1.0.2

- Added Ritual fields for Spells.

# v 1.0.1

- Added two new weapon qualities found in GM guide. Bane and Hunger.
