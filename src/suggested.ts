import {getData} from "./utils.js";

getData().then(data => (document.getElementById("suggested-suggested-actions-display") as HTMLDivElement).innerHTML = data.suggestedActions)

