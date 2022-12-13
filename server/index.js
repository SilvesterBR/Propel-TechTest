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

class UserDatabase{
    constructor(users = []){
        this.users = users.map((user, i) => (new User({...user, id: i})));
    }

    DeleteUser(id){
        if(!this.GetUser(id)) throw { status: 404, message: "User not found" }
        this.users = this.users.filter(user => user.id != id);
        return { status: 200, message: "User deleted successfully." }
    }

    /**@returns {User} */
    GetUser(id){
        const user = this.users.find(user => user.id == id)
        return user;
        
    }

    AddUser(user){
        if((user instanceof User) == false) throw "user must be of type new User()"
        const id = this.GetNewId()
        user.SetId(id)
        this.users.push(user)
    }

    GetNewId(){
        return Math.max(...this.users.map(user => user.id)) + 1
    }
}

class UsersAPI{
    constructor(app, database, options){
        this.app = app;
        this.port = options.port;
        /**@type {UserDatabase} */
        this.database = database;
    }

    init(){
        this.app.use(bodyParser.json())

        this.HttpGet();
        this.HttpDelete();
        this.HttpPost();

        this.app.listen(this.port, () => console.log(`Listening on port ${port}`))
    }

    HttpGet(){
        this.app.get('/users', (req, res) => {
            res.status(200).json(database.users)
        });
        this.app.get('/users/:id', (req, res) => {
            const id = req.params.id;

            const user = this.database.GetUser(id)
            if(!user) return res.status(500).json({ status: 404, message: "User not found" })
            res.status(200).json(user.toJSON())

        });
    }

    HttpPost(){
        this.app.post('/users', (req, res) => {

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

            this.database.AddUser(new User({first_name, last_name, phone, email}))

            res.status(200).json();

        })
    }

    HttpDelete(){
        this.app.delete('/users/:id', (req, res) => {
            const id = req.params.id;
            try {
                const response = database.DeleteUser(id)
                res.status(200).json(response)
            } catch (error) {                
                res.status(500).json(error)
            }    
        })
    }
}

class User{
    constructor({id, first_name, last_name, phone, email}){
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.email = email;
    }

    SetId(id){
        this.id = id;
    }
    toJSON(){
        return(
            {
                id: this.id,
                first_name: this.first_name,
                last_name: this.last_name,
                phone: this.phone,
                email: this.email,
            }
        )
    }
}

const database = new UserDatabase(testData.map(user => new User(user)));
new UsersAPI(app, database ,{
    port: port
}).init()
