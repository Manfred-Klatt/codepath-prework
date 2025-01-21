function mysteryOperation ()
{
	const outcome = Math.random(); // Generates a random number between 0 and 1.

	if (outcome < 0.5)
	{
		console.log("The operation is completed successfully!");
	}
	else
	{
		throw new Error("The operation is failed mysteriously!");
	}
}

const numberOfOperations = 20; // The number of operations to be performed.

const daysOnSuccess = 13; // The number of days earned when the operation is completed successfully.

const daysOnFailure = 1; // The number of days earned when the operation is failed.

const daysOnAttendance = 3; // The number of days earned when the detective attends the operation.

let daysEarned = 0; // The total number of days earned by the detective.

for (let i = 0; i < numberOfOperations; i++) // The loop to perform the operations.
{
	try
	{
		mysteryOperation();

		daysEarned += daysOnSuccess; 
	}
	catch (error)
	{
        daysEarned += daysOnFailure;
	}
	finally
	{
		daysEarned += daysOnAttendance;
	}
}

console.log(daysEarned);