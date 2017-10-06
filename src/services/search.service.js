import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import httpRequest from "./request"
import DataBank from "./databank";
import {endpoint} from "../constant/api.endpoint";
import {dedupeArray} from "./helper";


export const searchUser = (query) => {
    return httpRequest.get(`${endpoint}/search/users?q=${query}`)
        .do(serverResponse => {
            let results = serverResponse.body;
            let concat = DataBank.users.concat(results.items.map(item => ({
                login: item.login,
                avatar_url: item.avatar_url
            })));
            DataBank.users = dedupeArray(concat, "login");
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