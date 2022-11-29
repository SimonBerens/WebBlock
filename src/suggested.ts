import {getData, renderMotivationHtml} from "./utils.js";

getData().then(data => renderMotivationHtml(data.motivationList, document.getElementById("suggested-actions-display") as HTMLDivElement))

