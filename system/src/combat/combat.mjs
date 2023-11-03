// import Counter from '../system/counter';

export default class Combat2d20 extends Combat {

  constructor(options) {
    super(options);

    this.flags.combatantsTurnDone = this.flags.combatantsTurnDone ?? [];
  }

  get combatantsTurnDone() {
    const combatantsTurnDone = this.flags.combatantsTurnDone ?? [];
    return combatantsTurnDone[this.round] ?? {};
  }

  get momentumLog() {
    const momentumLog = this.flags.momentumLog ?? [];
    return momentumLog[this.round] ?? {};
  }

  get shouldUpdateMomentum() {
    return game.settings.get(
      'ac2d20', 'combatTrackerMomentumUpdate'
    );
  }

  async endCombat() {
    return Dialog.confirm({
      title: game.i18n.localize('COMBAT.EndTitle'),
      content: `<p>${game.i18n.localize('COMBAT.EndConfirmation')}</p>`,
      yes: () => {
        if (this.shouldUpdateMomentum && this.started) {
          if (game.user.isGM) {
            game.ac2d20.MomentumTracker.adjustAP('partyMomentum', -1);
          }
          else {
            game.socket.emit('system.ac2d20', {
              operation: 'adjustAP',
              data: { diff: -1, type: 'partyMomentum' },
            });
          }

          ui.notifications.info(
            game.i18n.localize('AC2D20.Combat.CombatEndMomentumPoolDecremented')
          );
        }
        this.delete();
      },
    });
  }

  async nextRound() {
    this.turn = null;

    if (this.shouldUpdateMomentum) {
      if (game.user.isGM) {
        game.ac2d20.MomentumTracker.adjustAP('partyMomentum', -1);
      }
      else {
        game.socket.emit('system.ac2d20', {
          operation: 'adjustAP',
          data: { diff: -1, type: 'partyMomentum' },
        });
      }

      ui.notifications.info(
        game.i18n.localize('AC2D20.Combat.CombatRoundMomentumPoolDecremented')
      );
    }

    let advanceTime = Math.max(this.turns.length - this.turn, 0) * CONFIG.time.turnTime;
    advanceTime += CONFIG.time.roundTime;
    let nextRound = this.round + 1;

    // Update the document, passing data through a hook first
    const updateData = {round: nextRound, turn: this.turn};
    const updateOptions = {advanceTime, direction: 1};
    Hooks.callAll('combatRound', this, updateData, updateOptions);
    return this.update(updateData, updateOptions);
  }

  async rollInitiative() {
    return this;
  }

  async setTurn(newTurn) {
    this.turn = newTurn;

    // Update the document, passing data through a hook first
    const updateData = {round: this.round, turn: newTurn};
    const updateOptions = {advanceTime: CONFIG.time.turnTime, direction: 1};
    Hooks.callAll('combatTurn', this, updateData, updateOptions);
    return this.update(updateData, updateOptions);
  }

  setupTurns() {
    // Determine the turn order and the current turn
    const turns = this.combatants.contents;

    // Sort alphabetically by name first
    turns.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    // Now sort by type
    turns.sort((a, b) => {
      const actorA = game.actors.get(a.actorId);
      const actorB = game.actors.get(b.actorId);

      if (actorA.type < actorB.type) {
        return -1;
      }
      if (actorA.type > actorB.type) {
        return 1;
      }
      return 0;
    });

    if ( this.turn !== null) this.turn = Math.clamped(this.turn, 0, turns.length-1);

    // Update state tracking
    let c = turns[this.turn];
    this.current = {
      round: this.round,
      turn: this.turn,
      combatantId: c ? c.id : null,
      tokenId: c ? c.tokenId : null,
    };

    // Return the array of prepared turns
    return this.turns = turns;
  }

  async startCombat() {
    const updateData = {
      round: 1,
      turn: 0,
      'flags.combatantsTurnDone': [],
    };

    Hooks.callAll('combatStart', this, updateData);

    return this.update(updateData);
  }

  async toggleTurnDone(combatantId) {
    if (!game.user.isGM) return;
    if (!this.started) return;

    const combatantsTurnDone = this.combatantsTurnDone;

    const turnDone = !(combatantsTurnDone[combatantId] ?? false);
    combatantsTurnDone[combatantId] = turnDone;

    this.flags.combatantsTurnDone[this.round] = combatantsTurnDone;

    return this.update({'flags.combatantsTurnDone': this.flags.combatantsTurnDone});
  }
}
