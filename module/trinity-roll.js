// import { TrinityActorSheet } from 'systems/trinity/module/actor/trinity-actor';
import { TrinityRollPrompt } from "/systems/trinity/module/trinity-roll-prompt.js";

export class TrinityRoll {

  // Problem??
  // template = template || 'systems/trinity/templates/roll-prompt.html';


// Main Roll function
// Takes event from click (which will have the attribute / skill / specialty name or ID),
// and references that with a target Actor
  static async tRoll(event, targetActor) {

// Declare variables
    const element = event.currentTarget;
    const dataset = element.dataset;
    var targetAttr = [];
    var targetSkill = [];

// STEP 1: Check for available info from actor and process it.
// Actor info
/*    if (typeof targetActor !== 'undefined' ) {
      targetAttr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === dataset.attrname);
      // targetAttr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === dataset.attrname);
      console.log("Found Attribute Info:");
      console.log(targetAttr);
      // If the dataset has dataset.attrname, use it get full actor attrib data
    }
*/

// Attribute info
    if (typeof dataset.attrname !== 'undefined' && dataset.attrname !== null) {
      targetAttr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === dataset.attrname);
      // targetAttr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === dataset.attrname);
      console.log("Found Attribute Info:");
      console.log(targetAttr);
      // If the dataset has dataset.attrname, use it get full actor attrib data
    }

// Skill info
    if (typeof dataset.skillid !== 'undefined' && dataset.skillid !== null) {
      targetSkill = Object.values(targetActor.data.items).find(skill => skill._id === dataset.skillid);
      console.log("Found Skill Info:");
      console.log(targetSkill);
      // If the dataset has dataset.skillid, use it get full item skill data
    }

// STEP 2: Set defaults, and overwriting with data found in step 1.
    let attrPart = targetAttr.value || 0;
    let skilPart = targetSkill.value || 0;
    let dicePart = skilPart+attrPart;
    let explPart = dataset.explode || 10;
    let succPart = dataset.successvalue || 8;
    let enhaPart = dataset.enhancements || 0;
    // narrative scale must be minimum 1
    let nscaPart = dataset.narrascale || 1;
    // measure dramatic scale in difference (i.e. a scale 1 person vs. a scale 1 obstacle is 0)
    let dscaPart = dataset.dramascale || 0;

    var rollParts = {
      attr : attrPart,
      skil : skilPart,
      dice : skilPart+attrPart,
      expl : explPart,
      succ : succPart,
      enha : enhaPart,
      nsca : nscaPart,
      dsca : dscaPart
    };

    console.log("rollParts Object:");
    console.log(rollParts);


// STEP 3: Open Prompt with new defaults.
//original, before attempting to change it to a promise:    rollParts = TrinityRollPrompt.tRollPrompt(rollParts);
    rollParts = await new Promise(resolve => {resolve(TrinityRollPrompt.tRollPrompt(rollParts, targetActor))});
    console.log("rollParts after prompt resolves:");
    console.log(rollParts);

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

*/

//  let rollFormula = `${dicePart}d10x${explPart}cs>=${succPart}`;
    let rollFormula = `(((${rollParts.attr}+${rollParts.skil})d10x${rollParts.expl}cs>=${rollParts.succ})+(${rollParts.enha}+${rollParts.dsca}))*${rollParts.nsca}`;
    console.log(rollFormula);
//  let rollFormula = "(@attributes.{{key}}.value)d10x10cs>=8"

    // Roll Attribute by itself if no skill supplied
    if (dataset.attrname && !dataset.skillid) {
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
