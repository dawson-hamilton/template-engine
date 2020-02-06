const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const Employee = require("./lib/Employee");
const Enginner = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");
const genHtml = require("./html/genHtml");
const writeToFileAsync = util.promisify(fs.writeFile);

let teamArray = [];
let wait = "Yes";

init();

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
            message: "Please enter the team member name:"
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

function internTemplate(Intern) {
    return `<div class="card shadow col-3 px-0 my-4 mx-4">
        <div class="card-header bg-info text-white font-weight-bold display-5">
            <h1>${Intern.name}</h1>
            <h1> <i class="fas fa-user-graduate"></i> ${Intern.title}</h1>
        </div>
        <div class="card-body bg-light">
            <ul class="list-group">
                <li class="list-group-item">ID: ${Intern.id}</li>
                <li class="list-group-item">Email: ${Intern.email}</li>
                <li class="list-group-item">School: ${Intern.school.school}</li>
            </ul>
        </div>
    </div>`
}
function engineerTemplate(Engineer) {
    return `<div class="card shadow col-3 px-0 my-4 mx-4">
        <div class="card-header bg-info text-white font-weight-bold display-5">
            <h1>${Engineer.name}</h1>
            <h1> <i class="fas fa-glasses"></i> ${Engineer.title}</h1>
        </div>
        <div class="card-body bg-light">
            <ul class="list-group">
                <li class="list-group-item">ID: ${Engineer.id}</li>
                <li class="list-group-item">Email: ${Engineer.email}</li>
                <li class="list-group-item">Github: ${Engineer.github.github}</li>
            </ul>
        </div>
    </div>`
}
function managerTemplate(Manager) {
    return `<div class="card shadow col-3 px-0 my-4 mx-4">
        <div class="card-header bg-info text-white font-weight-bold">
            <h1>${Manager.name}</h1>
            <h1> <i class="fas fa-mug-hot"></i> ${Manager.title}</h1>
        </div>
        <div class="card-body bg-light">
            <ul class="list-group">
                <li class="list-group-item">ID: ${Manager.id}</li>
                <li class="list-group-item">Email: ${Manager.email}</li>
                <li class="list-group-item">Office Number: ${Manager.officeNumber.office}</li>
            </ul>
        </div>
    </div>`
}

async function init() {
    console.log("Initializing new team")
    do {

        try {
            const employee = await newMember()
            console.log("Team has begun initialization")

            let dataInput;
            let name = employee.name;
            let id = employee.id;
            let email = employee.email;
            let role = employee.role;

            switch (role) {
                case "Intern":
                    dataInput = await findSchool();
                    let intern = new Intern(name, id, email, dataInput)
                    let internData = internTemplate(intern);
                    teamArray.push(internData);
                    break;

                case "Engineer":
                    dataInput = await findGithub();
                    let engineer = new Enginner(name, id, email, dataInput)
                    let engineerData = engineerTemplate(engineer);
                    teamArray.push(engineerData);
                    break;

                case "Manager":
                    dataInput = await findOfficeNumber();
                    let manager = new Manager(name, id, email, dataInput)
                    let managerData = managerTemplate(manager);
                    teamArray.push(managerData);
                    break;
            }
        } catch (err) {
            console.log(err)
        }

        wait = await nextEmployee()
    } while (wait.nextEmployee === "Yes")

    try {
        let startHtml = genHtml();
        let endHtml =
            `</div>
                    </div>
                </body>
            </html>`
        await writeToFileAsync(`./html/myTeam.html`, startHtml);
        await fs.appendFile(`./html/myTeam.html`, teamArray + endHtml, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Success");
            }


        })
    } catch (err) {
        console.log(err)
    }
}