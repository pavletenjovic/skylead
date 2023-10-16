"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.listen('4000', () => {
    console.log('Port 4000 listening');
});
const db = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'skylead'
});
db.connect((err) => {
    if (err)
        console.log(err);
    else {
        console.log('Connection OK');
    }
});
app.get('/', (request, response) => {
    let sql = `SELECT * FROM skylead.tasks`;
    db.query(sql, (err, result) => {
        if (err)
            console.log(err);
        else {
            response.send(result);
        }
    });
});
app.get('/:id', (request, response) => {
    let sql = `SELECT * FROM skylead.tasks where TaskId='${request.params.id}'`;
    db.query(sql, (err, result) => {
        if (err)
            console.log(err);
        else {
            response.send(result);
        }
    });
});
app.post('/createTask', (request, response) => {
    let sql = ` insert into skylead.tasks (Title, Description, StatusId, AssignedUserId) values('${request.body.title}', '${request.body.description}', 
                (select s.StatusId from task_status s where s.StatusName='${request.body.status}'), (select u.UserId from users u where u.Fullname='${request.body.ime}'));`;
    db.query(sql, (err, result) => {
        if (err)
            throw err;
        response.send('Task created');
    });
});
app.put('/:id', (request, response) => {
    let sql = `UPDATE skylead.tasks set StatusId=(select s.StatusId from task_status s where s.StatusName='${request.body.status}') where TaskId='${request.params.id}'`;
    db.query(sql, (err, result) => {
        if (err)
            throw err;
        response.send('Task updated');
    });
});
app.delete('/:id', (request, response) => {
    let sql = `DELETE from skylead.tasks where TaskId='${request.params.id}'`;
    db.query(sql, (err, result) => {
        if (err)
            throw err;
        response.send('Task deleted');
    });
});
