import axios from "./axios";

const listarNegocios = async ({ page, limit, filters = '' } = {}, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    if (!page || !limit)
        return axios.get(`${process.env.REACT_APP_API}business/api/negocios`).then(res => res.data)
    return axios.get(`${process.env.REACT_APP_API}business/api/negocios?page=${page}&limit=${limit}&filter=${filters}`)
        .then(res => res.data)
}

const listarNegociosStock = async ({ page, limit, filters = '' } = {}, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    if (!page || !limit)
        return axios.get(`${process.env.REACT_APP_API}business/api/tipo_negocio/getStockNegocios`).then(res => res.data)
    return axios.get(`${process.env.REACT_APP_API}business/api/tipo_negocio/getStockNegocios?page=${page}&limit=${limit}&filter=${filters}`)
        .then(res => res.data)
}

const listarNegociosArticulo = async ({ page, limit, filters = '' } = {}, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    if (!page || !limit)
        return axios.get(`${process.env.REACT_APP_API}business/api/negocios/articulos/lista`).then(res => res.data)
    return axios.get(`${process.env.REACT_APP_API}business/api/negocios/articulos/lista?page=${page}&limit=${limit}&filter=${filters}`)
        .then(res => res.data)
}


const listarNegociosConEmpresa = async ({ page, limit, filters = '' }, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/negocios/listar?page=${page}&limit=${limit}&filter=${filters}`)
        .then(res => res.data)
}

const crearNegocio = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/negocios`, data).then(res => res.data)
}

const actualizarNegocio = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.put(`${process.env.REACT_APP_API}business/api/negocios/${data.id}`, data).then(res => res.data)
}

const eliminarNegocio = async (id, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.delete(`${process.env.REACT_APP_API}business/api/negocios/${id}`).then(res => res.data)
}

const importarNegocios = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/negocios/import-data`, data)
        .then(res => res.data)
        .catch(error => {
            console.log(error)
            return error
        })
}

export {
    listarNegocios,
    listarNegociosStock,
    listarNegociosArticulo,
    listarNegociosConEmpresa,
    crearNegocio,
    actualizarNegocio,
    eliminarNegocio,
    importarNegocios
}
