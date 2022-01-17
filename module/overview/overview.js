const DISPLAY_MODE = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_HIDDEN: "SHOW_HIDDEN",
  SHOW_VISIBLE: "SHOW_VISIBLE",
};

const SIMPLE_SYTEMS = ['swade'];

export class OverviewApp extends Application {
  constructor(options) {
    super(options);

    this.hiddenActors = [];
    this.state = {};
    this.displayMode = DISPLAY_MODE.SHOW_VISIBLE;
    this.activeTab = "general";

  }


  update() {


/** Original
    console.log("Overview update (before), This:", this);
    if (typeof this.state.momentum === 'undefined') {
      console.log("this.state.momentum === 'undefined'");
      this.state.momentum = {};
      this.state.momentum.max = game.settings.get("trinity", "momentum-max");
      this.state.momentum.current = game.settings.get("trinity", "momentum-current");
      this.state.momentum.spent = game.settings.get("trinity", "momentum-spent");
    } else {
      console.log("this.state.momentum !== 'undefined'");
      if (this.state.momentum.max !== game.settings.get("trinity", "momentum-max")) {
        console.log("this.state.momentum.max !== game.settings");
        game.settings.set("trinity", "momentum-max", this.state.momentum.max);
      }
      if (this.state.momentum.current !== game.settings.get("trinity", "momentum-current")) {
        game.settings.set("trinity", "momentum-current", this.state.momentum.current);
      }
      if (this.state.momentum.spent !== game.settings.get("trinity", "momentum-spent")) {
        game.settings.set("trinity", "momentum-spent", this.state.momentum.spent);
      }
    }
    console.log("Overview update (after), This:", this);
**/

// NEW
console.log("Overview update (before), This:", this);
if (typeof this.state.momentum === 'undefined') {
  console.log("this.state.momentum === 'undefined'");
  this.state.momentum = {};
  this.state.momentum.max = game.settings.get("trinity", "momentum-max");
  this.state.momentum.current = game.settings.get("trinity", "momentum-current");
  this.state.momentum.spent = game.settings.get("trinity", "momentum-spent");
}
console.log("Overview update (after), This:", this);



    // let actors = game.actors.entities
    let actors = game.actors.contents
      .filter(a => a.hasPlayerOwner)
      .map(playerActor => playerActor.getActiveTokens())
      .flat(1)
      .map(token => token.actor);

    // remove duplicates if an actors has multiple tokens on scene
    actors = actors.reduce(
      (actors, actor) => (actors.map(a => a.id).includes(actor.id) ? actors : [...actors, actor]),
      []
    );

    switch (this.displayMode) {
      case DISPLAY_MODE.SHOW_HIDDEN:
        actors = actors.filter(actor => this.hiddenActors.includes(actor.id));
        break;
      case DISPLAY_MODE.SHOW_VISIBLE:
        actors = actors.filter(actor => !this.hiddenActors.includes(actor.id));
        break;
    }

    actors = actors.map(actor => {
      const data = actor.data.data;
      return this.getActorDetails(actor);
    });

    this.state = {
      activeTab: this.activeTab,
      mode: this.displayMode,
      actors: actors,
      momentum: this.state.momentum,
    };
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 500,
      height: 300,
      resizable: true,
      title: "Party Overview",
      template: `systems/trinity/templates/overview/overview.html`,
      classes: ["overview", game.system.id]
    });
  }

  getData() {
    this.update();
    return this.state;
  }

  htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  getActorDetails(actor) {
    const data = actor.data.data;

      return {
        id: actor.id,
        isHidden: this.hiddenActors.includes(actor.id),
        name: actor.name,
        aspirations: actor.data.data.aspirations
      };

  }

  activateListeners(html) {
    super.activateListeners(html);

    // Change Momentum
    html.find('.momentum').change(ev => {
      // this.actor.update({ 'data.inspiration.value': ++this.actor.data.data.inspiration.value });
      console.log("Momentum Change");
      console.log(this);
      game.settings.set("trinity", "momentum-max", this.state.momentum.max);
      game.settings.set("trinity", "momentum-current", this.state.momentum.current);
      game.settings.set("trinity", "momentum-spent", this.state.momentum.spent);
      this.render(true);
    });
  }

}

// export default OverviewApp;
