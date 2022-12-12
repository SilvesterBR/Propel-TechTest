const express = require('express');
const app = express();
const port = 5000;

const testData = [
	{
		"first_name": "David",
		"last_name": "Platt",
		"phone": "01913478234",
		"email": "david.platt@corrie.co.uk"
	},{
		"first_name": "Jason",
		"last_name": "Grimshaw",
		"phone": "01913478123",
		"email": "jason.grimshaw@corrie.co.uk"
	},{
		"first_name": "Ken",
		"last_name": "Barlow",
		"phone": "019134784929",
		"email": "ken.barlow@corrie.co.uk"
	},{
		"first_name": "Rita",
		"last_name": "Sullivan",
		"phone": "01913478555",
		"email": "rita.sullivan@corrie.co.uk"
	},{
		"first_name": "Steve",
		"last_name": "McDonald",
		"phone": "01913478555",
		"email": "steve.mcdonald@corrie.co.uk"
	}
]

app.listen(port, () => console.log(`Listening on port ${port}`))