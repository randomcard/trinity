export async function setFocusName(c) {

  let dispo = c.token?.data?.disposition;
  let group = [];
  game.combat.data.combatants.map(cb => {
    if (cb.token?.data?.disposition === dispo) { group.push(cb.actor); }
  });
  console.log("group", group);

  const focusDialog = class extends Dialog {
    activateListeners (html) {
      super.activateListeners(html);
      html.find('.combatant').click( event => {
        console.log("Clicked:", event);
        let actorID = event.currentTarget.dataset.actorid;
        updateFocusName(c, game.actors.get(actorID));
        this.close();
      } );
    }
  }

  let html = await renderTemplate("/systems/trinity/templates/combat/focus-dialog.html", {group: group} );

  const d = new focusDialog({
    /* title, content, buttons, ... */
    title: "Focus on Character",
    content: html,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        default: true,
        callback: html => {
          // console.log("Cancel Callback:", c);
          // updateFocusName(c, "Test Name Remove");
          return;
        }
      }
    }
  });

  d.render(true)

  async function updateFocusName(c, actor) {
    console.log("updateFocusName:", c, actor);
    let updates = {};
    updates = game.combat.data.combatants.map(cb => {
      // console.log("cb/b", cb, c);
      let newName = ( cb.id === c.id ) ? actor.name : cb.data.name;
      let newToken = ( cb.id === c.id ) ? actor.data.token.img : cb.data.img;
      // console.log("newName:", newName);
      return {
        _id: cb.id,
        name: newName,
        img: newToken,
      };
    });
    await game.combat.updateEmbeddedDocuments("Combatant", updates);
  }

}
