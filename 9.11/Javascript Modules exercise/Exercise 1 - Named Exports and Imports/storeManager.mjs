import {addItem, removeItem, listItems} from "./inventory.mjs";

addItem("Book");
addItem("Pen");
addItem("Pencil");
listItems();

removeItem("Pen");
listItems();
