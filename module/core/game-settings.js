import { OverviewApp } from "../overview/overview.js"; // Overview App
import { modelSetup } from "../actor/health.js"; // Set up Health Model

export function gameSettings() {

// World settings
// Register a world setting

game.settings.register("trinity", "basicItems", {
  name: "New Characters Get Basic Items",
  hint: `If enabled, new actors will get the basic items from the "Basic" compendiums. Disable for homebrews or finer control.`,
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Boolean,
  default: true,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "defaultSuccess", {
  name: "Success Threshold",
  hint: "Dice with this result or higher are counted as successes. (New actor default, can be overriden/adjusted by actor or roll settings.)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 8,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "defaultExplode", {
  name: "Explode Threshold",
  hint: "Dice with this result or higher are rerolled. (New actor default, can be overriden/adjusted by actor or roll settings.)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 10,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "defaultNScale", {
  name: "Narrative Scale (Absolute)",
  hint: "A multiplier to successes. (New actor default, can be overriden/adjusted by actor or roll settings.)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 1,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "defaultDScale", {
  name: "Dramatic Scale (Difference)",
  hint: "Additional enhancements. (New actor default, can be overriden/adjusted by actor or roll settings.)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 0,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "defaultFail", {
  name: "Fail Threshold",
  hint: "Dice with this result or lower are counted as fails, and deduct from successes. (Can be enabled, but not adjusted, on a per roll basis in roll settings.)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 1,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "defaultDouble", {
  name: "Double Success Threshold",
  hint: "Dice with this result or higher will add an additional success to the total. (Can be enabled, but not adjusted, on a per roll basis in roll settings.)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 10,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "healthModel", {
  name: "Health Model",
  hint: "Choose between standard and non-standard health models. Changing this may cause the actor to lose any adjustments (like added health boxes, or damage).",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: String,
  choices: {           // If choices are defined, the resulting setting will be a select menu
    "modelT": "Trinity Continuum Standard",
    "modelS": "Storyteller/WoD"
  },
  default: "modelT",        // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log("Health Model Changed");
    game.actors.forEach(async (actor, i) => {
      // console.log("Changing Health Model on Actor", actor.data.name);
      // item.update({ "data.flags.isHealthModelUpdated": false });
      let ifNPC = (actor.data.type === "TrinityNPC") ? "NPC" : "";
      let model = modelSetup(`${value}${ifNPC}`); // Expand this for NPCs
      // let model = modelSetup(value); // Expand this for NPCs

      // console.log("Health Model Flag False, Resetting Details/Model:", actorData.data.health.models[modelName], actorData.data.flags.isHealthModelUpdated);
      // actorData.data.health.details = JSON.parse(JSON.stringify(actorData.data.health.models[modelName])); // JSON Deep Copy
      // item.update({ "data.health.details": JSON.parse(JSON.stringify(model)) }, { recursive: false, diff: false }); // Is a deep copy needed here?
      // item.update({ "data.health.details": JSON.parse(JSON.stringify(model)) }, { recursive: false }); // Is a deep copy needed here?
      await actor.update({ "data.health.-=details": null });
      await actor.update({ "data.health.details": JSON.parse(JSON.stringify(model)) }); // Is a deep copy needed here?
      // console.log("Adding Health Model:", JSON.parse(JSON.stringify(model)) );
      // actor.update({ "data.flags.isHealthModelUpdated": true });


    });
  }
});

// Skill Sub-Types
game.settings.register("trinity", "useSkillSubTypes", {
  name: "Skill Sub-Types",
  hint: "Assign & Sort skills by sub-type. After saving this change, reopen this settings window to see specific subtypes. Any open actor sheets should be closed & reopened. (Homebrew)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Boolean,
  default: false,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value);
    _skillTypeRegister(value);
  }
});

function _skillTypeRegister(arg) {
game.settings.register("trinity", "skillSubTypes", {
  name: "Skill Subtypes",
  hint: 'Add custom Skill subtypes. Format: ["Subtype1","Subtype2","Subtype3"]',
  scope: "world",      // This specifies a world-level setting
  config: arg,        // This specifies that the setting appears in the configuration view
  type: Array,
  default: ["Talent","Skill","Knowledge"],         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log("Settings - skillSubTypes Changed:", value);
  }
});
}
_skillTypeRegister(game.settings.get("trinity", "useSkillSubTypes"));

// Momentum Settings - Viewed in Overview
game.settings.register("trinity", "momentum-max", {
  name: "Maximum Momentum",
  hint: "Maximum momentum, 3x number of players",
  scope: "world",      // This specifies a world-level setting
  config: false,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 3,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log("Settings - Max Momentum Changed:", value)
  }
});

game.settings.register("trinity", "momentum-current", {
  name: "Current Momentum",
  hint: "Current momentum, starts session at # of players",
  scope: "world",      // This specifies a world-level setting
  config: false,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 0,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log("Settings - Current Momentum Changed:", value)
  }
});

game.settings.register("trinity", "momentum-spent", {
  name: "Spent Momentum",
  hint: "Spent momentum",
  scope: "world",      // This specifies a world-level setting
  config: false,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 0,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log("Settings - Spent Momentum Changed:", value)
  }
});
// End World Settings

// Overview
let overview;
overview = new OverviewApp();
/**
 * Register settings
 */
 [
  {
    name: "EnablePlayerAccess",
    scope: "world",
    default: true,
    type: Boolean,
  },
].forEach((setting) => {
  let options = {
    name: "Overview Button Player Access", // game.i18n.localize(`party-overview.${setting.name}.Name`),
    hint: "Allows players to access the overview.", // game.i18n.localize(`party-overview.${setting.name}.Hint`),
    scope: setting.scope,
    config: true,
    default: setting.default,
    type: setting.type,
  };
  if (setting.choices) options.choices = setting.choices;
  game.settings.register("trinity", setting.name, options);
});
// Overview End

}
