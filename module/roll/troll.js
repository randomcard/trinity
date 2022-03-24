export class TRoll extends Roll {

  constructor(formula, data={}, options={}, enh) {
    super(formula, data={}, options={});
  }

  async render({flavor, template="/systems/trinity/templates/chat/roll.html", isPrivate=false}={}) {

    // Check for botch
    console.log("_evaluateTotal", this);
    let successCount = 0;
    let oneCount = 0;
    for (var d = 0; d < this.dice[0].results.length; d++) {
      if (this.dice[0].results[d].success) { successCount += 1; }
      if (this.dice[0].results[d].result === 1) { oneCount += 1; }
    }
    let isBotch = (successCount < 1 && oneCount > 0);


    if ( !this._evaluated ) await this.evaluate({async: true});
    const chatData = {
      formula: isPrivate ? "???" : this._formula,
      flavor: isPrivate ? null : flavor,
      user: game.user.id,
      tooltip: isPrivate ? "" : await this.getTooltip(),
      total: isPrivate ? "?" : Math.round(this.total * 100) / 100,
      botch: isBotch
    };
    return renderTemplate(template, chatData);
  }

}
