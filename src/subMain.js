import Methods from "./methods.js";
const form = document.getElementById('Employee-form');
const dobInp = document.getElementById('birthDay');
const resetBtn = document.querySelector(".reset-btn")
export default class SubMain {

  constructor() {
    //eventlistners and setting date attribute
    form.addEventListener('submit', this.handleSubmit);
    //event for the reset button
    resetBtn.addEventListener("click", this.onReset)
    const inputElem = document.querySelectorAll("input#employeeName, input#birthDay, input#email, input#phoneNum")
    inputElem.forEach(element => {
      element.addEventListener("change", this.validations)
    })
    dobInp.setAttribute('max', new Date().toISOString().split('T')[0]);
  }
  //reset the form and back to the add employee form
  onReset = () => {
    this.isEmpty()
    form.reset();
    document.getElementById("submit-btn").value = "Submit"
    resetBtn.style.display = "none"
  }

  //validations method to validate name, phonenum
  validations(event) {
    switch (event.target.name) {
      //validation for Name length
      case 'employeeName':
        if (event.target.value.length < 4 || event.target.value.length > 20)
          SubMain.notValid(event, 'Name length must be between 4 to 20!');
        else if (/[^a-z0-9]+$/i.test(event.target.value))
          SubMain.notValid(event, 'Name must be AlphaNumeric')
        else
          SubMain.valid(event)
        break;

      //validation remove class if not null
      case 'birthDay':
        if (event.target.value)
          SubMain.valid(event)
        break;

      case 'email':
        if (event.target.value)
          SubMain.valid(event)

        break;

      //validation for phone num
      case 'phoneNum':
        if (event.target.value.length > 0 && event.target.value.length !== 10)
          SubMain.notValid(event, 'Phone number length must be only 10 digits')
        else
          SubMain.valid(event)
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
  isEmpty() {
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
        empty = false
      }
    })
    return empty
  }

  //handling submit of the form
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isEmpty())
      return

    const allEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    const employee = Methods.getEmployee();

    if (event.submitter.value === "Submit") {
      //storing employee in localStorage
      allEmployees.push(employee);
      localStorage.setItem('employees', JSON.stringify(allEmployees));
      Methods.showTableData("create");
      form.reset()
    }
    else {
      const mySearchParams = new URLSearchParams(window.location.href)
      const id = Number(mySearchParams.get("index"))
      const key = allEmployees.findIndex(emp => emp.id === id)
      allEmployees.splice(key, 1, employee);
      localStorage.setItem('employees', JSON.stringify(allEmployees));
      Methods.showTableData("update", key, id);
      this.onReset()
    }
  }
}
