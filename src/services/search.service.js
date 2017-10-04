import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import request from 'superagent';
import observify from 'superagent-rxjs';
import DataBank from "./initial-data";

const GITHUB_URL = "https://api.github.com/search/users";

observify(request);
export const search = (query) => {
    return request.get(`${GITHUB_URL}?q=${query}`).observify()
        .map(serverResponse => {
            let results = serverResponse.body;
            let destructured = results.items.map(item => ({login: item.login, avatar_url: item.avatar_url}));
            return DataBank.users = [...new Set([...destructured, ...DataBank.users])];
        })
        .catch(error=>Observable.of(error));

};