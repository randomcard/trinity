// Import Modules
// import { BasicActor } from "./actor/actor.js";
// import { BasicActorSheet } from "./actor/actor-sheet.js";
import { TrinityActor } from "./actor/trinity-actor.js";
import { TrinityActorSheet } from "./actor/trinity-actor-sheet.js";
import { TrinityItem } from "./item/item.js";
import { TrinityItemSheet } from "./item/item-sheet.js";
import { trinityRoll } from "./trinity-roll.js";
import { TRoll } from "./roll/troll.js";
// import { OverviewApp } from "./overview/overview.js"; // Overview App
import { TrinityCombat } from "./combat/trinity-combat.js"; // Custom Combat Class
// import { loadTrinityTemplates } from "./core/templates.js"; // HTML Templates
import { handlebarHelpers } from "./core/handlebar-helpers.js"; // Handlebar Helpers
import { gameSettings } from "./core/game-settings.js"; // Game Settings
import { gameHooks } from "./core/hooks.js"; // Game Settings

// Init Hook
Hooks.once('init', async function() {

  game.trinity = {
    TrinityActor,
    TrinityItem,
    rollItemMacro,
    TRoll
  };

  gameSettings();

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2
  };

  // Define custom Entity classes
  // CONFIG.Actor.entityClass = TrinityActor;
  // CONFIG.Item.entityClass = TrinityItem;
  CONFIG.Actor.documentClass = TrinityActor;
  CONFIG.Item.documentClass = TrinityItem;
  CONFIG.Combat.documentClass = TrinityCombat;

  // Define custom Roll class
  CONFIG.Dice.rolls.unshift(TRoll);

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("trinity", TrinityActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("trinity", TrinityItemSheet, { makeDefault: true });

  handlebarHelpers();

});


/* -------------------------------------------- */
/*  Hooks                                       */
/* -------------------------------------------- */

gameHooks();
/*

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createTrinityMacro(data, slot));

});

// Enhancement roll modifiers:
// ae "add enhancement" ex: "ae5" will add 5 successes if any success are rolled
// csa "count successes again" ex: "csa>=9" will add 1 additional success on 9's and up. Use after "cs"
Hooks.on("init", () => {
    Die.MODIFIERS["ae"] = function addEnhancement(modifier) {
        const enhaValue = parseInt(modifier.match(/\d+/));
        var successCount = 0;
        if (!enhaValue || !Number.isNumeric(enhaValue)) return;
        for (var d = 0; d < this.results.length; d++) {
          if (this.results[d].success) { successCount += 1; }
        }
        if (successCount > 0) {
          this.results[0].count += enhaValue;
        }
    };
    Die.MODIFIERS["csa"] = function countSuccessAgain(modifier) {
        let rgx = /(?:csa)([<>=]+)?([0-9]+)?/i;
        let match = modifier.match(rgx);
        if ( !match ) return false;
        let [comparison, target] = match.slice(1);
        comparison = comparison || "=";
        target = parseInt(target) ?? this.faces;
        for ( let r of this.results ) {
          let success = null;
          switch ( comparison ) {
            case "=":  success = (r.result === target);
            case "<":  success = (r.result < target);
            case "<=": success = (r.result <= target);
            case ">":  success = (r.result > target);
            case ">=": success = (r.result >= target);
          };
          if (success) {r.count += 1;}
        }

    };
});

// Overview
Hooks.on("ready", () => {
  if (overview) overview.update();
  else overview = new OverviewApp();
});

Hooks.on("renderActorDirectory", (app, html, data) => {
  if (!game.user.isGM && !game.settings.get("overview", "EnablePlayerAccess"))
    return;

  let button = $(
    `<button id="overview-button" class="${game.system.id}">Party Overview</button>`
  );
  button.on("click", (e) => {
    overview.render(true);
  });

  $(html).find("header.directory-header").prepend(button);
});

Hooks.on("deleteActor", (actor, ...rest) => {
  if (actor.hasPlayerOwner) {
    overview.update();
    overview.render(false);
  }
});

Hooks.on("updateActor", (actor, ...rest) => {
  if (actor.hasPlayerOwner) {
    overview.update();
    overview.render(false);
  }
});

Hooks.on("createToken", (scene, sceneId, token, ...rest) => {
  // let actor = game.actors.entities.find((actor) => actor.id === token.actorId);
  let actor = game.actors.find((actor) => actor.id === token.actorId);
  if (actor && actor.hasPlayerOwner) {
    overview.update();
    overview.render(false);
  }
});

Hooks.on("deleteToken", (...rest) => {
  overview.update();
  overview.render(false);
});

Hooks.on("updateScene", (scene, changes, ...rest) => {
  if (changes.active) {
    // what a hack! the hook is fired when the scene switch is not yet activated, so we need
    // to wait a tiny bit. The combat tracker is rendered last, so the scene should be available
    Hooks.once("renderCombatTracker", (...rest) => {
      overview.update();
      overview.render(false);
    });
  }
});
// Overview End



Hooks.once( "init", function() {
  loadTrinityTemplates();
});
*/

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
