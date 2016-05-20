var totalSalary= 0;

$(document).ready(function(){

//Combined monthly salary is initialized as a global variable
addEmployees();
//jQuery waits for the user to submit employee information. When they do, it produces a new Object of that employee.
$('#employeeinfo').on('submit', postEmployee);
$('.employeecontainer').on('click', '.delete', deleteEmployee);

});
//This function adds employees to the DOM from the database.
function addEmployees(){
  $('.employeecontainer').empty();
  $.ajax({
    type:'GET',
    url:'/employees',
    success: function(employees) {
      totalSalary = 0;
    console.log(employees);
    employees.forEach(function (employee) {
      console.log(employee);
      $container = $('<div></div>');
totalSalary += Math.round(employee.salary/12);
updateSalary();

      //fields I want to edit
      var employeeProperties = ['fullname', 'jobtitle','salary' ];
      employeeProperties.forEach(function (prop){
        var $el = $('<input type="text" id="' + prop + '" />');
        $el.val(employee[prop]);
        $container.append($el);
      });
      $container.attr('id', employee.id);
      $container.append('<button class="update">Update</button>');
      $container.append('<button class="delete">Delete</button>');
      $('.employeecontainer').append($container);
      });
//All relevant fields are cleared to await further input.
  $('#employeeinfo').find('input[type=text]').val('');
  $('#employeeinfo').find('input[type=number]').val('');
}
});
}

function postEmployee(event){
  event.preventDefault();
  var employee = {};
  $.each($('#employeeinfo').serializeArray(), function(i, field) {
    employee[field.name] = field.value;
    console.log(employee[field.name]);
  });
  console.log(employee);
  $.ajax({
    type: 'POST',
    url:'/employees',
    data: employee,
    success: function(data) {
      console.log("Successful post");
      addEmployees();
    }
  });
 }
 function getemployeeID(button){
   var employeeID = $(button).parent().attr('id');
 return employeeID;
 }

//This function deletes an employee's name from the database.
function deleteEmployee(){
  console.log("Yep");
  console.log($(this).parent());
  var employeeID = getemployeeID($(this));
$.ajax({
  type:'DELETE',
  url:'/employees/' + employeeID,
  success: function(data){
    console.log("Successful delete");
    addEmployees();
  }
});
}

//This function updates the total salary that is displayed on the screen. The actual calculations are handled in lowerSalary and addSalary.
function updateSalary(){
  $('.salary').remove();
  $('.salarycontainer').append('<p class="salary">Total Monthly Salary: $' + totalSalary + '</p>');
}
