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


export const trinityRollDataTemplate = {
  name : "Trinity Roll",
  // id : "",
  get flavor() {
    let text = "";
    for (let d of this.dice) {
      text += d.value + "●" + d.name + " "; // Expand this for better Flavortext
    }
    for (let e of this.enha) {
      text += "+" + e.value + "e " + e.name + " "; // Expand this for better Flavortext
    }
    return text;
  },
  desc : "",
  formula : "", // use Getter to compute this automatically
  dice : {

    diceSourceID :{
      value
      name
      SourceType
      SourceItemID
    }

  },
  enha : {

    enhaSourceID :{
      value
      name
      SourceType
      SourceItemID
    }

  },
  get diceTotal() {
    let total = 0;
    for (let d of this.dice) {
      total = total + d.value;
    }
    return total;
  },
  get enhaTotal() {
    let total = 0;
    for (let e of this.enha) {
      total = total + e.value;
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
