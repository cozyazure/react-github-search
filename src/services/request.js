import request from 'superagent';
import observify from 'superagent-rxjs';

observify(request);

const get = (url) => {
    return request.get(url).observify();
};
const httpRequest = {get};
export default httpRequest;

