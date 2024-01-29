import TableMethods from "./TableMethods.js";
import Form from "./Form.js";


export default class Main {
  constructor() {
    new Form();    // call to Form
    new TableMethods();
    TableMethods.showTableData();  // function for table data
  }
}

window.onload = function () {
  new Main();
};
