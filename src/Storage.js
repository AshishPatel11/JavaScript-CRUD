export default class Storage {
    constructor() {
    }
    static get() {
        return JSON.parse(localStorage.getItem("employees"))
    }
    static set(employee) {
        return localStorage.setItem("employees", JSON.stringify(employee))
    }

    // create new method to handle add, update and delete operation done from Table
    static update(id, data) {
        const allEmployees = Storage.get()
        const key = allEmployees.findIndex(emp => emp.id === id)
        allEmployees.splice(key, 1, data);
        Storage.set(allEmployees)
        return key; //returning the key that is updated
    }

    static create(data) {
        const allEmployees = Storage.get()
        allEmployees.push(data);
        Storage.set(allEmployees);
    }

    static delete(id) {
        const allEmployees = Storage.get()
        const key = allEmployees.findIndex(emp => emp.id === id)
        allEmployees.splice(key, 1)
        Storage.set(allEmployees)
        return key; //returning the key that is deleted
    }

    static isUnique(email) {
        const allEmployees = Storage.get()
        if (allEmployees.find(emp => emp.email === email)) {
            return false
        } else {
            return true
        }
    }
}
