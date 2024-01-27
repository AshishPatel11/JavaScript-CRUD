import Methods from "./methods.js";
import SubMain from "./subMain.js";


export default class Main {
  constructor() {
    new SubMain();    // call to SubMain
    new Methods();
    Methods.showTableData();  // function for table data
  }
}
window.onload = function () {
  new Main();
};
