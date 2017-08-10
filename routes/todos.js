var express = require("express");
var todos = express.Router();

var todoIndex = 0;
var todosList = [];

todos.get('/', function (req, res, next) {
    console.log("Recebemos uma requisição GET");

    res.status(200).json(todosList);
});

todos.get('/:todoId', function (req, res, next) {
    console.log("Recebemos uma requisição GET");

    var todosFiltered =
        todosList.filter(function (todo, index) {
          return todo.id === parseInt(req.params.todoId);
        });

    if (todosFiltered.length === 0) {
        res.status(404).send();
    } else {
        res.status(200).json(todosFiltered[0]);
    }
});

todos.post('/', function (req, res, next) {
    console.log("Recebemos uma requisição POST");

    var todo = req.body;
    todo.id = todoIndex++;
    todosList.push(todo);

    res.status(200).send();
});

module.exports = todos;
