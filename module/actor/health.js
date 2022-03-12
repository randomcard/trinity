export function setHealth(actorData) {
  // let actor = game.actors.get(actorData._id);
  // console.log("setHealth Start", actorData, actorData.data.flags.isHealthModelUpdated);

  // Create default models, if not already present
  // if ( Object.keys(actorData.data.health.models.modelT).length === 0 ) { actorData.data.health.models.modelT = modelSetup("modelT"); }
  // if ( Object.keys(actorData.data.health.models.modelS).length === 0 ) { actorData.data.health.models.modelS = modelSetup("modelS"); }

  // Set health, using model determined by game.setting
  /*
  if ( actorData.data.flags.isHealthModelUpdated === false ) {
    let modelName = game.settings.get("trinity", "healthModel");
    console.log("Health Model Flag False, Resetting Details/Model:", actorData.data.health.models[modelName], actorData.data.flags.isHealthModelUpdated);
    actorData.data.health.details = JSON.parse(JSON.stringify(actorData.data.health.models[modelName])); // JSON Deep Copy
    // actor.update({ "data.flags.isHealthModelUpdated": true });
    actorData.data.flags.isHealthModelUpdated = true;
    console.log("Flag Handling End", actorData, actorData.data.flags.isHealthModelUpdated);
  }
  */
  // if (game.settings.get("trinity", "healthModel") === "modelT") {actorData.data.health.details = actorData.data.health.models.modelT;}
  // if (game.settings.get("trinity", "healthModel") === "modelS") {actorData.data.health.details = actorData.data.health.models.modelS;}

  // update # of states based on # of boxes
  /*
  for (let i in actorData.data.health.details) {
    if (i.boxes < 0 ) { i.boxes = 0; }
    while ( i.boxes > i.states.length ) { i.states.push(0); }
    while ( i.boxes < i.states.length ) { i.states.length = i.boxes; }
  }
  */

  for (let e of Object.keys(actorData.data.health.details)) {
    let i = actorData.data.health.details[e];
    if (i.boxes < 0 ) { i.boxes = 0; }
    while ( i.boxes > i.states.length ) { i.states.push(0); }
    while ( i.boxes < i.states.length ) { i.states.length = i.boxes; }
  }

  // Model T:
  // Assign states by injury item look-up & add extra states when needed
  if (game.settings.get("trinity", "healthModel") === "modelT") {
    let injuries = actorData.items.filter(i => i.data.data.flags.isInjury);
    for (let i of injuries) {
      let assigned = false;
      let boxGroup = Object.values(actorData.data.health.details).find(b => (b.type === i.data.data.injury.type)) ;
      if (typeof boxGroup !== 'undefined' ) {
        for (let [index, state] of boxGroup.states.entries()) {
          if (state === 0) {
            boxGroup.states[index] = 3;
            assigned = true; break;
          }
        }
        if ( !assigned ) { boxGroup.states.push(4); }
      }
    }
  }

  // Set health value/max for token bars, using # of Boxes,
  // and set the highest type penalty/status for display and roller use
  let totalBoxes = 0;
  let filledBoxes = 0;
  let topName = "";
  let topPenalty = null;
  let topType = 0;

  // for (let i in actorData.data.health.details) {
  for (let e of Object.keys(actorData.data.health.details)) {
    let i = actorData.data.health.details[e];
    totalBoxes += i.boxes;
    for (let s of i.states) {
      if (s > 0) {
        ++filledBoxes;
        if (i.type > topType) {
          topName = i.name;
          topPenalty = i.penalty;
          topType = i.type;
        }
      }
    }
  }

  actorData.data.health.summary.max = totalBoxes;
  actorData.data.health.summary.value = totalBoxes - filledBoxes;
  actorData.data.health.summary.status = topName;
  actorData.data.health.summary.penalty = topPenalty;

}

/*
Default Health Model(s) Creation
Penalty: Positive means a complication of that value will be created, negative is a reduction in dice pools
Boxes: # of health boxes of that type
States: The state of each health box:
  0 - Healthy/Unfilled
  1 - Non-Leathal (Model S)
  2 - Leathal (Model S)
  3 - Injured (Model T) / Aggravated (Model S)
  4 - Excess Damage (Model T)
*/
export function modelSetup(model) {

  // Model T - Trinity Continuum
  let modelT = {
    armor : {
      name : "Armor",
      penalty : 0,
      boxes : 0,
      states : [],
      type : 1
    },
    bruised : {
      name : "Bruised",
      penalty : 1,
      boxes : 1,
      states : [0],
      type : 2
    },
    injured : {
      name : "Injured",
      penalty : 2,
      boxes : 1,
      states : [0],
      type : 3
    },
    maimed : {
      name : "Maimed",
      penalty : 4,
      boxes : 1,
      states : [0],
      type : 4
    },
    out : {
      name : "Taken Out",
      penalty : 0,
      boxes : 1,
      states : [0],
      type : 5
    }
  };

  // ModelT NPC
  let modelTNPC = {
    health : {
      name : "Health",
      penalty : 0,
      boxes : 0,
      states : [],
      type : 1
    }
  };


  // Model S - Storyteller / WoD
  let modelS = {
    bruised : {
      name : "Bruised (-0)",
      penalty : 0,
      boxes : 1,
      states : [0],
      type : 1
    },
    hurt : {
      name : "Hurt (-1)",
      penalty : -1,
      boxes : 1,
      states : [0],
      type : 2
    },
    injured : {
      name : "Injured (-1)",
      penalty : -1,
      boxes : 1,
      states : [0],
      type : 3
    },
    wounded : {
      name : "Wounded (-2)",
      penalty : -2,
      boxes : 1,
      states : [0],
      type : 4
    },
    mauled : {
      name : "Mauled (-2)",
      penalty : -2,
      boxes : 1,
      states : [0],
      type : 5
    },
    crippled : {
      name : "Crippled (-5)",
      penalty : -5,
      boxes : 1,
      states : [0],
      type : 6
    },
    incap : {
      name : "Incapacitated",
      penalty : 0,
      boxes : 1,
      states : [0],
      type : 7
    }
  };

  if (model === "modelT") {return modelT;}
  if (model === "modelTNPC") {return modelTNPC;}
  if (model === "modelS") {return modelS;}

}
