const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 5000;

var testData = [
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
app.use(bodyParser.json())

app.get('/users', (req, res) => {
    res.status(200).json({
        users: testData
    })
});
app.get('/users/:id', (req, res) => {
    const id = req.params.id;

    res.status  (500).json({
        status: 500,
        message: "Database nonoperational."
    })
});
app.get('/users/:firstname/:lastname', (req, res) => {
    const {firstname , lastname} = req.params
    const user = testData.find(user => user.first_name == firstname && user.last_name == lastname)

    if(!user) return res.status(404).json({
        status: 404,
        message: "User not found"
    })

    res.status(200).json({
        user
    })

});

app.post('/users', (req, res) => {

    const {first_name, last_name, phone, email} = req.body;
    const user = {first_name, last_name, phone, email}
    const errors = [];
    for (let field in user) {
        if(!user[field]) errors.push(field)
    }

    if(errors.length) return res.status(403).json({
        status: 403,
        message: "Invalid details",
        details: "Fields: " + errors.toString()
    })

    res.status(200).json();

})

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    res.status(500).json({
        status: 500,
        message: "Database nonoperational."
    })
})

app.delete('/users/:firstname/:lastname', (req,res) => {

    //NOTE: Not a good idea to delete by first and last name but shows the idea of how to delete
    const {firstname , lastname} = req.params
    const user = testData.find(user => user.first_name == firstname && user.last_name == lastname)
    
    if(!user) return res.status(404).json({
        status: 404,
        message: "User not found"
    })
    testData = testData.filter(user => user.first_name != firstname && user.last_name != lastname)
    res.status(200).json();

})

app.listen(port, () => console.log(`Listening on port ${port}`))