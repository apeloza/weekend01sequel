var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/weekendredux';
var path = require('path');


router.get('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query("SELECT firstname || ' ' || lastname AS fullname, jobtitle, salary, id FROM employees GROUP BY firstname, lastname, jobtitle, salary, id;", function(err, result) {
            done();

            console.log(result.rows);

            res.send(result.rows);
        });
    });

});

router.post('/', function(req, res) {
    var employee = req.body;
    console.log(req);
    console.log(employee);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('INSERT into employees (firstname, lastname, jobtitle, salary) VALUES ($1, $2, $3, $4)', [employee.firstname, employee.lastname, employee.jobtitle, employee.salary],
            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(201);
            });
    });
});
router.delete('/:id', function(req, res) {
    var employeeID = req.params.id;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }
        client.query('DELETE from employees WHERE id = $1', [employeeID],
            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(201);

            });
    });
});
module.exports = router;
