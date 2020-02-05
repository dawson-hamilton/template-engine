const inquirer = require("inquirer")
const fs = require("fs")
const Employee = require("./lib/Employee")
const Enginner = require("./lib/Engineer")
const Intern = require("./lib/Intern")
const Manager = require("./lib/Manager")

let teamArray = [];
let teamHtml = "";
let i = "Yes";

function findSchool() {
    return inquirer
        .prompt([{
            name: "school",
            type: "input",
            message: "Enter the name of the school in attendence"
        }])
}
function findOfficeNumber() {
    return inquirer
        .prompt([{
            name: "office",
            type: "input",
            message: "Enter the office number of the manager"
        }])
}
function findGithub() {
    return inquirer
        .prompt([{
            name: "github",
            type: "input",
            message: "Enter the Engineers github username"
        }])
}
function nextEmployee() {
    return inquirer
        .prompt([{
            name: "nextEmployee",
            type: "list",
            message: "Would you like to add another employee?",
            choices: [
                "Yes",
                "No"
            ]
        }])
}
function newMember() {
    return inquirer
        .prompt([{
            name: "name",
            type: "input",
            message: "Please enter the team mamber name:"
        }, {
            name: "id",
            type: "input",
            message: "Please enter the ID:"
        }, {
            name: "email",
            type: "input",
            message: "Please enter the email:"
        }, {
            name: "role",
            type: "list",
            message: "Please enter the role on the team:",
            choices: [
                "Intern",
                "Engineer",
                "Manager"
            ]
        }
        ])
}

async function init() {
    console.log("Initializing new team!")
    do {

        try {
            const employee = await newMember()
            console.log(employee.name + ` has begun initialization`)
            let dataInput;
            let name = employee.name
            let id = employee.id
            let email = employee.email
            let role = employee.role
            console.log(name, id, email, role)


            switch (role) {
                case "Intern":
                    dataInput = await findSchool();
                    let intern = new Intern(name, id, email, dataInput)
                    teamArray.push(intern)
                    break;

                case "Engineer":
                    dataInput = await findGithub();
                    let engineer = new Enginner(name, id, email, dataInput)
                    teamArray.push(engineer)
                    break;

                case "Manager":
                    dataInput = await findOfficeNumber();
                    let manager = new Manager(name, id, email, dataInput)
                    teamArray.push(manager)
                    break;
            }

            console.log(teamArray)
        } catch (err) {
            console.log(err)
        }

        i = await nextEmployee()
    } while (i.nextEmployee === "Yes")
}

init();