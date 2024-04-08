import axios from "./axios";

const listarArticulos = async ({ page, limit, filters = '' }, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/articulos?page=${page}&limit=${limit}&filter=${filters}`).then(res => res.data)
}

const crearArticulos = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/articulos`, data).then(res => res.data)
}

const actualizarArticulo = async (data, token, tokenCompany) => {
    console.log("data")
    console.log(data.ArticuloNegocios)
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.put(`${process.env.REACT_APP_API}business/api/articulos`, data).then(res => res.data)
}

const listarNegociosArticuloFiltro = async ({ page, limit, filters = '' } = {}, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    if (!page || !limit)
        return axios.get(`${process.env.REACT_APP_API}business/api/articulos/negocio/lista?filter=${filters}`).then(res => res.data)
    return axios.get(`${process.env.REACT_APP_API}business/api/articulos/negocio/lista?page=${page}&limit=${limit}&filter=${filters}`)
        .then(res => res.data)
}

const eliminarArticulo = async (idsArtiuclos, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.put(`${process.env.REACT_APP_API}business/api/articulos/eliminar`,idsArtiuclos).then(res => res.data)
}

const listarArticulosSap = async ({ page, limit, filters = '' }, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}api-external/articulo/list?page=${page}&limit=${limit}&filter=${filters}`,).then(res => res.data)
}

const buscarArticuloSap = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api-external/articulo`, data).then(res => res.data)
}

const importarArticulos = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/articulos/import-data`, data)
        .then(res => res.data)
        .catch(error => {
            console.log(error)
            return error
        })
}

const descargarFichaTecnica = async (id, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/articulos/download-file/${id}`, {
        responseType: 'blob',
        timeout: 30000,
    }).then(res => res.data)
}

export {
    listarArticulos,
    listarNegociosArticuloFiltro,
    crearArticulos,
    actualizarArticulo,
    eliminarArticulo,
    buscarArticuloSap,
    importarArticulos,
    listarArticulosSap,
    descargarFichaTecnica
}
