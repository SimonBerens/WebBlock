import {useData} from "./utils.js";

useData(data => (document.getElementById("suggested-suggested-actions-display") as HTMLDivElement).innerHTML = data.suggestedActions)

