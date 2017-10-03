import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Searchbar from './components/Searchbar/Searchbar';

class App extends Component {
    render() {
        return (
            <div>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h1 className="App-title">Github Search Autocomplete</h1>
                    </header>
                </div>
                <div>
                    <Searchbar/>
                </div>
            </div>


        );
    }
}

export default App;
