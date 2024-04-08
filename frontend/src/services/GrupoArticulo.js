import axios from "./axios";

const listarGruposArticulo = async (token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/grupo-articulo`).then(res => res.data)
}


const listarGrupoArticulos = async ({ page, limit, filters = '' }, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/grupo-articulo/listar?page=${page}&limit=${limit}&filter=${filters}`).then(res => res.data)
}

const crearGrupoArticulo = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/grupo-articulo`, data).then(res => res.data)
}

const actualizarGrupoArticulo = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.put(`${process.env.REACT_APP_API}business/api/grupo-articulo/${data.id}`, data).then(res => res.data)
}

const eliminarGrupoArticulo = async (id, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.delete(`${process.env.REACT_APP_API}business/api/grupo-articulo/${id}`).then(res => res.data)
}

const importarGrupoArticulos = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/grupo-articulo/import-data`, data)
        .then(res => res.data)
        .catch(error => {
            console.log(error)
            return error
        })
}

export {
    listarGruposArticulo,
    listarGrupoArticulos,
    crearGrupoArticulo,
    actualizarGrupoArticulo,
    eliminarGrupoArticulo,
    importarGrupoArticulos
}
