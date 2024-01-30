import Storage from "./Storage.js";
import TableMethods from "./TableMethods.js";

const form = document.getElementById('Employee-form');
const dobInp = document.getElementById('birthDay');
const resetBtn = document.querySelector(".reset-btn")

export default class Form {

  constructor() {
    //eventlistners and setting date attribute
    form.addEventListener('submit', this.handleSubmit);
    resetBtn.addEventListener("click", Form.onReset)
    dobInp.setAttribute('max', new Date().toISOString().split('T')[0]);
    const inputElem = document.querySelectorAll("input#employeeName, input#birthDay, input#email, input#phoneNum")

    inputElem.forEach(element => {
      element.addEventListener("change", this.validations)
    })
  }


  //getting the employee data as object
  static getEmployee() {
    const data = new FormData(form);
    const employee = { id: Date.now(), Hobbies: [] };
    for (const [objKey, value] of data) {
      objKey === "Hobbies" ? employee[objKey].push(value) : employee[objKey] = value.trim()
    }
    return employee;
  }

  //reset the form and back to the add employee form
  static onReset = () => {
    Form.isEmpty()
    form.reset();
    document.querySelector("#empid").removeAttribute("value")
    document.getElementById("submit-btn").value = "Submit"
    document.getElementById("submit-btn").removeAttribute("disabled")
    resetBtn.style.display = "none"
  }

  //validations method to validate name, phonenum
  validations(event) {
    switch (event.target.name) {
      //validation for Name length
      case 'employeeName':
        if (event.target.value.length < 4 || event.target.value.length > 20)
          Form.notValid(event, 'Name length must be between 4 to 20!');
        else if (/[^a-z0-9]+$/i.test(event.target.value))
          Form.notValid(event, 'Name must be AlphaNumeric')
        else
          Form.valid(event)
        break;

      //validation remove class if not null
      case 'birthDay':
        if (event.target.value)
          Form.valid(event)
        break;

      case 'email':
        console.log(Storage.isUnique(event.target.value))
        if (Storage.isUnique(event.target.value)) {
          Form.valid(event)
        } else {
          Form.notValid(event, "This email already exist!!")
        }
        break;

      //validation for phone num
      case 'phoneNum':
        if (event.target.value.length > 0 && event.target.value.length !== 10)
          Form.notValid(event, 'Phone number length must be only 10 digits')
        else
          Form.valid(event)
        break;

      default:
        console.log('invalid Call');
        break;
    }
  }

  //static method if input is valid
  static valid(event) {
    document.getElementById('submit-btn').removeAttribute('disabled');
    event.target.classList.remove("input-error")
    const errorElem = document.querySelector(`.${event.target.type}Error`)
    errorElem.innerText = ""
  }

  //static method id input is not valid
  static notValid(event, errMsg) {
    const errorElem = document.querySelector(`.${event.target.type}Error`)
    errorElem.innerText = errMsg
    document.getElementById('submit-btn').setAttribute('disabled', '');
    event.target.classList.add("input-error")
  }

  //empty validation on input fields
  static isEmpty() {
    // onEmpty validations
    let empty = false
    const inputElem = document.querySelectorAll("input#employeeName, input#birthDay, input#email")
    inputElem.forEach(element => {

      if (!element.value.trim()) {
        const errorElem = document.querySelector(`.${element.type}Error`)
        element.classList.add("input-error")
        errorElem.innerText = "Please fill the required fields!"
        empty = true;
      }
      else if (element.value) {
        const errorElem = document.querySelector(`.${element.type}Error`)
        element.classList.remove("input-error")
        errorElem.innerText = ""
      }
    })
    return empty
  }

  //handling submit of the form
  handleSubmit = (event) => {
    event.preventDefault();
    if (Form.isEmpty()) {
      return
    }

    const employee = Form.getEmployee();

    // TODO: check empoyee has ID field with value
    if (document.getElementById("empid").value) {
      //if the hidden input has value set then update
      const id = Number(document.getElementById("empid").value)
      const key = Storage.update(id, employee)
      TableMethods.showTableData("update", key, id);
    } else {
      Storage.create(employee)
      TableMethods.showTableData("create");
    }

    Form.onReset()
    return;
  }
}
