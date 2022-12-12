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

	const [searchValue, setSearchValue] = useState("platt");
	
	const parseData = [
		{identifier: "Name", values : testData.map(data => `${data.first_name[0]}.${data.last_name}`)},
		{identifier: "Email", values : testData.map(data => `${data.email}`)},
	]


	const [userInformation, setUserInformation] = useState(parseData)

	return (
		<div className="App">
			<h1>Welcome to Propel</h1>
			<div className="content">
				<label className='search-box' htmlFor="search-box">Search:</label>
				<input className='input-box' id='search-box' placeholder='Name' type="text" onChange={(e) => setSearchValue(e.target.value)}/>
				<div className="data">
					<UserList data={userInformation} searchValue={searchValue}></UserList>
				</div>
			</div>
		</div>
	);
}

function UserList({data, searchValue}){

	const [userData, setUserData] = useState(data)

	return(
		<div className="user-list">
			{
				userData.map((category, i) => {
					return (<ListCategory name={category.identifier} data={category.values} key={i}></ListCategory>)
				})
			}
		</div>
	)
}

function ListCategory({name, data}){
		return(
		<div className="data-category">
			<div className="data-labeling">
				<label className='category-label' htmlFor="search-box">{name}</label>
			</div>
			<ul className='list-category'>
				{
					data.map((value, i) => {
						return(<li className='list-category-item' key={i}><ListItem data={value}></ListItem></li>)
					})
				}
			
			</ul>
		</div>
	)
}

function ListItem({data}){
	return(
		<div className="list-item">{data}</div>
	)
}

export default App;
