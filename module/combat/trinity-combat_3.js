import { trinityRoll } from "/systems/trinity/module/trinity-roll.js";

export class TrinityCombat extends Combat
{

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
      if (combatant.actor.data.data.initiativeRollID === "") {
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
        let p = combatant.actor.data.data.savedRolls[combatant.actor.data.data.initiativeRollID];
        let breaker = p.diceTotal * 0.01;
        let rollFormula = `(${p.formula})+${breaker}`;

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
