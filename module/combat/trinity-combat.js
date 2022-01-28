import { trinityRoll } from "/systems/trinity/module/trinity-roll.js";

export class TrinityCombat extends Combat
{

  async rollInitiative(ids, {formula=null, updateTurn=true, messageOptions={}}={})
  {
    // Structure input data
    ids = typeof ids === "string" ? [ids] : ids;
    const currentId = this.combatant?.id;
    const rollMode = messageOptions.rollMode || game.settings.get("core", "rollMode");

    let changes = [];
    // for(const id of ids)
    for ( let [i, id] of ids.entries() )
    {
      const c = this.combatants.get(i);
      let targetActor = c.actor;
      let event = {};
      let force = true;
      var ini = "";

      // Actors w/o an initiative roll
      if (c.actor.data.data.initiativeRollID === "") {
        ini = 0;
        let chatData = {
          content: `${c.actor.data.name} has no initiative roll selected.`
        };
        ChatMessage.create(chatData)
      } else {

      // Actors w/ an initiative roll selected
        let pickedElements = c.actor.data.data.savedRolls[c.actor.data.data.initiativeRollID].elements;
        let breaker = c.actor.data.data.savedRolls[c.actor.data.data.initiativeRollID].dice;

        let combatRoll = await trinityRoll(targetActor, pickedElements, event, force);
        ini = combatRoll._total + (breaker * 0.01);
      }

      changes.push({
        _id: c.id,
        initiative: ini
      });
    }
    if ( !updates.length ) return this;

    await this.updateEmbeddedDocuments("Combatant", changes);
    // Ensure the turn order remains with the same combatant
    if ( updateTurn && currentId ) {
      await this.update({turn: this.turns.findIndex(t => t.id === currentId)});
    }

    return this;
  }

}
