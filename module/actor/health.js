export function setHealth(actorData) {

  actorData.data.healthModels.modelT = actorData.data.healthModels.modelT || this._modelSetup("modelT");
  actorData.data.healthModels.modelS = actorData.data.healthModels.modelS || this._modelSetup("modelS");

  if (game.settings.get("trinity", "healthModel") === "modelT") {actorData.data.health = actorData.data.healthModels.modelT;}
  if (game.settings.get("trinity", "healthModel") === "modelS") {actorData.data.health = actorData.data.healthModels.modelS;}

  /*
  Default Health Model(s) Creation
  Penalty: Positive means a complication of that value will be created, negative is a reduction in dice pools
  Boxes: # of health boxes of that type
  States: The state of each health box:
    0 - Healthy/Unfilled
    1 - Non-Leathal (Model S)
    2 - Leathal (Model S)
    3 - Injured (Model T) / Aggravated (Model S)
  */
  _modelSetup(model) {

    // Model T - Trinity Continuum
    let modelT = [
      {
        name : "Armor",
        penalty : 0,
        boxes : 0,
        states : [],
        order : 1
      },
      {
        name : "Bruised",
        penalty : 1,
        boxes : 1,
        states : [0],
        order : 2
      },
      {
        name : "Injured",
        penalty : 2,
        boxes : 1,
        states : [0],
        order : 3
      },
      {
        name : "Maimed",
        penalty : 4,
        boxes : 1,
        states : [0],
        order : 4
      },
      {
        name : "Taken Out",
        penalty : 0,
        boxes : 1,
        states : [0],
        order : 5
      }
    ];

    // Model S - Storyteller / WoD
    let modelT = [
      {
        name : "Bruised (-0)",
        penalty : 0,
        boxes : 1,
        states : [0],
        order : 1
      },
      {
        name : "Hurt (-1)",
        penalty : -1,
        boxes : 1,
        states : [0],
        order : 2
      },
      {
        name : "Injured (-1)",
        penalty : -1,
        boxes : 1,
        states : [0],
        order : 3
      },
      {
        name : "Wounded (-2)",
        penalty : -2,
        boxes : 1,
        states : [0],
        order : 4
      },
      {
        name : "Mauled (-2)",
        penalty : -2,
        boxes : 1,
        states : [0],
        order : 5
      },
      {
        name : "Crippled (-5)",
        penalty : -5,
        boxes : 1,
        states : [0],
        order : 6
      },
      {
        name : "Incapacitated",
        penalty : 0,
        boxes : 1,
        states : [0],
        order : 7
      }
    ];

    if (model === "modelT") {return modelT;}
    if (model === "modelS") {return modelS;}

  }

}
