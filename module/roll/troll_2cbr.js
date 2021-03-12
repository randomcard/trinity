export class TRoll {

  constructor(rollTitle, formula) {
    // (private) the resulting Roll() object from Foundry
    this._roll = null;

    // (private) a stack of mods to apply to the roll
    this.mods = [];

    // a name for the roll, used in the UI
    this.rollTitle = rollTitle || this.template;

    // this assumes exactly 1 term, "XdY", which is passed to Foundry's Roll()
    // any +A or -B terms are converted to mods
    this.formula = this._processFormula(formula);

    // the values of each face after a roll
    this.faces = [];

    // the result of the roll before applying mods or critical effects
    this.initialRoll = 0;

    // skip rolling a critical die, such as with death saves
    this.calculateCritical = true;
    
    // if a critical die was rolled, this is the stored result
    this.criticalRoll = 0;

    // the complete result of the roll after applying everything
    this.resultTotal = 0;

    // path to the right dialog box to pop up before rolling
    this.rollPrompt = "systems/cyberpunk-red-core/templates/dialog/rolls/cpr-verify-roll-base-prompt.hbs";

    // path to the roll card template for chat
    this.rollCard = "systems/cyberpunk-red-core/templates/chat/cpr-base-rollcard.hbs";
    LOGGER.log(`Created roll object`);
  }


}
