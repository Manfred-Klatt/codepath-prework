// Task 1: Declare The Task Array and The Interval ID
let oneTimeTasks = [];
let monitoringTaskId;


// Task 2: Add One-Time Task Function
function addOneTimeTask (func, delay)

{
	oneTimeTasks.push({function: func, delay: delay});
}


// Task 3: Run One-Time Tasks Function
function runOneTimeTasks ()
{
	for (const oneTimeTask of oneTimeTasks)
	{
		setTimeout(oneTimeTask.function, oneTimeTask.delay);
	}
}

// Task 4: Start Monitoring Function
function startMonitoring ()
{
	console.log("Starting continuous monitoring of space station parameters...");

	monitoringTaskId = setInterval(
		function ()
		{
			console.log("Monitoring space station conditions...");

			const oxygenLevel = Math.random() * 100;
			const powerStatus = Math.random() > 0.1 ? "Stable" : "Critical";
			const communicationCheck = Math.random() > 0.05 ? "All systems go" : "Communication error";
			console.log(`Oxygen Level: ${oxygenLevel.toFixed(2)}% | Power Status: ${powerStatus} | Communication: ${communicationCheck}`);
		},
		2000
	);
}

// Task 5: Stop Monitoring Function
function stopMonitoring ()
{
	clearInterval(monitoringTaskId);
	console.log("Continuous monitoring stopped.");
}

// Task 6: Start Countdown Function
function startCountdown (duration)
{
	let timeLeft = duration;
	console.log(`Countdown started: ${timeLeft} seconds`);

	const countdownTimerId = setInterval(
		function ()
		{
			timeLeft--;
			console.log(`T-minus ${timeLeft} seconds`);

			if (timeLeft <= 0)
			{
				clearInterval(countdownTimerId);
				console.log("Liftoff! The rocket has successfully launched into space!");
			}
		},
		1000
	);
}

// Task 7: Schedule Pre-Launch Activities and Launch
function scheduleMission ()
{
	startMonitoring();
	addOneTimeTask(function () {console.log("Pre-launch system check complete.");}, 5000);
	addOneTimeTask(stopMonitoring, 10000);
	addOneTimeTask(function () {startCountdown(10);}, 15000);

	runOneTimeTasks();
}

scheduleMission();
