/* Task 1: Declare a Destination Variable */
let destination = "Ancient Egypt";
console.log(`Destination: ${destination}`);

/* Task 2: Change the Destination */
destination = "Medieval Europe";
console.log(`New Destination: ${destination}`);

/* Task 3: Declare a Constant Travel Date */
const travelDate = "2030-03-15";
console.log(`Travel Date: ${travelDate}`);/*

 * Observations:
 * This results in an error because "const" variables cannot be reassigned.
 */

/* Task 4: Experiment with Variable Hoisting */
console.log(`Time Machine Model: ${timeMachineModel}`);
var timeMachineModel = "T-800";/*

 * Observations:
 * The console.log returns "undefined" because of variable hoisting. 
 * "timeMachineModel" is declared with "var", so its declaration is hoisted to the top.
 * In this case, assignment occurs after the console.log statement, which is why it returns "undefined".
 */
