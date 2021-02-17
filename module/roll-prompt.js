// import { TrinityActorSheet } from 'systems/trinity/module/actor/trinity-actor';
console.log("roll-prompt.js imported?");

export class RollPrompt {

  // Problem??
  // template = template || 'systems/trinity/templates/roll-prompt.html';

  static async tRoll(event) {

    const element = event.currentTarget;
    const dataset = element.dataset;

    console.log("Debug in the tRoll function, event / element / dataset");
    console.log(event);
    console.log(element);
    console.log(dataset);

    // Roll Formula
    // Get info, if available, defaults if not
    let skilPart = dataset.skillValue || 0;
    let attrPart = dataset.attrValue || 0;
    let dicePart = skilPart+attrPart;
    let explPart = dataset.explode || 10;
    let succPart = dataset.successValue || 7;
    let enhaPart = dataset.enhancements || 0;
    let nscaPart = dataset.narraScale || 1;
    let dscaPart = dataset.dramaScale || 1;

    let rollFormula = `${dicePart}d10x${explPart}cs>=${succPart}`;
    console.log(rollFormula);
//  let rollFormula = "(@attributes.{{key}}.value)d10x10cs>=8"

    // Roll Attribute by itself if no skill supplied
    if (dataset.attrValue && !dataset.skillValue) {

      let roll = new Roll(rollFormula, this.actor.data.data);
      let label = dataset.attrName ? `Rolling ${dataset.attrName}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

}

/*
rollData possible parameters:
For the roll formula:
.skillValue = Skill Value
.attrValue = Attribute value
.explode = Explode Value (eg: 9-again)
.successValue = Success Value (7 or 8)
.enhancements = Enhancement(s)
.narraScale = Narrative Scale Difference
.dramaScale = Dramatic Scale Difference

For the roll description
.skillName = Skill Name
.attrName = Attribute Name
.attrArena = Attribute Arena
.attrApproach = Attribute Approach
Idea: import the top level skill / attrib date that will include all of these

For much later, for spending successes:
.complications
.stunts

*/
