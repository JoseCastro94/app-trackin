import axios from "./axios";

const listarHistorialResponsableAlmacen = async (token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/historial-responsable-almacen`).then(res => res.data)
}

const guardarHistorialResponsableAlmacen = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/historial-responsable-almacen`, data).then(res => res.data)
}

const generarCargoHistorialResponsableAlmacenPdf = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/historial-responsable-almacen/generar-cargo`, data, {
        responseType: 'blob',
        timeout: 30000,
    }).then(res => res.data)
}

const subirCargoResponsableAlmacen = async (file, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/historial-responsable-almacen/subir-cargo`, file).then(res => res.data)
}

export {
    guardarHistorialResponsableAlmacen,
    listarHistorialResponsableAlmacen,
    generarCargoHistorialResponsableAlmacenPdf,
    subirCargoResponsableAlmacen
}
