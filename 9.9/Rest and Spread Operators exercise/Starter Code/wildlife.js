/* Task 1: Track Animal Sightings */
function logAnimalSightings (...animals)
{
	console.log(`Animal Sightings: ${animals}`);
}

logAnimalSightings("Elephant", "Lion", "Tiger", "Rhino", "Leopard", "Cheetah", "Giraffe", "Zebra", "Hippo", "Crocodile");

/* Task 2: Merge Habitat Areas */
const forestHabitats = ["Forest A", "Forest B"];
const savannahHabitats = ["Savannah C", "Savannah D"];
const combinedHabitats = [...forestHabitats, ...savannahHabitats];
console.log(`Combined Habitats: ${combinedHabitats}`);

/* Task 3: Update Conservation Status */
const rhinoStatus = {
	population: 500,
	status: "Endangered"
};
const updatedRhinoStatus = {
	...rhinoStatus,
	population: 520,
	status: "Vulnerable"
};
console.log(`Updated Rhino Status: ${updatedRhinoStatus}`);

/* Task 4: Catalog Genetic Diversity */
const lionProfile = {
	name: "Leo",
	age: 5,
	species: "Lion"
};
const lionGeneticProfile = {
	...lionProfile,
	genetics: "Diverse"
};
console.log(`Original Lion Profile: ${lionProfile}`);
console.log(`Lion Genetic Profile:" ${lionGeneticProfile}`);
/*
 * Observations:
 * Modifying a property in the copied object does not affect the original object because the spread operator creates a shallow copy of the object.
 * This means top-level properties are duplicated and assigned new memory space.
 */

/* Task 5: Analyze Ecosystem Health */
const ecosystemHealth = {
	waterQuality: "Good",
	foodSupply: {
		herbivores: "Abundant",
		carnivores: "Sufficient"
	}
};
const updatedEcosystemHealth = {...ecosystemHealth, foodSupply: {...ecosystemHealth.foodSupply, herbivores: "Plentiful"}};
console.log("Original Ecosystem Health:", ecosystemHealth);
console.log("Updated Ecosystem Health:", updatedEcosystemHealth);

/*
 * Observations:
 * Making changes to a nested property in a shallow copy also applies the same changes to the original object.
 * The spread operator performs a shallow copy, which means that nested objects are not duplicated but rather reference the same object in memory. 
*/ 
