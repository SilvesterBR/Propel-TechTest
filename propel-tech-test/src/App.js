import './App.css';
import {useState} from 'react'

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

function App() {

	const defaultUsers = testData;
	const [searchValue, setSearchValue] = useState("")
	const [users, setUsers] = useState(testData)

	return (
		<div className="App">
			<h1>Welcome to Propel</h1>
			<div className="content">
				<label className='search-box' htmlFor="search-box">Search:</label>
				<input className='input-box' id='search-box' placeholder='Name' type="text" onChange={(e) => {
					if(e.target.value){
						setUsers(defaultUsers.filter(user => Object.values(user).find(userField => userField.includes(e.target.value))))
					}else{
						setUsers(defaultUsers)
					}

				}}/>
				<div className="data">
					<UserData 
						keyValue={["Name", "Email"]} 
						values={users.map(user => [`${user.first_name[0]}.${user.last_name}`, user.email])} 
						searchTerm={searchValue}
					/>
				</div>
			</div>
		</div>
	);
}

function UserData({keyValue, values, setUsers}){

	return(
		<div className="data-category">

			<div className="category-names">
				{ keyValue.map((key, i) => <div className="category-container" key={i}><label className='category-label' htmlFor="">{key}</label></div>) }
				<div className="category-container-delete"></div>
			</div>

	 		<ul className='data-list'>
				{
					values.map((value, i) => <li className='data-list-field' key={i}><UserItem values={value}></UserItem></li>)
				}
 			</ul>
		</div>
	)
}

function UserItem({values, setUsers}){	
	return (
		<div className="list-item">
			{ 
				values.map((value, i) =>
					<div key={i} className="item-element">
						<label htmlFor="">{value}</label>
					</div>
				) 
			}
			<button htmlFor="" className='user-delete'>Delete</button>
		</div>
	)
}

export default App;
