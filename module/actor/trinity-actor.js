/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TrinityActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
   static async create(data, options) {
     // If the created actor has items (only applicable to duplicated actors) bypass the new actor creation logic
     if (data.items)
     {
       return super.create(data, options);
     }

     // Initialize empty items
     data.items = [];

     // Get items to be added
     let npcAttribs = game.packs.get('trinity.basic-npc-attributes').getDocuments();
     let pcAttribs = game.packs.get('trinity.basic-pc-attributes').getDocuments();
     let pcSkills = game.packs.get('trinity.basic-pc-skills').getDocuments();
     console.log("pcAttribs", pcAttribs)

     if (data.type == "TrinityCharacter")
     {
       for (let i of Object.keys(pcAttribs) )
       {
         data.items.push(pcAttribs[i]);
       }
       for (let i of Object.keys(pcSkills) )
       {
         data.items.push(pcSkills[i]);
       }
       super.create(data, options); // Follow through the the rest of the Actor creation process upstream
     }
     else if ( data.type == "TrinityNPC" ) {
       for (let i of Object.keys(npcAttribs) ) // Add basic skills
       {
         data.items.push(npcAttribs[i]);
       }
       super.create(data, options); // Follow through the the rest of the Actor creation process upstream
     }
 }


  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

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
