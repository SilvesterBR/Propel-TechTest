const express = require('express');
const bodyParser = require('body-parser')
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

class UserDatabase{
    constructor(users = []){
        //Map our users to a class
        /**@type {User[]}*/
        this.users = users.map((user, i) => (new User({...user, id: i})));
    }

    /**
     * Delete user from database
     * @param {number} id 
     * @returns {object}
     */
    DeleteUser(id){
        if(!this.GetUser(id)) throw { status: 404, message: "User not found" }
        this.users = this.users.filter(user => user.id != id);
        return { status: 200, message: "User deleted successfully." }
    }

    /**
     * Get user by ID
     * @param {number} id 
     * @returns {User}
     */
    GetUser(id){
        const user = this.users.find(user => user.id == id)
        return user;
        
    }

    /**
     * Insert data into database
     * @param {string} user 
     */
    AddUser(user){

        if((user instanceof User) == false) throw "user must be of type new User()"

        //Insert user into databse with their new ID
        const id = this.GetNewId()
        user.SetId(id)
        this.users.push(user)
    }

    /**
     * Generate a unique ID 
     * @returns {number}
     */
    GetNewId(){
        //Map our users as an array of id's and retrieve the max value
        //NOTE: This would not be done in a real world database, just used for test example
        return Math.max(...this.users.map(user => user.id)) + 1
    }
}

class UsersAPI{
    constructor(app, database, options){
        /**@type {Express} */
        this.app = app;
        /**@type {number} */
        this.port = options.port;
        /**@type {UserDatabase} */
        this.database = database;
    }

    init(){
        //Used to recieved post bodies in JSON format
        this.app.use(bodyParser.json())

        //Initialise endpoints
        this.HttpGet();
        this.HttpDelete();
        this.HttpPost();

        this.app.listen(this.port, () => console.log(`Listening on port ${port}`))
    }

    /**
     * Initialises all our GET methods
     */
    HttpGet(){
        /**
         * Return all users in database
         */
        this.app.get('/users', (req, res) => {
            res.status(200).json(database.users)
        });

        /**
         * Return user by ID
         */
        this.app.get('/users/:id', (req, res) => {
            const id = req.params.id;

            //Get and return user unless error occurs, then respond with error
            const user = this.database.GetUser(id)

            if(!user) return res.status(500).json({ status: 404, message: "User not found" })

            res.status(200).json(user.toJSON())

        });
    }

    /**
     * Initialises all our POST methods
     */
    HttpPost(){

        /**
         * Insert user into database
         */
        this.app.post('/users', (req, res) => {

            const {first_name, last_name, phone, email} = req.body;
            
            //Only take the data we need and igone any other keys
            const user = {first_name, last_name, phone, email};

            const errors = [];

            for (let field in user) {
                //Push each field into `errors` array if field data is undefined 
                if(!user[field]) errors.push(field)
            }

            //Respond with error and list each error to user
            if(errors.length) return res.status(403).json({
                status: 403,
                message: "Invalid details",
                details: "Fields: " + errors.toString()
            })

            //User criteria passed, insert into database
            this.database.AddUser(new User({first_name, last_name, phone, email}))

            //Respon with succcess, could respond with user added
            res.status(200).json();
        })
    }

    /**
     * Initialises all our DELETE methods
     */
    HttpDelete(){
        /**
         * Delete user from database by ID
         */
        this.app.delete('/users/:id', (req, res) => {
            const id = req.params.id;

            //Catch error from `.DeleteUser()` incase we do not find a valid user
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
        /**@type {string} */
        this.id = id;
        /**@type {string} */
        this.first_name = first_name;
        /**@type {string} */
        this.last_name = last_name;
        /**@type {string} */
        this.phone = phone;
        /**@type {string} */
        this.email = email;
    }

    /**
     * Setter method for id
     * @param {number} id 
     */
    SetId(id){
        this.id = id;
    }

    /**
     * Convert class data into JSON
     * @returns {object}
     */
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

//Initilise our database
const database = new UserDatabase(testData.map(user => new User(user)));

//Initilse our API with given database and port
new UsersAPI(app, database, {
    port: port
}).init()
