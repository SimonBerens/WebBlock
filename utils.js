export const addOnClick = (id, func) => {
    document.getElementById(id).addEventListener("click", func);
}