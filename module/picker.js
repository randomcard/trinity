// trinity roll 2
import { trinityRoll } from "/systems/trinity/module/trinity-roll2.js";

export class Picker {

  static async pDialog(pickType, targetActor, pickedElements) {

    var html = {};

    // add some conditional code here to change the template depending on pickType - attr, skil, etc.
    /*
    console.log("Picker, what does it have?");
    console.log(this);
    console.log(pickType);
    console.log(targetActor);
    console.log(pickedElements);
    */
    switch(pickType) {
      case "attr":
        html = await renderTemplate("systems/trinity/templates/pickers/pick-attr.html", {picked: pickedElements, actor: targetActor});
        break;
      case "skil":
        let pItems = targetActor.items.filter(f => f.type.includes("skill"));
        console.log("pItems");
        console.log(typeof pItems);
        console.log(pItems);
        html = await renderTemplate("systems/trinity/templates/pickers/pick-skil.html", {items: pItems, actor: targetActor});
        break;
      default:
        ui.notifications.warn("No Picker Type Found.");
        return;
    }

    // const pickDialog = await new Promise(resolve => {
    return new Promise((resolve, reject) => {
        new Dialog({
        title: "Pick Element",
        id: "picker",
        content: html,
        buttons: {
          update: {
            icon: "<i class='fas fa-redo'></i>",
            label: "Update",
            callback: () => {

              console.log("Testing getElementsByClassName:");
              console.log(document.getElementsByClassName('input'));

              console.log("targetActor.items:");
              console.log(targetActor.items);
              // console.log(targetActor.items.find(item => item._id === i.value));

              for (let i of document.getElementsByClassName('input')) {
                if (i.checked) {  // maybe i[0]
                  pickedElements.attr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === i.value) || pickedElements.attr;
                  pickedElements.skil = Object.keys(targetActor.items).find(item => item.value.data._id === i.value) || pickedElements.skil;
                  console.log("pickedElements.skil");
                  console.log(pickedElements.skil);
                  //console.log(typeof targetActor.items);
                  //console.log(targetActor.items.find(item => item._id === i.value));
                  // pickedElements.skil = targetActor.items.find(item => item._id.includes(i.value)) || pickedElements.skil;
                  // pickedElements.skil = targetActor.items.find(f    => f.type.includes("skill"));

                  /*
                  console.log("Picker, Update button, pickedElement:");
                  console.log(pickedElements);
                  */
                }
              };

              console.log("pickedElements");
              console.log(pickedElements);

              // console.log(pickedElements);
              // resolve(pickedElements);

              // trinityRoll(null, targetActor, pickedElements);
              trinityRoll(targetActor, pickedElements);

              resolve(pickedElements);
/*

              let h = html.find('.input');
              Array.prototype.forEach.call(h, function(i) {
                if (i.checked) {  // maybe i[0]
                  pickedElements.attr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === i.value);
                  console.log("Picker, Update button, pickedElement:");
                  console.log(pickedElements);
                }
                console.log(i.tagName);
              });


/*
              for (let i of html.filter('.input')) {
                if (i.checked) {  // maybe i[0]
                  pickedElements.attr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === i.value);
                  console.log("Picker, Update button, pickedElement:");
                  console.log(pickedElements);
                }
              };
*/


/* Various useful code snippets
targetAttr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === dataset.attrname);
pickedElements.attr = targetAttr;

              if (html.find('#'+i._id)[0].checked) {
                iSelect = html.find('#'+i._id)[0].value;
              }

              for (let part of Object.keys(rollParts)) {
                if (document.getElementById(part)){
                  rollParts[part] = parseInt(document.getElementById(part).value) || rollParts[part];
                }
                console.log("rollParts."+part+":");
                console.log(rollParts[part]);
              }
/* End Code Snippets */



              /* Needs updating to update pickedElements
              for (let part of Object.keys(rollParts)) {
                if (document.getElementById(part)){
                  rollParts[part] = parseInt(document.getElementById(part).value) || rollParts[part];
                }
                console.log("rollParts."+part+":");
                console.log(rollParts[part]);
              }
              resolve(rollParts); */
            }
          },
          cancel: {
            icon: "<i class='fas fa-times'></i>",
            label: "Cancel",
            callback: () => {
              trinityRoll(targetActor, pickedElements);
              resolve(pickedElements);
          //	  actionType = "remove";
            }
          },
        },
        default:"roll",
        callback: html => {
          resolve(pickedElements);
//            console.log(html, actor);
/*
            let passionName = html[0].querySelector('.newPassion').value
            let passionValue = html[0].querySelector('.newPassionValue').value

            actor.update({
                "data.passions": [...actor.data.passions, [passionName, passionValue]]
*/      }
    }).render(true);
  });
}

}
