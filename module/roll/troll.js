export class TRoll extends Roll {

  constructor(formula, data={}, enh) {
    super(formula, data={});
    this.enh = enh;
  }

  _evaluateTotal() {
      const expression = this.terms.map(t => t.total).join(" ");
      var total = Roll.safeEval(expression);
      if ( !Number.isNumeric(total) ) {
        throw new Error(game.i18n.format("DICE.ErrorNonNumeric", {formula: this.formula}));
      }
      // MY TOTALLY HACKY HACK - NOT AT ALL THE RIGHT WAY TO DO THIS
      if (total >= 1) {
        total = total + this.enh;
      }
      return total;
    }

}
