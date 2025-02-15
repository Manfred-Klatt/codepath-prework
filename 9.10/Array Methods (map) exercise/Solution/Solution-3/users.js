const users = [
	{firstName: "Alice", lastName: "Johnson", points: 120},
	{firstName: "Bob", lastName: "Smith", points: 99},
	{firstName: "Charlie", lastName: "Brown", points: 180}
];

const newUsers = users.map(function (user)
                           {
	                           return {
		                           fullName: `${user.firstName} ${user.lastName}`,
		                           membershipStatus: user.points > 100 ? "Premium" : "Standard"
	                           };
                           });

console.log(newUsers);
