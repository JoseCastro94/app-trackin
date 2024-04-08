import axios from "./axios";

const guardarMovimientoMercancia = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/ingreso-mercancia`, data)
        .then(res => res.data)
        .catch(error => {
            console.log('ERROR GUARDAR Movimiento Mercancia')
            alert('Error Interno')
        })
}

const listarMovimientoMercancia = async (fechaIni, fechaFin, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/ingreso-mercancia?fecha_ini=${fechaIni}&fecha_fin=${fechaFin}`)
        .then(res => res.data)
}

const generarPdfIngresoMercaderia = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/pdf/generate/ingreso-mercancia`, data, {
        responseType: 'blob',
        timeout: 30000,
    }).then(res => res.data)
}

const subirArchivoIngresoMercaderia = async (file, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/ingreso-mercancia/upload-file`, file).then(res => res.data)
}

const importarMercaderia = async (data, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.post(`${process.env.REACT_APP_API}business/api/ingreso-mercancia/import-data`, data)
        .then(res => res.data)
        .catch(error => {
            console.log(error)
            return error
        })
}

export {
    guardarMovimientoMercancia,
    listarMovimientoMercancia,
    generarPdfIngresoMercaderia,
    subirArchivoIngresoMercaderia,
    importarMercaderia
}
