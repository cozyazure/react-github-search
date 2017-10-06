import {dedupeArray} from '../helper';

it('should remove duplicates in the array, based on the property supplied', () => {
    let dupes = [
        {login: 'jon', avatar_url: 'abc'},
        {login: 'jon', avatar_url: 'abc'},
        {login: 'doe', avatar_url: 'abc'}];
    let dedupe = dedupeArray(dupes, "login");
    expect(dedupe.length).toBe(2);
});