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
        let p = combatant.actor.data.data.savedRolls[combatant.actor.data.data.initiativeRollID].elements;
        let breaker = combatant.actor.data.data.savedRolls[combatant.actor.data.data.initiativeRollID].dice;
        let rollFormula = `(((${p.skil.value}+${p.attr.value})d10x>=${p.expl.value}cs>=${p.succ.value})*${p.nsca.value})+((${p.skil.value}+${p.attr.value})*0.01)`;

        const roll = game.trinity.TRoll.create(rollFormula, {}, {}, p.enha.value);
        await roll.evaluate({async: true});

        updates.push({
          _id: id,
          initiative: roll.total
        });

        // Construct chat message data
        let messageData = foundry.utils.mergeObject({
          speaker: ChatMessage.getSpeaker({
            actor: combatant.actor,
            token: combatant.token,
            alias: combatant.name
          }),
          flavor: game.i18n.format("COMBAT.RollsInitiative", {name: combatant.name}),
          flags: {"core.initiativeRoll": true}
        }, messageOptions);
        const chatData = await roll.toMessage(messageData, {
          create: false,
          rollMode: combatant.hidden && (["roll", "publicroll"].includes(rollMode)) ? "gmroll" : rollMode
        });

        // Play 1 sound for the whole rolled set
        if ( i > 0 ) chatData.sound = null;
        messages.push(chatData);

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
