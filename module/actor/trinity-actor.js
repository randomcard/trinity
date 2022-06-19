import { setHealth } from "./health.js"; // Overview App
import { modelSetup } from "./health.js"; // Overview App

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TrinityActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
   static async create(data, options) {

     // Populate Health Details, if empty
     // if ( typeof data.data.health.details === "undefined" || Object.keys(data.data.health.details).length === 0) {
     if ( typeof data.data === "undefined") {
       let modelName = game.settings.get("trinity", "healthModel");
       let ifNPC = (data.type === "TrinityNPC") ? "NPC" : "";
       let model = modelSetup(`${modelName}${ifNPC}`); // Expand this for NPCs
       data.data = {
         health : {
           details : JSON.parse(JSON.stringify(model))
         }
       }
     }

     // If the created actor has items (only applicable to duplicated actors) bypass the new actor creation logic
     if (data.items || game.settings.get("trinity", "basicItems") === false)
     {
       return super.create(data, options);
     }

     // Initialize empty items
     data.items = [];

     // Get items to be added
     let npcAttribs = await game.packs.get('trinity.basic-npc-setup').getDocuments();
     let pcAttribs = await game.packs.get('trinity.basic-pc-setup').getDocuments();
     // let pcSkills = await game.packs.get('trinity.basic-pc-skills').getDocuments();

     // console.log("pcAttribs", pcAttribs);
     // console.log("this", this);

     data.token = {actorLink : true};
     if (data.type == "TrinityCharacter")
     {
       for (let i of Object.keys(pcAttribs) )
       {
         //await actor.createEmbeddedDocuments("Item", [pcAttribs[i].data])
         // data.items.push(pcAttribs[i]);
         data.items.push(game.items.fromCompendium(pcAttribs[i]));
       }
       /*
       for (let i of Object.keys(pcSkills) )
       {
         // data.items.push(pcSkills[i]);
         data.items.push(game.items.fromCompendium(pcSkills[i]));
       } */
       super.create(data, options); // Follow through the the rest of the Actor creation process upstream
     }
     else if ( data.type == "TrinityNPC" ) {
       for (let i of Object.keys(npcAttribs) ) // Add basic skills
       {
         // data.items.push(npcAttribs[i]);
         data.items.push(game.items.fromCompendium(npcAttribs[i]));
       }
       super.create(data, options); // Follow through the the rest of the Actor creation process upstream
     }

 }


  async prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Default roll Settings:
    actorData.data.rollSettings.succ.value = actorData.data.rollSettings.succ.value || game.settings.get("trinity", "defaultSuccess");
    // actorData.data.rollSettings.fail.value = actorData.data.rollSettings.fail.value || game.settings.get("trinity", "defaultFail");
    actorData.data.rollSettings.expl.value = actorData.data.rollSettings.expl.value || game.settings.get("trinity", "defaultExplode");
    actorData.data.rollSettings.nsca.value = actorData.data.rollSettings.nsca.value || game.settings.get("trinity", "defaultNScale");
    actorData.data.rollSettings.dsca.value = actorData.data.rollSettings.dsca.value || game.settings.get("trinity", "defaultDScale");

    // Health Setup
    if ( actorData.data.health.details ) {
      await setHealth(actorData);
      // setHealth doesn't trigger a redraw of token bars - this does it manually
      if ( typeof canvas.tokens !== "undefined" ) {
        let token = canvas.tokens.placeables.find(i=>i.data.actorId === this.data._id );
        if ( typeof token !== "undefined" ) { token.drawBars(); }
      }
    } else {console.log("NO HEALTH DETAILS");}

    // Mage Support: Quintessence & Paradox
    if (data.flags.isMage) {
      //console.log("QP adjust 1", actorData.qAdjust);
      //if (typeof actorData.qAdjust === "undefined" ) {actorData.qAdjust = 0};
      console.log("QP start", data.quintessence.value);
      /*
      while (data.quintessence.value > 20-data.paradox.value) {
        --data.quintessence.value;
      }
      */
      // if (data.quintessence.value + actorData.qAdjust > 20-data.paradox.value) {
      if (data.quintessence.value > 20-data.paradox.value) {
        console.log("QP Quin over Para", data.quintessence.value, data.paradox.value);
        // actorData.qAdjust = data.quintessence.value - (20 - data.paradox.value);
        // console.log("QP adjust 2", actorData.qAdjust);
        data.quintessence.value = 20-data.paradox.value;
        //data.quintessence.value = 20-qpAdjust;
      }
      // data.quintessence.value -= actorData.qAdjust;

      console.log("QP mid 1", data.quintessence.value);
      if (data.quintessence.value < 0) {data.quintessence.value = 0}
      if (data.paradox.value < 0) {data.paradox.value = 0}
      if (data.quintessence.value > 20) {data.quintessence.value = 20}
      if (data.paradox.value > 20) {data.paradox.value = 20}
      console.log("QP end", data.quintessence.value);

      const qpTracker = [];

      for (var i = 0; i < 20; i++) {
        if (data.quintessence.value >= i+1) { qpTracker[i] = "Q" } else { qpTracker[i] = "" }
        if (data.paradox.value >= 20-i) { qpTracker[i] = "P" }
      }

      data.qpTracker = qpTracker;
    }

    // Default Token Bar setting
    // actorData.token.bar1 = actorData.token.bar1 || {"attribute" : "health.summary"};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'TrinityCharacter') this._prepareTrinityCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */

  _prepareTrinityCharacterData(actorData) {
    const data = actorData.data;

    // Make modifications to data here. For example:

    // Loop through ability scores, and add their modifiers to our sheet output.
    // for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier using d20 rules.
      // ability.mod = Math.floor((ability.value - 10) / 2);
    }
  }

// }
