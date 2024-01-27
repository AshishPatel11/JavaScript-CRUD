import Storage from "./Storage.js";
import TableMethods from "./TableMethods.js";
const form = document.getElementById('Employee-form');
const dobInp = document.getElementById('birthDay');
const resetBtn = document.querySelector(".reset-btn")

export default class Form {

  constructor() {
    //eventlistners and setting date attribute
    form.addEventListener('submit', this.handleSubmit);
    resetBtn.addEventListener("click", this.onReset)
    dobInp.setAttribute('max', new Date().toISOString().split('T')[0]);
    const inputElem = document.querySelectorAll("input#employeeName, input#birthDay, input#email, input#phoneNum")

    inputElem.forEach(element => {
      element.addEventListener("change", this.validations)
    })
  }

  //reset the form and back to the add employee form
  onReset = () => {
    Form.isEmpty()
    form.reset();
    document.querySelector(".empid").removeAttribute("id")
    document.getElementById("submit-btn").value = "Submit"
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
        if (event.target.value)
          Form.valid(event)

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

      if (!element.value) {
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
    if (Form.isEmpty())
      return

    const allEmployees = Storage.get() || [];
    const employee = TableMethods.getEmployee();

    if (event.submitter.value === "Submit") {
      allEmployees.push(employee);
      Storage.set(allEmployees);
      TableMethods.showTableData("create");
      this.onReset()
      return
    }
    else {
      const id = Number(document.querySelector(".empid").id)
      const key = allEmployees.findIndex(emp => emp.id === id)
      allEmployees.splice(key, 1, employee);
      Storage.set(allEmployees);
      TableMethods.showTableData("update", key, id);
      this.onReset()
      return
    }
  }
}
