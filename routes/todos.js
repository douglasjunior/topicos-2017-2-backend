const express = require("express");
const todos = express.Router();
const models = require('../models');
const Todo = models.Todo;

todos.get('/', function (req, res, next) {
    const busca = req.query.busca;

    let filtro;
    if (busca) {
        filtro = {
            where: {
                $or: [{
                    title: {
                        $like: '%' + busca + '%'
                    }
                }, {
                    description: {
                        $like: '%' + busca + '%'
                    }
                }]
            },
            order: ['title']
        }
    }
    Todo.findAll(filtro)
        .then(todos => {
            res.status(200).json(todos);
        }).catch(ex => {
            console.error(ex);
            res.status(400).send('Não foi possível consultar as tarefas.');
        })
});

todos.get('/:todoId', function (req, res, next) {
    const todoId = req.params.todoId;
    Todo.findById(todoId)
        .then(todo => {
            if (todo) {
                res.status(200).json(todo);
            } else {
                res.status(404).send('Tarefa não encontrada.');
            }
        }).catch(ex => {
            console.error(ex);
            res.status(400).send('Não foi possível consultar a tarefa.');
        })
});

todos.post('/', function (req, res, next) {
    const todo = {
        title: req.body.title,
        description: req.body.description,
        creation_date: new Date(),
        completed: false,
    };

    Todo.create(todo)
        .then((_todo) => {
            res.status(201).json(_todo);
        }).catch(ex => {
            console.error(ex);
            res.status(400).send('Não foi possível incluir a tarefa ' +
                'no banco de dados.');
        });
});

todos.put('/:todoId', function (req, res, next) {
    const todoId = req.params.todoId;
    const todo = {
        title: req.body.title,
        description: req.body.description,
    };
    Todo.update(todo, {
        where: {
            id: todoId,
        }
    }).then((result) => {
        const registrosAfetados = result[0];
        if (registrosAfetados) {
            return Todo.findById(todoId);
        } else {
            res.status(404).send('Tarefa não encontrada.');
        }
    }).then(_todo => {
        if (_todo) {
            res.status(200).json(_todo);
        }
    }).catch(ex => {
        console.error(ex);
        res.status(400).send('Não foi possível atualizar a tarefa');
    });
});

todos.delete('/:todoId', function (req, res, next) {
    const todoId = req.params.todoId;
    Todo.destroy({
        where: {
            id: todoId
        }
    }).then(() => {
        res.status(204).send();
    }).catch(ex => {
        console.error(ex);
        res.status(400).send('Não foi possível excluir a tarefa.');
    });
});

todos.put('/:todoId/completed', (req, res) => {
    const todoId = req.params.todoId;
    completeTodo(todoId, true, res);
});

todos.delete('/:todoId/completed', (req, res) => {
    const todoId = req.params.todoId;
    completeTodo(todoId, false, res);
});

const completeTodo = (todoId, completed, res) => {
    const todo = { completed: completed };
    Todo.update(todo, {
        where: {
            id: todoId
        }
    }).then(result => {
        const registrosAfetados = result[0];
        if (registrosAfetados > 0) {
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    }).catch(ex => {
        console.error(ex);
        res.status(400).send();
    });
}

module.exports = todos;
