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

      var ini = "";

      // Actors w/o an initiative roll
      if (combatant.actor.data.data.initiativeRollID === "") {
        ini = 0;
        let chatData = {
          content: `${combatant.actor.data.name} has no initiative roll selected.`
        };
        ChatMessage.create(chatData)
      } else {

      // Actors w/ an initiative roll selected
        let p = combatant.actor.data.data.savedRolls[combatant.actor.data.data.initiativeRollID].elements;
        let breaker = combatant.actor.data.data.savedRolls[combatant.actor.data.data.initiativeRollID].dice;
        let rollFormula = `((${p.skil.value}+${p.attr.value})d10x>=${p.expl.value}cs>=${p.succ.value})*${p.nsca.value}`;

        const roll = game.trinity.TRoll.create(rollFormula, {}, p.enha.value).create;
        await roll.evaluate({async: true});
        // updates.push({_id: id, initiative: roll.total});
        console.log("COMBAT roll: ", roll);

        ini = roll.total + (breaker * 0.01);
        console.log("COMBAT ini: ", ini);

      }

      updates.push({
        _id: id,
        initiative: ini
      });
      console.log("COMBAT updates:", updates);
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
