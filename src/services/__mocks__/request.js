import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {mockSearchResponse} from '../__mockData__/mockSearchResponse'

const get = (url) => {
    return Observable.of(mockSearchResponse)
};
const httpRequest = {get};
export default httpRequest;

