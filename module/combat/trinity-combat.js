import { trinityRoll } from "/systems/trinity/module/trinity-roll.js";

export class TrinityCombat extends Combat
{

  async rollInitiative(ids, options)
  {
    let changes = [];
    for(const id of ids)
    {
      const c = this.combatants.get(id);
      let targetActor = c.actor;
      let event = {};
      let force = true;
      let pickedElements = c.actor.data.data.savedRolls[c.actor.data.data.initiativeRollID].elements;
      let breaker = c.actor.data.data.savedRolls[c.actor.data.data.initiativeRollID].dice;
      // let iniTraitValue = c.actor.data.data.attributes.combat;

      let combatRoll = await trinityRoll(targetActor, pickedElements, event, force);
      console.log("combatRoll: ", combatRoll);
      let ini = combatRoll._total + (breaker * 0.01);
      console.log("INI: ", ini);

      /*
      let ini = (2-rr.fumbleLvl) + (rr.successes + iniTraitValue) * 0.01;
      if(rr.fumbleLvl > 0)
      {
        let chatData = {
          content: `${c.actor.data.name} hat bei der Initiative gepatzt.`
        };

        ChatMessage.create(chatData)
      }
      */

      changes.push({
        _id: c.id,
        initiative: ini
      });
    }

    this.updateEmbeddedDocuments('Combatant', changes);
  }

}
