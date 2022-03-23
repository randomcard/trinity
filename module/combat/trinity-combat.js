import { trinityRoll } from "/systems/trinity/module/trinity-roll.js";

export class TrinityCombat extends Combat
{

  async startCombat() {

    // Group Initiative
    console.log("combat this", this);
    let isGrouped = game.settings.get("trinity", "initGroup");
    let updates = {};

    if ( isGrouped ) {
      // this.groupInfo = this.data.combatants;
      updates = this.data.combatants.map(c => { return this._hasPlayer(c) });
      await this.updateEmbeddedDocuments("Combatant", updates);
    }

    return this.update({round: 1, turn: 0});
  }

  async nextRound() {
    // Group Init stuff here:

    super.nextRound();
  }

  async previousRound() {
    // Group Init stuff here:

    super.previousRound();
  }

  _hasPlayer(c) {
    console.log("combat c:", c);
    if (c.token?.data?.disposition === 1) {
      return { _id: c.id, img: "systems/trinity/assets/icons-color/team-friendly.png", name: "Friendly" };
    }
    else if (c.token?.data?.disposition === 0) {
      return { _id: c.id, img: "systems/trinity/assets/icons-color/team-neutral.png", name: "Neutral" };
    }
    else {
      return { _id: c.id, img: "systems/trinity/assets/icons-color/team-hostile.png", name: "Hostile" };
    }
  }


  async rollInitiative(ids, {formula=null, updateTurn=true, messageOptions={}}={})
  {
    // Structure input data
    ids = typeof ids === "string" ? [ids] : ids;
    const currentId = this.combatant?.id;
    const rollMode = messageOptions.rollMode || game.settings.get("core", "rollMode");

    let updates = [];
    // for(const id of ids)
    for ( let [i, id] of ids.entries() )
    {
      const combatant = this.combatants.get(id);
      if ( !combatant?.isOwner ) return results;

      // Actors w/o an initiative roll
      if (typeof combatant.actor.data.data.linkedRolls.initiative === "undefined" || combatant.actor.data.data.linkedRolls.initiative === "") {
        let chatData = {
          content: `${combatant.actor.data.name} has no initiative roll selected.`
        };
        ChatMessage.create(chatData)

        updates.push({
          _id: id,
          initiative: 0
        });

      } else {

      // Actors w/ an initiative roll selected
        let p = combatant.actor.data.data.savedRolls[combatant.actor.data.data.linkedRolls.initiative];
        let breaker = p.diceTotal * 0.01;
        let initModel = game.settings.get("trinity", "initModel");
        let rollFormula = "";
        if (initModel === "modelT") {
          rollFormula = `(${p.formula})+${breaker}`;
        } else if (initModel === "modelS") {
          rollFormula = `1d10+${p.diceTotal}`;
        }

        // const roll = game.trinity.TRoll.create(rollFormula, {}, {}, p.enha.value);
        let roll = new Roll(rollFormula);
        await roll.evaluate({async: true});

        updates.push({
          _id: id,
          initiative: roll.total
        });

        // Complication List
            let compList = "";
            if( typeof combatant.actor.complications !== 'undefined' && combatant.actor.complications !== null) {
              for (let comp of combatant.actor.complications) {
                if (compList.length > 0) {
                  compList += "<br/>";
                  compList += comp.data.complication.value + " - " + comp.name;
                }
                if (compList.length === 0) {
                  compList += `<hr /><div class="small">Character's Complications:</div><div class="small-note">`;
                  compList += comp.data.complication.value + " - " + comp.name;
                }
              }
              if (compList.length > 0) {
                compList += "</div>";
              }
            }


        roll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          flavor: `Initiative Roll:<br>` + p.flavor,
          content: `${await roll.render()}` + compList
        });

      }
    }
    if ( !updates.length ) return this;

    console.log("COMBAT THIS:", this);
    await this.updateEmbeddedDocuments("Combatant", updates);

    // Ensure the turn order remains with the same combatant
    if ( updateTurn && currentId ) {
      await this.update({turn: this.turns.findIndex(t => t.id === currentId)});
    }

    return this;
  }

}
