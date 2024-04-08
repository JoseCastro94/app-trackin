import axios from "./axios";

const buscarEmpresaPorRuc = async (ruc, token) => {
    axios.defaults.headers.common['token'] = token
    return axios.post(`${process.env.REACT_APP_API}business/api/empresas/${ruc}`)
        .then(res => res.data)
        .catch(error => {
            console.log('ERROR GUARDAR ENTREGA')
            alert('Error Interno')
        })
}

const listarEmpresas = async ({ page, limit, filters = '' }, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/empresas?page=${page}&limit=${limit}&filter=${filters}`).then(res => res.data)
}

const crearEmpresa = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/empresas`, data).then(res => res.data)
}

const actualizarEmpresa = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.put(`${process.env.REACT_APP_API}business/api/empresas`, data).then(res => res.data)
}

const eliminarEmpresa = async (id, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.delete(`${process.env.REACT_APP_API}business/api/empresas/${id}`).then(res => res.data)
}

const importarEmpresas = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/empresa/import-data`, data)
        .then(res => res.data)
        .catch(error => {
            console.log(error)
            return error
        })
}

export {
    buscarEmpresaPorRuc,
    listarEmpresas,
    crearEmpresa,
    actualizarEmpresa,
    eliminarEmpresa,
    importarEmpresas
}
