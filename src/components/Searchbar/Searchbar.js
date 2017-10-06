import React from 'react';
import Autosuggest from 'react-autosuggest';
import './Searchbar.css';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/interval';
import {searchUser} from "../../services/search.service";
import DataBank from "../../services/databank";


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
        <div>
            <img className="react-autosuggest__suggestion__avatar" src={`${suggestion.avatar_url}`} alt=""/>
            <span className="react-autosuggest__suggestion__username">{suggestion.login}</span>
        </div>
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
            rateLimit: {
                count: 10,
                resetTimer: 0,
                timeRemainingToReset: 0
            }
        };
        setInterval(() => {
            let timeLeft = new Date(parseInt(this.state.rateLimit.resetTimer) * 1000) - Date.now();
            this.setState({
                rateLimit: {
                    ...this.state.rateLimit,
                    timeRemainingToReset: (timeLeft > 0) ? Math.floor(timeLeft / 1000) : 60,
                    count: ( timeLeft < 0) ? 10 : this.state.rateLimit.count
                },
                error: ( timeLeft < 0) ? '' : this.state.error
            });
        }, 1000)

    }

    loadSuggestions(value) {
        this.setState({
            isLoading: true
        });
        Observable.of(retrieveMatchingSuggestions(value))
            .switchMap(filtered => filtered.length ? Observable.of(filtered) : searchUser(value))
            .subscribe(result => {
                //set loading to false
                this.setState({isLoading: false});

                //results
                this.setState({
                    suggestions: retrieveMatchingSuggestions(value)
                });

                //results from server
                if (result.rateLimit) {
                    this.setState({rateLimit: Object.assign({}, {...this.state.rateLimit}, {...result.rateLimit})});
                }

                //error handling
                if (result.status === 403) {
                    this.setState({
                        suggestions: [],
                        error: 'Rate Limit Exceeded',
                        rateLimit: {
                            ...this.state.rateLimit,
                            count: 0
                        }
                    });
                }

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
        const {value, suggestions, isLoading, rateLimit} = this.state;
        const inputProps = {
            placeholder: "Type to search..",
            value,
            onChange: this.onChange,
            disabled: !(!!rateLimit.count)
        };
        const status = (isLoading ? 'Fetching some juice...' : '');

        return (
            <div className="container" style={{marginTop: '1em'}}>
                <div className="row">
                    <div className="two columns">&nbsp;</div>
                    <div className="eight columns">
                        <div className="status">
                            <span>{status}</span>
                            <span className="u-pull-right">Rate Limit: {this.state.rateLimit.count}</span>
                            <span
                                className="u-pull-right">Refresh Timer: {this.state.rateLimit.timeRemainingToReset}</span>
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