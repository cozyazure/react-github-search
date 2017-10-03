import React from 'react';
import Autosuggest from 'react-autosuggest';
import './Searchbar.css';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/if';
import 'rxjs/add/operator/catch'

const languages = [
    {
        name: 'C',
        year: 1972
    },
    {
        name: 'C#',
        year: 2000
    },
    {
        name: 'C++',
        year: 1983
    },
    {
        name: 'Clojure',
        year: 2007
    },
    {
        name: 'Elm',
        year: 2012
    },
    {
        name: 'Go',
        year: 2009
    },
    {
        name: 'Haskell',
        year: 1990
    },
    {
        name: 'Java',
        year: 1995
    },
    {
        name: 'Javascript',
        year: 1995
    },
    {
        name: 'Perl',
        year: 1987
    },
    {
        name: 'PHP',
        year: 1995
    },
    {
        name: 'Python',
        year: 1991
    },
    {
        name: 'Ruby',
        year: 1995
    },
    {
        name: 'Scala',
        year: 2003
    }
];

const retrieveMatchingSuggestions = (value) => {

    const escapedValue = sanitizeInput(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return languages.filter(language => regex.test(language.name));
};

const sanitizeInput = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getSuggestionValue = (suggestion) => {
    return suggestion.name;
};

const renderSuggestion = (suggestion) => {
    return (
        <span>{suggestion.name}</span>
    );
};

class Searchbar extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
            suggestions: [],
            isLoading: false,
            errorMessage: "",
        };
    }

    loadSuggestions(value) {
        this.setState({
            isLoading: true
        });
        Observable
            .if(() => retrieveMatchingSuggestions(value).length,
                Observable.of(retrieveMatchingSuggestions(value)),
                Observable.of([{
                    name: 'Not found',
                    year: 1972
                }]).delay(2000))
            .subscribe(values => {
                this.setState({
                    isLoading: false,
                    suggestions: values,
                    errorMessage: "LOL"
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    suggestions: [],
                    errorMessage: error.errorMessage
                })
            });
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
        const {value, suggestions, isLoading} = this.state;
        const inputProps = {
            placeholder: "Type 'c'",
            value,
            onChange: this.onChange
        };
        const status = (isLoading ? 'Fetching some juice...' : 'Type to search:');

        return (
            <div className="container">
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
                        <div className="error">{this.state.errorMessage}</div>

                    </div>
                    <div className="two columns">&nbsp;</div>
                </div>
            </div>
        );
    }
}

export default Searchbar;