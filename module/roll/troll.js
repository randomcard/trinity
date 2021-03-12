export class TRoll extends Roll {

  constructor(formula, data={}, enh) {
    super(formula, data={});
    console.log("In constructor:");
    console.log(enh);
    this.enh = enh;
  }

  evaluate({minimize=false, maximize=false}={}) {

    console.log("CUSTOM tROLL CLASS - tRoll.evaluate");

    if ( this._rolled ) throw new Error("This Roll object has already been rolled.");

    // Step 1 - evaluate any inner Rolls and recompile the formula
    let hasInner = false;
    this.terms = this.terms.map((t, i, terms) => {
      if ( t instanceof Roll ) {
        hasInner = true;
        t.evaluate({minimize, maximize});
        this._dice = this._dice.concat(t.dice);
        const priorMath = (i > 0) && (terms[i-1].split(" ").pop() in Math);
        return priorMath ? `(${t.total})` : String(t.total);
      }
      return t;
    });

    // Step 2 - if inner rolls occurred, re-compile the formula and re-identify terms
    if ( hasInner ) {
      const formula = this.constructor.cleanFormula(this.terms);
      this.terms = this._identifyTerms(formula);
    }

    // Step 3 - evaluate any remaining terms
    this.results = this.terms.map(term => {
      if ( term.evaluate ) return term.evaluate({minimize, maximize}).total;
      else return term;
    });
    console.log("TRoll.evaluate Step 3: this.results");
    console.log(this.results);

    // Step 4 - safely evaluate the final total
    const total = this._safeEval(this.results.join(" "));
    if ( !Number.isNumeric(total) ) {
      throw new Error(game.i18n.format("DICE.ErrorNonNumeric", {formula: this.formula}));
    }
    console.log("TRoll.evaluate Step 4: total");
    console.log(total);
    // MY TOTALLY HACKY HACK - NOT AT ALL THE RIGHT WAY TO DO This
    if (total >= 1) {
      total = total + this.enh;
    }
    // END OF HACKY HACK

    // Store final outputs
    this._total = total;
    this._rolled = true;
    return this;
  }
}
