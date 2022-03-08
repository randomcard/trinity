import { OverviewApp } from "../overview/overview.js"; // Overview App

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
  name: "Default Success Threshold",
  hint: "Dice with this result or higher are counted as successes. (New actor default, can be overriden by actor or roll settings.)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 8,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "defaultFail", {
  name: "Default Fail Threshold",
  hint: "Dice with this result or lower are counted as fails, and deduct from successes. (New actor default, can be overriden by actor or roll settings.)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 0,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "defaultExplode", {
  name: "Default Explode Threshold",
  hint: "Dice with this result or higher are rerolled. (New actor default, can be overriden by actor or roll settings.)",
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
  hint: "A multiplier to successes. (New actor default, can be overriden by actor or roll settings.)",
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
  hint: "Additional enhancements. (New actor default, can be overriden by actor or roll settings.)",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: Number,
  default: 0,         // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

game.settings.register("trinity", "healthModel", {
  name: "Health Model",
  hint: "Dice with the result or higher are counted as successes.",
  scope: "world",      // This specifies a world-level setting
  config: true,        // This specifies that the setting appears in the configuration view
  type: String,
  choices: {           // If choices are defined, the resulting setting will be a select menu
    "modelT": "Trinity Continuum Standard",
    "modelM": "Storyteller Standard"
  },
  default: "modelT",        // The default value for the setting
  onChange: value => { // A callback function which triggers when the setting is changed
    console.log(value)
  }
});

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
    name: "Overview Button - Player Access?", // game.i18n.localize(`party-overview.${setting.name}.Name`),
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
