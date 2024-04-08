import axios from "./axios";

const listTransferencia = async ({ estado, token, tokenCompany }) => {
   
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    const url = `${process.env.REACT_APP_API}business/api/solicitudesTransferencia${estado ? `?estado=${estado}` : ''}`
    
    return axios.get(url).then(res => res.data)
}

const listarCantidadEstadosTransferencia = async ({ tipo = 'PEDIDO', token, tokenCompany }) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/solicitudesTransferencia/estados?tipo=${tipo}`).then(res => res.data)
}

const listarPorCodigoDeSolicitudTransferencia = async (ids, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/solicitudesTransferencia`, {
        solicitudes: ids
    }).then(res => res.data)
}

const rechazarSolicitud = async (token, tokenCompany, idSolicitud) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    const url = `${process.env.REACT_APP_API}business/api/solicitudesTransferencia/rechazar?idSolicitud=${idSolicitud}`;
    console.dir(url);
    return axios.delete(url).then(res => res.data);
}

const aprobarSolicitudPendienteAprobacion = async (token, tokenCompany, data) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    const url = `${process.env.REACT_APP_API}business/api/solicitudesTransferencia/aprobarPendienteAprobacion`;
    console.dir(url);
    return axios.post(url, data).then(res => res.data)
}

export {
    listTransferencia,
    listarPorCodigoDeSolicitudTransferencia,
    listarCantidadEstadosTransferencia,
    rechazarSolicitud,
    aprobarSolicitudPendienteAprobacion
}
