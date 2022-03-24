import { loadTrinityTemplates } from "./templates.js"; // HTML Templates
import { createTrinityMacro } from "./macro-helpers.js";
import { rollItemMacro } from "./macro-helpers.js";
import { OverviewApp } from "../overview/overview.js"; // Overview App
// import { giveFocus } from "../combat/trinity-combat.js"; // Overview App
import { setFocusName } from "/systems/trinity/module/combat/focus-dialog.js";

export function gameHooks() {

  let overview;

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

  Hooks.on("getCombatTrackerEntryContext", (html, options) => {
    console.log("CombatTrackerEntryContext options", options);
    options.push(
      {
        name: "Give Focus",
        condition: true,
        icon: '<i class="fas fa-eye"></i>',
        callback: target => {
          // WFRP_Utility.displayStatus(game.combat.combatants.find(i => i._id == target.attr("data-combatant-id")).actor);
          // $(`#sidebar-tabs`).find(`.item[data-tab="chat"]`).click();
          if ( game.settings.get("trinity", "initGroup") ) {
            console.log("getCombatTrackerEntryContext hook fired");
            console.log(this);
            console.log(target);
            console.log(target[0].dataset.combatantId);
            let targetCombatant = target[0].dataset.combatantId;
            console.log(game.combat.data.combatants);
            let c = game.combat.data.combatants.get(targetCombatant);
            console.log(c);
            setFocusName(c);
          } else {
            ui.notifications.warn(`Enable Group Initiative in System Settings.`);
          }

        }
      })
  })


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

}
