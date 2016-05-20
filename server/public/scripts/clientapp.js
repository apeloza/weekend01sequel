var totalSalary= 0;

$(document).ready(function(){

//Employees are fetched from the database and appended to the DOM.
addEmployees();

//Event handlers are initialized to handle submitting information, as well as activating/de-activating employees.
$('#employeeinfo').on('submit', postEmployee);
$('.employeecontainer').on('click', '#true', deactivateEmployee);
$('.employeecontainer').on('click', '#false', activateEmployee);

});

//This function adds employees to the DOM from the database.
function addEmployees(){

  //The container is emptied before we call with ajax.
  $('.employeecontainer').empty();
  $.ajax({
    type:'GET',
    url:'/employees',
    success: function(employees) {

      //totalSalary is reset
      totalSalary = 0;

      //This iterates over each employee row and then appends the information to the DOM.
    employees.forEach(function (employee) {
      $container = $('<div></div>');
      var employeeProperties = ['fullname', 'jobtitle','salary'];
      employeeProperties.forEach(function (prop){
        var $el = $('<input type="text" id="' + prop + '" />');
        $el.val(employee[prop]);
        $container.append($el);
      });
      $container.attr('id', employee.id);

      //This will increment salary only if the employee is active.
      if(employee.active === true){
        totalSalary += Math.round(employee.salary/12);

//A button is added that states whether the employee is active or inactive.
      $container.append('<button id="' + employee.active + '">Active!</button>');
    } else {
      $container.append('<button id="' + employee.active + '">Inactive!</button>');
    }

    //Everything is appended to the DOM, and then monthly salary is appended to the DOM with updateSalary().
      $('.employeecontainer').append($container);
      updateSalary();
      });

//All relevant fields are cleared to await further input.
  $('#employeeinfo').find('input[type=text]').val('');
  $('#employeeinfo').find('input[type=number]').val('');
}
});
}

//This function de-activates an employee with a put request.
function deactivateEmployee(){
  var employeeID = getemployeeID($(this));
$.ajax({
  type:'PUT',
  url:'/employees/true/' + employeeID,
  success:function(){

    //Employees are re-called with the updated information.
    addEmployees();
  }
});
}

//This function activates an employee with a put request.
function activateEmployee(){
  var employeeID = getemployeeID($(this));
  $.ajax({
    type:'PUT',
    url:'/employees/false/' + employeeID,
    success:function(){

      //Employees are re-called with the updated information.
      addEmployees();
    }
  });
}

//This function adds employees to the database with a post request.
function postEmployee(event){
  event.preventDefault();

  //An empty Object is created and then the values in the form fields are stored in it.
  var employee = {};
  $.each($('#employeeinfo').serializeArray(), function(i, field) {
    employee[field.name] = field.value;
  });
  $.ajax({
    type: 'POST',
    url:'/employees',
    data: employee,
    success: function(data) {

      //Employees are re-called with updated information.
      addEmployees();
    }
  });
 }

 //This function fetches an employee's ID, associated with the button pressed.
 function getemployeeID(button){
   var employeeID = $(button).parent().attr('id');
 return employeeID;
 }

//This function deletes an employee's name from the database.
function deleteEmployee(){
  var employeeID = getemployeeID($(this));
$.ajax({
  type:'DELETE',
  url:'/employees/' + employeeID,
  success: function(data){

    //Employees are re-called with updated information.
    addEmployees();
  }
});
}

//This function updates the total salary that is displayed on the screen.
function updateSalary(){
  $('.salary').remove();
  $('.salarycontainer').append('<p class="salary">Total Monthly Salary: $' + totalSalary + '</p>');
}
