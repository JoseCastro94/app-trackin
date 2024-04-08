import axios from "./axios";

const list = async ({ estado, token, tokenCompany }) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/solicitudes${estado ? `?estado=${estado}` : ''}`).then(res => res.data)
}

const listarPorCodigoDeSolicitud = async (ids, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/solicitudes`, {
        solicitudes: ids
    }).then(res => res.data)
}

const listDevoluciones = async ({ estado, token, tokenCompany }) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/solicitudes/devoluciones${estado ? `?estado=${estado}` : ''}`).then(res => res.data)
}

const listarCantidadEstados = async ({ tipo = 'PEDIDO', token, tokenCompany }) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/solicitudes/estados?tipo=${tipo}`).then(res => res.data)
}

const listarPorCodigoDeSolicitudesDevolucion = async (ids, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/solicitudes/devoluciones`, {
        solicitudes: ids
    }).then(res => res.data)
}

export {
    list,
    listarPorCodigoDeSolicitud,
    listDevoluciones,
    listarPorCodigoDeSolicitudesDevolucion,
    listarCantidadEstados
}
