import {searchUser} from "../search.service";
import 'rxjs/add/operator/do';
import {mockSearchResponse} from '../__mockData__/mockSearchResponse'

jest.mock('../request.js');

it("search service should executed successfully", (done) => {
    searchUser("test")
        .subscribe(({rateLimit}) => {
            let expectedRateLimit = {
                count: mockSearchResponse.headers["x-ratelimit-remaining"],
                resetTimer: mockSearchResponse.headers["x-ratelimit-reset"],
            };
            expect(rateLimit).toEqual(expectedRateLimit);
            done()
        })

});