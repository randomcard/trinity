// Import Modules
// import { BasicActor } from "./actor/actor.js";
// import { BasicActorSheet } from "./actor/actor-sheet.js";
import { TrinityActor } from "./actor/trinity-actor.js";
import { TrinityActorSheet } from "./actor/trinity-actor-sheet.js";
import { TrinityItem } from "./item/item.js";
import { TrinityItemSheet } from "./item/item-sheet.js";
import { TrinityRoll } from "./trinity-roll.js";
import { TRoll } from "./roll/troll.js";

Hooks.once('init', async function() {

  game.trinity = {
    TrinityActor,
    TrinityItem,
    rollItemMacro,
    TRoll
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = TrinityActor;
  CONFIG.Item.entityClass = TrinityItem;

  // Define custom Roll class
  CONFIG.Dice.rolls.unshift(TRoll);

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("trinity", TrinityActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("trinity", TrinityItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });

/* Not used now, fixed template
  Handlebars.registerHelper('varToString', function(v) {
    return Object.keys({v})[0];
  });
*/

  Handlebars.registerHelper('toDots', function(n) {
    let dots = '';
    let filled = '<i class="fa fa-circle"></i>';
    let empty = '<i class="far fa-circle"></i>';
    for (let i = 0; i < Math.max(n, 5); i++) {
      if (i === 5) { dots += ' '; }
      if (i < n) { dots += filled; }
        else {dots += empty;}
		}
    return dots;
	});

  Handlebars.registerHelper('toHealthBoxes', function(h) {
    let boxes = '';
    let extraBox = '<i class="fas fa-plus-square"></i>';
    let filledBox = '<i class="fas fa-square"></i>';
    let emptyBox = '<i class="far fa-square"></i>';
    for (let i = 0; i < h.filled; i++) { boxes += filledBox; }
    for (let i = 0; i < h.empty; i++) { boxes += emptyBox; }
    for (let i = 0; i < h.extra; i++) { boxes += extraBox; }
    return boxes;
	});

  Handlebars.registerHelper('toFilledBoxes', function(n) {
    let boxes = '';
    let filledBox = '<i class="fas fa-square"></i>';
    for (let i = 0; i < n; i++) {
      if (i < n) { boxes += filledBox; }
		}
    return boxes;
	});

  Handlebars.registerHelper('toExtraBoxes', function(n) {
    let boxes = '';
    let filledBox = '<i class="fas fa-plus-square"></i>';
    for (let i = 0; i < n; i++) {
      if (i < n) { boxes += filledBox; }
		}
    return boxes;
	});

  Handlebars.registerHelper('toEmptyBoxes', function(n) {
    let boxes = '';
    let emptyBox = '<i class="far fa-square"></i>';
    for (let i = 0; i < n; i++) {
      if (i < n) { boxes += emptyBox; }
		}
    return boxes;
	});


});


/* -------------------------------------------- */
/*  Hooks                                       */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createTrinityMacro(data, slot));
  // Hook for roll dialog - perhaps better done with extening dialog class and using active listeners, but this seems earier for now:
/* Hook off
  Hooks.on('renderDialog', (dialog, html, data, input) => {
    if (dialog.data.id === "rdialog") {
      html.find(".attr").on('click', event => {
        console.log("Test: Attr Roller Hook");
        console.log(dialog);
        console.log(html);
        console.log(html[0]);
        console.log(html[1]);
        console.log(data);
        console.log(input);
      });
    }
  }); */


});

Hooks.once( "init", function() {
  loadTrinityTemplates();
});

// Templates:

async function loadTrinityTemplates()
{
  // register templates parts
  const templatePaths = [
    "systems/trinity/templates/actor/partials/full-data.html",
    "systems/trinity/templates/actor/partials/attributes.html",
    "systems/trinity/templates/actor/partials/healthboxes.html",
    "systems/trinity/templates/actor/partials/skills.html",
    "systems/trinity/templates/actor/partials/conditions.html",
    "systems/trinity/templates/actor/partials/defense.html",
    "systems/trinity/templates/item/partials/complication-flag.html",
    "systems/trinity/templates/item/partials/enhancement-flag.html",
    "systems/trinity/templates/item/partials/injury-flag.html",
    "systems/trinity/templates/item/partials/dots-flag.html"
  ];
  return loadTemplates( templatePaths );
}

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createTrinityMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.trinity.rollItemMacro("${item.name}");`;
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "trinity.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}
