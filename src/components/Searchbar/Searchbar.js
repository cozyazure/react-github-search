import React from 'react';
import './Searchbar.css';

const Searchbar = (props) => {
    return (
        <div className="container">
            <div className="row">
                <div className="four columns">&nbsp;</div>
                <div className="four columns searchbar">
                    <input className="u-full-width" type="text" placeholder="Search anything.."/>
                </div>
                <div className="four columns">&nbsp;</div>
            </div>
        </div>
    )
}
export default Searchbar;