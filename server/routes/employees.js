var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/weekendredux';
var path = require('path');

//This get request returns all employees.
router.get('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

//Firstname and lastname are concatenated into a new column, fullname.
        client.query("SELECT firstname || ' ' || lastname AS fullname, jobtitle, salary, id, active FROM employees GROUP BY firstname, lastname, jobtitle, salary, id;", function(err, result) {
            done();
            res.send(result.rows);
        });
    });

});

//This post request updates the database with a new employee.
router.post('/', function(req, res) {
    var employee = req.body;
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

//This delete request is un-used now in pro mode but I cannot bear to remove my routing children.
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

//This put request only fires on a request from an active employee.
router.put('/true/:id', function (req, res) {
  var employeeID = req.params.id;
  pg.connect(connectionString, function(err, client, done) {
      if (err) {
          res.sendStatus(500);
      }
      client.query('UPDATE employees set active = false WHERE id = $1', [employeeID],
      function (err, result){
          done();
          if (err) {
              res.sendStatus(500);
              return;
          }
          res.sendStatus(201);
    });
  });
});

//This put request only fires  on a request from an in-active employee.
router.put('/false/:id', function (req, res) {
  var employeeID = req.params.id;
  pg.connect(connectionString, function(err, client, done) {
      if (err) {
          res.sendStatus(500);
      }
      client.query('UPDATE employees set active = true WHERE id = $1', [employeeID],
      function (err, result){
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
