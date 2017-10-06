import React from 'react';
import Searchbar from './Searchbar';
import Autosuggest from 'react-autosuggest';
import renderer from 'react-test-renderer';
import {shallow, configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('Should render searchbar properly', () => {
    const component = renderer.create(
        <Searchbar/>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});

it('should render ratelimit and refresh timer', () => {
    const searchBar = shallow(<Searchbar/>);
    expect(searchBar.find('.status').text()).toBe('Rate Limit: 10Refresh Timer: 0');
});