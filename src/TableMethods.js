import Form from "./Form.js";
import Storage from "./Storage.js";

const form = document.getElementById('Employee-form');
export default class TableMethods {
    constructor() {
    }

    //getting the employee data as object
    static getEmployee() {
        const data = new FormData(form);
        const employee = { id: Date.now(), Hobbies: [] };
        for (const [objKey, value] of data) {
            objKey === "Hobbies" ? employee[objKey].push(value) : employee[objKey] = value
        }
        return employee;
    }

    static showTableData(action, key, id) {
        //creating tbody elem. with the data
        const allEmployees = Storage.get()
        if (action === "create") {
            TableMethods.updateTable(allEmployees.slice(-1), allEmployees.length - 1)
        }
        else if (action === "update") {
            TableMethods.updateTable(allEmployees.slice(key, key + 1), id, action);
        }
        else if (action === "deleted") {
            TableMethods.updateTable(null, id, action)
        }
        else {
            TableMethods.updateTable();
        }
    }

    // deleting the record form localStorage
    static onDelete(event) {
        const allEmployees = Storage.get()
        const id = Number(event.target.id.split("_")[1])
        const key = allEmployees.findIndex(emp => emp.id === id)
        if (confirm("Do you want to delete the record?")) {
            allEmployees.splice(key, 1)
            Storage.set(allEmployees);
            form.reset();
            TableMethods.showTableData("deleted", key, id);
        }
    }

    //editing the record form localStorage
    static onEdit(event) {
        form.reset()
        document.getElementById("submit-btn").value = "Save"
        document.querySelector(".reset-btn").style.display = "inline-block"

        //getting the data to be updated
        const key = Number(event.target.id.split("_")[1])
        const allEmployees = Storage.get()
        const nameInp = document.getElementById('employeeName');
        const dobInp = document.getElementById('birthDay');
        const phoneInp = document.getElementById('phoneNum');
        const emailInp = document.getElementById("email");

        const employee = allEmployees.find(emp => emp.id === key)
        document.getElementById(employee.gender).checked = true
        employee.Hobbies.forEach((id) => {
            document.getElementById(id).checked = true
        })
        nameInp.value = employee.employeeName

        dobInp.value = employee.birthDay
        phoneInp.value = employee.phoneNum
        emailInp.value = employee.email
        document.querySelector(".empid").setAttribute("id", `${employee.id}`)
        // form.setAttribute("id", `${employee.id}`)
        Form.isEmpty();
    }

    //updating the nodes on different actions
    static updateTable(allEmployees = Storage.get(), indexKey = undefined, action = undefined) {
        const tableBody = document.querySelector("#display-invert-table > tbody:nth-child(2)")

        if (action === "deleted") {
            tableBody.removeChild(document.getElementById(`tr_${indexKey}`))
            return;
        }
        const newElem = allEmployees.map((emp) => {
            const node = document.createElement("tr")
            node.setAttribute("id", `tr_${emp.id}`)
            createTd(node, emp.employeeName)
            createTd(node, emp.gender)
            createTd(node, emp.birthDay)
            createTd(node, emp.email)
            createTd(node, emp.phoneNum)
            createTd(node, emp.Hobbies.join(", "))
            createTd(node, emp.id, "buttons")
            return node
        })
        if (action === "update") {
            tableBody.replaceChild(...newElem, document.getElementById(`tr_${indexKey}`))
        }
        else {
            tableBody.append(...newElem)
        }

        //defining event listners
        const deleteBtn = document.getElementsByClassName("delete-btn")
        const editBtn = document.getElementsByClassName("edit-btn")
        Array.from(deleteBtn).forEach(element => {
            element.addEventListener("click", TableMethods.onDelete)
        });
        Array.from(editBtn).forEach(element => {
            element.addEventListener("click", TableMethods.onEdit)
        })


        function createTd(tr, data, actions) {
            const td = document.createElement("td")
            if (actions) {
                const edtBtn = document.createElement("button")
                const delBtn = document.createElement("button")

                edtBtn.setAttribute("id", `edit_${data}`)
                delBtn.setAttribute("id", `delete_${data}`)

                edtBtn.setAttribute("class", "edit-btn")
                delBtn.setAttribute("class", "delete-btn")

                edtBtn.innerText = "Edit"
                delBtn.innerText = "Delete"
                td.append(edtBtn, delBtn)
            }
            else
                td.innerText = `${data}`
            tr.appendChild(td)
        }
    }

}








