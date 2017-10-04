import React from 'react';
import Autosuggest from 'react-autosuggest';
import './Searchbar.css';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import {search} from "../../services/search.service";
import DataBank from "../../services/initial-data";


const retrieveMatchingSuggestions = (value) => {

    const escapedValue = sanitizeInput(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return DataBank.users.filter(user => regex.test(user.login));
};

const sanitizeInput = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getSuggestionValue = (suggestion) => {
    return suggestion.login;
};

const renderSuggestion = (suggestion) => {
    return (
        <span>{suggestion.login}</span>
    );
};

class Searchbar extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
            suggestions: [],
            isLoading: false,
            error: "",
        };
    }

    loadSuggestions(value) {
        this.setState({
            isLoading: true
        });
        Observable.of(retrieveMatchingSuggestions(value))
            .switchMap(filtered => filtered.length ? Observable.of(filtered) : search(value))
            .subscribe(result => {
                this.setState({
                    isLoading: false,
                    suggestions: result.status === 403 ? [] : retrieveMatchingSuggestions(value),
                    error: result.status === 403 ? 'Rate Limit Exceeded' : ''
                });
            })
        ;
    }

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({value}) => {
        this.loadSuggestions(value);
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const {value, suggestions, isLoading, error} = this.state;
        const inputProps = {
            placeholder: "Type to search..",
            value,
            onChange: this.onChange,
            disabled: !!error
        };
        const status = (isLoading ? 'Fetching some juice...' : ' ');

        return (
            <div className="container" style={{marginTop: '1em'}}>
                <div className="row">
                    <div className="two columns">&nbsp;</div>
                    <div className="eight columns">
                        <div className="status">
                            {status}
                        </div>
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}/>
                        <div className="error">{this.state.error}</div>

                    </div>
                    <div className="two columns">&nbsp;</div>
                </div>
            </div>
        );
    }
}

export default Searchbar;