import axios from "axios";

axios.interceptors.request.use(req => {
    console.log(req.method.toUpperCase())
    if (req.method.toUpperCase() === 'GET') {
        const  headers = {...req.headers}
        headers['Cache-Control'] = 'no-cache'
        headers['Pragma'] = 'no-cache'
        headers['Expires'] = '0'
        req.headers = headers
    }
    return req
}, error => {
    return Promise.reject(error);
})

axios.interceptors.response.use(res => {
    return res
}, error => {
    console.log('error', error)
    console.log('error.response', error.response)
    console.log('error.response.data', error.response.data)
    return Promise.reject(error.response.data)
    // return Promise.resolve(error.response)
})

//axios.defaults.headers.common['Cache-Control'] = 'no-cache'
//axios.defaults.headers.common['Pragma'] = 'no-cache'
//axios.defaults.headers.common['Expires'] = '0'

export default axios
