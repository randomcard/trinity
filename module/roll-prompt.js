// import { TrinityActorSheet } from 'systems/trinity/module/actor/trinity-actor';

export class RollPrompt {

  // Problem??
  // template = template || 'systems/trinity/templates/roll-prompt.html';


// Main Roll function
// Takes event from click (which will have the attribute / skill / specialty name or ID),
// and references that with a target Actor
  static async tRoll(event, targetActor) {

    const element = event.currentTarget;
    const dataset = element.dataset;

// STEP 1: Check for available info and process it.
// STEP 1A: Attribute info
    if (typeof dataset.attrname !== 'undefined' && dataset.attrname !== null) {
      let targetAttr = Object.values(targetActor.data.data.attributes).filter(attribute => attribute.name === dataset.attrname);
      // If the dataset has dataset.attrname, use it get full actor attrib data
    }

// STEP 1B: Skill info
    if (typeof dataset.skillid !== 'undefined' && dataset.skillid !== null) {
      let targetSkill = Object.values(targetActor.data.items).filter(skill => skill._id === dataset.skillid);
      // If the dataset has dataset.skillid, use it get full item skill data
    }

// STEP 2: Set defaults, and overwriting with data found in step 1.
    let attrPart = targetAttr[0].value || 0;
    let skilPart = targetSkill[0].value || 0;
    let dicePart = skilPart+attrPart;
    let explPart = dataset.explode || 10;
    let succPart = dataset.successvalue || 7;
    let enhaPart = dataset.enhancements || 0;
    // narrative scale must be minimum 1
    let nscaPart = dataset.narrascale || 1;
    // measure dramatic scale in difference (i.e. a scale 1 person vs. a scale 1 obstacle is 0)
    let dscaPart = dataset.dramascale || 0;

// STEP 3: Open Prompt with new defaults.







/**

    console.log("Debug in the tRoll function");
//    console.log(event);
//    console.log(element);
    console.log(dataset);

    // Test Section: Pull needed info from just attr/skill name and target actor
    console.log("Target Actor");
    console.log(targetActor);
    console.log("dataset.attr");
    console.log(dataset.attr);
    console.log(Object.values(targetActor.data.data.attributes));
//    console.log(Object.values(users).filter(user => user.user_id === 1));
    let targetAttr = Object.values(targetActor.data.data.attributes).filter(attribute => attribute.name === dataset.attrname);
//    let targetAttr = targetActor.data.data.attributes.filter(attribute => attributes.name === dataset.attr);
//    const targetAttr = targetActor.data.data.attributes.find(a => a.name === dataset.attr);
    console.log(targetAttr[0]);

//    const targetSkill = targetActor.data.items.find(i => i._id === dataset.skillid);
//    console.log(targetSkill || 'No targetSkill');

    // Roll Formula
    // Get info, if available, defaults if not
    let skilPart = dataset.skillvalue || 0;
    console.log(dataset.attrvalue);
//    let attrPart = dataset.attrvalue || 0;
    let attrPart = targetAttr[0].value || 0;
    console.log(attrPart);
    let dicePart = skilPart+attrPart;
    let explPart = dataset.explode || 10;
    let succPart = dataset.successvalue || 7;
    let enhaPart = dataset.enhancements || 0;
    // narrative scale must be minimum 1
    let nscaPart = dataset.narrascale || 1;
    // measure dramatic scale in difference (i.e. a scale 1 person vs. a scale 1 obstacle is 0)
    let dscaPart = dataset.dramascale || 0;

*//

//  let rollFormula = `${dicePart}d10x${explPart}cs>=${succPart}`;
    let rollFormula = `((${dicePart}d10x${explPart}cs>=${succPart})+(${enhaPart}+${dscaPart}))*${nscaPart}`;
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
