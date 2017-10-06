import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import request from 'superagent';
import observify from 'superagent-rxjs';
import DataBank from "./databank";
import {dedupeArray} from "./helper";

const GITHUB_URL = "https://api.github.com/search/users";

observify(request);
export const search = (query) => {
    return request.get(`${GITHUB_URL}?q=${query}`).observify()
        .do(serverResponse => {
            let results = serverResponse.body;
            let concat = DataBank.users.concat(results.items.map(item => ({
                login: item.login,
                avatar_url: item.avatar_url
            })));
            DataBank.users = dedupeArray(concat,"login");
        })
        .map(serverResponse => {
            return {
                rateLimit: {
                    count: serverResponse.headers["x-ratelimit-remaining"],
                    resetTimer: serverResponse.headers["x-ratelimit-reset"],
                }
            }
        })
        .catch(error => Observable.of(error));

};