$(document).ready(function(){

//Combined monthly salary is initialized as a global variable
var totalSalary= 0;

//jQuery waits for the user to submit employee information. When they do, it produces a new Object of that employee.
$('#employeeinfo').on('submit', function(event) {
  event.preventDefault();
  var employee = {};
  $.each($('#employeeinfo').serializeArray(), function(i, field) {
    employee[field.name] = field.value;
});

//Two functions are called. The first adds an employee to the list of employees, and the second function adds their salary to the monthly salary.
addEmployee(employee);
addSalary(employee);
});

//This event handler waits for a click event on the delete button. When the delete button is clicked, a function is run which removes the employee from the system.
$('.employeecontainer').on('click', '.delbtn', deleteEmployee);

//This function adds an employee to the list of employees.
function addEmployee(empInfo){

	//A row is created for the employee in the table
  $('.employeecontainer').append('<tr class="empRow"></tr>');

  //That freshly created row is targeted
  var $employeeCell = $('.employeecontainer').children().last();

  //The relevant data is added in as table data to the row that is targeted.
  $employeeCell.append('<td> ' + empInfo.employeefirstname + '</td><td> ' + empInfo.employeelastname + '</td><td> ' + empInfo.employeeID + '</td><td> ' + empInfo.employeetitle + '</td><td class= "individualSalary">$' + empInfo.employeesalary + '<td> <button class="delbtn btn btn-default">Delete!</button></td>');

//All relevant fields are cleared to await further input.
  $('#employeeinfo').find('input[type=text]').val('');
  $('#employeeinfo').find('input[type=number]').val('');
}

//This functions adds an employee's salary to the total salary.
function addSalary(empInfo){

	//The employee's salary is converted to a monthly number and then added to the total salary. Total salary is then updated.
  var employeeSalary = Number(empInfo.employeesalary)/12;
totalSalary = Math.round(totalSalary + employeeSalary);
updateSalary();
}
//This function deletes an employee's name from the list.
function deleteEmployee(){

	//The function to lower the total salary finds the cell it needs to withdraw the employee's salary from, and then the row is deleted.
  lowerSalary($(this).closest('.empRow').find('.individualSalary').text());
  $(this).closest('.empRow').remove();
}

//This function lowers the global total salary.
function lowerSalary(empInfo){

	//The salary that needs to be removed is fetched, and the $ sign in front is cut off with a substring, and then converted to a number. The salary is then updated.
  var employeeSalary = Number(empInfo.substring(1));
  totalSalary = Math.round(totalSalary-(employeeSalary/12));
  updateSalary();
}
//This function updates the total salary that is displayed on the screen. The actual calculations are handled in lowerSalary and addSalary.
function updateSalary(){
  $('.salary').remove();
  $('.salarycontainer').append('<p class="salary">Total Monthly Salary: $' + totalSalary + '</p>');
}
});
