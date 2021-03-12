// trinity roll 2
import { trinityRoll } from "/systems/trinity/module/trinity-roll2.js";
import { pickedElementsProto } from "/systems/trinity/module/protos.js";

export class Picker {

  static async pDialog(pickType, targetActor, pickedElements) {

    var html = {};
    let pItems = {};

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
        pItems = targetActor.items.filter(f => f.type.includes("skill"));
        html = await renderTemplate("systems/trinity/templates/pickers/pick-skil.html", {items: pItems, actor: targetActor});
        break;
      case "enha":
        pItems = targetActor.items.filter(f => f.data.data.enhancement.active === true);
        html = await renderTemplate("systems/trinity/templates/pickers/pick-enha.html", {items: pItems, actor: targetActor});
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
              for (let i of document.getElementsByClassName('input')) {
                if (i.checked) {  // maybe i[0], might not work with Enha/Checkbox
                  switch(pickType) {
                    case "attr":
                      pickedElements.attr = Object.values(targetActor.data.data.attributes).find(attribute => attribute.name === i.value) || pickedElements.attr;
                      break;
                    case "skil":
                      pickedElements.skil = targetActor.items.find(item => item._id === i.id).data || pickedElements.skil;
                      pickedElements.skil.value = pickedElements.skil.data.value;
                      break;
                    case "enha":
                      pickedElements.enha[i.id] = targetActor.items.find(item => item._id === i.id).data || pickedElements.enha;
                      pickedElements.enha.value = parseInt(pickedElements.enha.value) + parseInt(pickedElements.enha[i.id].data.enhancement.value);
                      // pickedElements.enha.name = pickedElements.enha.name + '•' + pickedElements.enha[i.id].name;


                      pickedElements.enha.name = ((pickedElements.enha.name === pickedElementsProto.ench.name) ? (pickedElements.enha[i.id].name) : (pickedElements.enha.name + ' • ' + pickedElements.enha[i.id].name));

                      console.log(pickedElements);

                      break;
                  }
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
