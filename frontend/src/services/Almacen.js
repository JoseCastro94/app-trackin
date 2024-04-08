import axios from "./axios";

const listarAlmacenes = async ({ page, limit, filters = '' } = {}, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    if (!page || !limit)
        return axios.get(`${process.env.REACT_APP_API}business/api/almacenes`).then(res => res.data)
    return axios.get(`${process.env.REACT_APP_API}business/api/almacenes?page=${page}&limit=${limit}&filter=${filters}`).then(res => res.data)
}

const crearAlmacen = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/almacenes`, data).then(res => res.data)
}

const actualizarAlmacen = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.put(`${process.env.REACT_APP_API}business/api/almacenes`, data).then(res => res.data)
}

const eliminarAlmacen = async (id, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.delete(`${process.env.REACT_APP_API}business/api/almacenes/${id}`).then(res => res.data)
}

const importarAlmacenes = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/almacenes/import-data`, data)
        .then(res => res.data)
        .catch(error => {
            console.log(error)
            return error
        })
}

export {
    listarAlmacenes,
    crearAlmacen,
    actualizarAlmacen,
    eliminarAlmacen,
    importarAlmacenes
}
