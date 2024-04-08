import CustomResponse from '../utils/CustomResponse.js'

class BaseController extends CustomResponse {
    constructor(req, res) {
        super();
        this.req = req
        this.res = res
    }
}

export default BaseController