export default class Storage {
    constructor() {
    }
    static get() {
        return JSON.parse(localStorage.getItem("employees"))
    }
    static set(employee) {
        return localStorage.setItem("employees", JSON.stringify(employee))
    }
}