//third party imports
import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { MdSearch } from 'react-icons/md';
import { IconContext } from 'react-icons';

//components imports
import Table from "./components/Table";

//services imports
import {getBanksDetails} from "./services/BankService";

//css imports
import './App.css';

const categories = [
  'IFSC',
  'Branch',
  'Address'
];
const cities = [
  'Mumbai',
  'Chennai',
  'Bengaluru',
  'Hydrabad',
  'Delhi'
];

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      city: '',
      category: '',
      searchKey: '',
      message: '',
      columns: [{
        Header: 'Banks',
        accessor: 'bank_name',
      },{
        Header: 'IFSC',
        accessor: 'ifsc',
      },{
        Header: 'Branch',
        accessor: 'branch',
      },{
        Header: 'Bank ID',
        accessor: 'bank_id',
      },{
        Header: 'Address',
        accessor: 'address',
      }],
      banksData: [],
      response: []
    }
    this.triggerSearch = this.triggerSearch.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  componentDidMount(){
    let city = cities[0];
    this.setState({
      message: 'Loading...'
    });
    getBanksDetails(city).then(response => {
      this.setState({
        banksData: response,
        response,
        city,
        message: response.length === 0 ? 'No rows to show' : ''
      })
    });
  }

  handleCityChange({value: city}){
    this.setState({
      message: 'Loading...'
    });
    getBanksDetails(city).then(response => {
      this.setState({
        banksData: response,
        response,
        city
      })
      this.triggerSearch(this.state.searchKey);
    });
  }

  handleCategoryChange({value: category}){
    this.setState({
     category
    });
    this.triggerSearch(this.state.searchKey);
  }

  //This method avoids triggering search for evety keyup 
  debounce(){
    let timer;
    return (event) => {
      let value = event.target.value;
      if(timer){
        clearTimeout(timer);
      }
      timer = setTimeout(()=>{
        this.triggerSearch(value);
        clearTimeout(timer);
      },200);
    }
  }

  triggerSearch(searchKey){
    this.setState((prevState) => {
      let banksData = [];
      if(prevState.category !== ''){
        banksData = prevState.response.filter((row)=>row[prevState.category.toLowerCase()].toString().toLowerCase().includes(searchKey.toLowerCase()))
      }else {
        banksData = prevState.response.filter((row)=>Object.values(row).toString().toLowerCase().includes(searchKey.toLowerCase()))
      }
      return {
        banksData,
        searchKey,
        message: banksData?.length === 0 ? 'No rows to show' : ''
      }
    });
  }

  render(){
    return(
      <div className="app">
        <header>
          <div className="header-text">Banks</div>
          <Dropdown 
            placeholder="Select city" 
            options={cities} 
            value={this.state.city}
            onChange={this.handleCityChange}>
          </Dropdown>
          <Dropdown 
            options={categories} 
            placeholder="Select category" 
            value={this.state.category}
            onChange={this.handleCategoryChange}>
          </Dropdown>
          <div className="input-with-icon">
            <IconContext.Provider value={{ className: "search-icon" }}>
              <MdSearch/>
            </IconContext.Provider>
            <input 
              type="serach" 
              className="search-field" 
              onKeyUp={this.debounce()}
            />
          </div>
        </header>
        {
          this.state.message ? <div className="message-text">{this.state.message}</div> 
          :
         <div className="table-container">
           <Table columns={this.state.columns} data={this.state.banksData}></Table>
          </div>
       }
      </div>
    )
  }
}

export default App;
