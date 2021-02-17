// import { TrinityActorSheet } from 'systems/trinity/module/actor/trinity-actor';

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
    let skilPart = dataset.skillvalue || 0;
    console.log(dataset.attrvalue);
    let attrPart = dataset.attrvalue || 0;
    console.log(attrPart);
    let dicePart = skilPart+attrPart;
    let explPart = dataset.explode || 10;
    let succPart = dataset.successvalue || 7;
    let enhaPart = dataset.enhancements || 0;
    let nscaPart = dataset.narrascale || 1;
    let dscaPart = dataset.dramascale || 1;

    let rollFormula = `${dicePart}d10x${explPart}cs>=${succPart}`;
    console.log(rollFormula);
//  let rollFormula = "(@attributes.{{key}}.value)d10x10cs>=8"

    // Roll Attribute by itself if no skill supplied
    if (dataset.attrvalue && !dataset.skillvalue) {
      console.log("Attrib only roll function triggered");
      let roll = new Roll(rollFormula);
      let label = dataset.attrname ? `Rolling ${dataset.attrname}` : '';
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
Values pulled from HTML data-* come through as lowercase
.skillvalue = Skill Value
.attrvalue = Attribute value
.explode = Explode Value (eg: 9-again)
.successvalue = Success Value (7 or 8)
.enhancements = Enhancement(s)
.narrascale = Narrative Scale Difference
.dramascale = Dramatic Scale Difference

For the roll description
.skillname = Skill Name
.attrname = Attribute Name
.attrarena = Attribute Arena
.attrapproach = Attribute Approach
Idea: import the top level skill / attrib date that will include all of these

For much later, for spending successes:
.complications
.stunts

*/
