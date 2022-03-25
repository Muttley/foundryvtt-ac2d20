# v 1.0.5

Fixed bug with Personal Truths and Injuries on the Actor sheet.
Due to the nature of the bug data model is changed and no migration is provided
If you want to check what truths and injuries that actor previously had you can use a SCRIPT macro that will log those thruths and injuries in the console. If the actor's truths and injuries were corrupted you will see an empty list unfortunately.

Here is a SCRIPT macro (select the actor's token on the stage and click the macro):

```let act = canvas.tokens.controlled[0]?.actor
if(act == undefined){
console.log('select a token first')
return;
}
console.log("TRUTHS")
console.log(act.data.data.truths)
console.log("INJURIES")
console.log(act.data.data.injuries.list)```


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
