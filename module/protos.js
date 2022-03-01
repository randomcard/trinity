export const pickedElementsProto = {
  attr : {
    name : "No Attribute Selected",
    value : 0
  },
  skil : {
    name : "No Skill Selected",
    value : 0
  },
  // Eventually, change 'value' to be a function that loops through item IDs that are attached to PickedElements
  enha : {
    name : "No Enhancements Selected",
    value : 0
  },
  expl : {
    name : "Explode Threshold",
    value : 10
  },
  succ : {
    name : "Success Threshold",
    value : 8
  },
  nsca : {
    name : "Narrative Scale (Absolute)",
    value : 1
  },
  dsca : {
    name : "Dramatic Scale (Difference)",
    value : 0
  },
  init : {
    name : "Initiative Roll",
    value : false
  }
};


export const rollDataTemplate = {
  name : "Trinity Roll",
  // id : "",
  get flavor() {
    let text = "";
    for (let d of Object.keys(this.dice)) {
      text += this.dice[d].value + "●" + this.dice[d].name + " "; // Expand this for better Flavortext
    }
    for (let e of Object.keys(this.enha)) {
      text += "+" + this.enha[e].value + "e " + this.enha[e].name + " "; // Expand this for better Flavortext
    }
    return text;
  },
  desc : "",
  formula : "", // use Getter to compute this automatically
  dice : {
    /*
    diceSourceID :{
      value
      name
      SourceType
      SourceItemID
    }
    */
  },
  enha : {
    /*
    enhaSourceID :{
      value
      name
      SourceType
      SourceItemID
    }
    */
  },
  items : {},
  get diceTotal() {
    let total = 0;
    for (let d of Object.keys(this.dice)) {
      total = total + this.dice[d].value;
    }
    return total;
  },
  get enhaTotal() {
    let total = 0;
    for (let e of Object.keys(this.enha)) {
      total = total + this.enha[e].value;
    }
    return total;
  },
  settings : {
    expl : 10,
    succ : 8,
    nsca : 1, // Narrative Scale (Absolute)
    dsca : 0, // Dramatic Scale (Difference)
    init : false // For Compatibility
  }
};
