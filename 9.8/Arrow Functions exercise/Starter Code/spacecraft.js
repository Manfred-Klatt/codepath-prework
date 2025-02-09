/* Task 1: No Parameters: Activate Hyperdrive */
const activateHyperdrive = () => console.log("Hyperdrive activated!");
activateHyperdrive();

/* Task 2: Implicit Return: Scan for Lifeforms */
const scanForLife = () => "No lifeforms detected";
console.log(scanForLife());

/* Task 3: Implicit Return with Objects: Log Coordinates */
const currentCoordinates = () => ({x: 42, y: 87, z: 91});
console.log(currentCoordinates());

/* Task 4: Understanding `this`: Message from Home Base */
const spacecraft = {
	name: "Galactic Voyager",
	receiveMessage: (message) =>
	{
		console.log(`Message received: ${message}`);
		console.log(`This spacecraft is: ${this.name}`);
	}
};
spacecraft.receiveMessage("Hello from Earth!");
/*
 * Observations:
    The console.log returns "undefined" for `this.name` because arrow functions do not have their own `this` context.
    Instead, they inherit `this` from the parent scope at the time they are defined.
    In this case, `this` does not refer to the `spacecraft` object.
 */
