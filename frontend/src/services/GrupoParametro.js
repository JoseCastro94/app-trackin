import axios from "./axios";

const listarGrupoParametros = async ({ page, limit, filters = '' }, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/grupo-parametro?page=${page}&limit=${limit}&filter=${filters}`).then(res => res.data)
}

const crearGrupoParametro = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/grupo-parametro`, data).then(res => res.data)
}

const actualizarGrupoParametro = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.put(`${process.env.REACT_APP_API}business/api/grupo-parametro`, data).then(res => res.data)
}

const eliminarGrupoParametro = async (id, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.delete(`${process.env.REACT_APP_API}business/api/grupo-parametro/${id}`).then(res => res.data)
}

const importarGrupoParametros = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/grupo-parametro/import-data`, data)
        .then(res => res.data)
        .catch(error => {
            console.log(error)
            return error
        })
}

export {
    listarGrupoParametros,
    crearGrupoParametro,
    actualizarGrupoParametro,
    eliminarGrupoParametro,
    importarGrupoParametros
}
