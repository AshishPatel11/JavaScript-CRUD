import Form from "./Form.js";
import Storage from "./Storage.js";

const form = document.getElementById('Employee-form');
export default class TableMethods {
    constructor() {
    }



    static showTableData(action, key, id) {
        //creating tbody elem. with the data
        const allEmployees = Storage.get()
        if (action === "create") {
            TableMethods.updateTable(allEmployees.slice(-1), allEmployees.length - 1)
            TableMethods.updateVerticalTable(allEmployees.slice(-1), allEmployees.length - 1)
        }
        else if (action === "update") {
            TableMethods.updateTable(allEmployees.slice(key, key + 1), id, action);
            TableMethods.updateVerticalTable(allEmployees.slice(key, key + 1), key, action);
        }
        else if (action === "deleted") {
            TableMethods.updateTable(null, id, action)
            TableMethods.updateVerticalTable(null, key, action)
        }
        else {
            TableMethods.updateTable();
            TableMethods.updateVerticalTable()
        }
    }

    // deleting the record form localStorage
    static onDelete(event) {
        // TODO: move to storage service
        if (confirm("Do you want to delete the record?")) {
            const id = Number(event.target.id.split("_")[1])
            const key = Storage.delete(id);
            TableMethods.showTableData("deleted", key, id);
            form.reset();
        }
    }

    //editing the record form localStorage
    static onEdit(event) {
        form.reset()
        document.documentElement.scrollTop = 0;
        document.getElementById("submit-btn").value = "Save"
        document.getElementById("submit-btn").removeAttribute("disabled")

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

        // TODO: Set value of hidden control 
        document.querySelector("#empid").setAttribute("value", `${employee.id}`)
        Form.isEmpty();
    }

    //updating the nodes on different actions
    static updateTable(allEmployees = Storage.get(), indexKey = undefined, action = undefined) {
        const tableBody = document.querySelector("#display-table > tbody:nth-child(2)")

        if (action === "deleted") {
            tableBody.removeChild(document.getElementById(`tr_${indexKey}`))
            return;
        }
        // create new method which will create and add TR in the table body
        if (action === "update") {
            tableBody.replaceChild(...createTr(allEmployees), document.getElementById(`tr_${indexKey}`))
        } else {
            tableBody.append(...createTr(allEmployees))
        }


        function createTr(data) {
            return data.map((emp) => {
                const node = document.createElement("tr")
                node.setAttribute("id", `tr_${emp.id}`)
                createTd(node, emp.employeeName)
                createTd(node, emp.gender)
                createTd(node, emp.birthDay)
                createTd(node, emp.email)
                createTd(node, emp.phoneNum)
                createTd(node, emp.Hobbies.join(", "))
                createTd(node, emp.id, true)
                return node
            })
        }

        function createTd(tr, data, isActions) {
            const td = document.createElement("td")
            if (isActions) {
                const edtBtn = document.createElement("button")
                const delBtn = document.createElement("button")

                edtBtn.setAttribute("id", `edit_${data}`)
                delBtn.setAttribute("id", `delete_${data}`)

                edtBtn.setAttribute("class", "edit-btn")
                delBtn.setAttribute("class", "delete-btn")

                edtBtn.innerText = "Edit"
                delBtn.innerText = "Delete"

                edtBtn.addEventListener("click", TableMethods.onEdit)
                delBtn.addEventListener("click", TableMethods.onDelete)
                td.append(edtBtn, delBtn)
            } else {
                td.innerText = `${data}`
            }
            tr.appendChild(td)
        }
    }

    //method for display data in vertical heading table
    static updateVerticalTable(allEmployees = Storage.get(), indexKey = undefined, action = undefined) {
        if (action === "deleted") {
            const tdList = document.querySelectorAll(`.vertical-table td:nth-child(${indexKey + 2})`)
            tdList.forEach((td) => {
                td.remove()
            })
            return;
        }

        allEmployees.forEach(employee => {
            const titleArr = ["employeeName", "gender", "birthDay", "email", "phoneNum", "Hobbies", "action"]
            titleArr.forEach(title => {
                const tr = document.getElementById(`${title}-row`)
                const td = document.createElement("td")
                if (title === "action") {
                    const edtBtn = document.createElement("button")
                    const delBtn = document.createElement("button")

                    edtBtn.setAttribute("id", `edit_${employee.id}`)
                    delBtn.setAttribute("id", `delete_${employee.id}`)

                    edtBtn.setAttribute("class", "edit-btn")
                    delBtn.setAttribute("class", "delete-btn")

                    edtBtn.innerText = "Edit"
                    delBtn.innerText = "Delete"

                    edtBtn.addEventListener("click", TableMethods.onEdit)
                    delBtn.addEventListener("click", TableMethods.onDelete)
                    td.append(edtBtn, delBtn)
                }
                else
                    td.innerText = `${employee[title]}`
                if (action === "update") {
                    const oldTd = document.querySelector(`#${title}-row td:nth-child(${indexKey + 2})`)
                    tr.replaceChild(td, oldTd)
                    return
                }
                else
                    tr.appendChild(td)
            })

        })
    }

}
