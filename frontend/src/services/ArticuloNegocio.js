import axios from "./axios";

const listarNegociosPorArticulo = async (id_articulo, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/articulo_negocio/articulo/${id_articulo}/negocios`).then(res => res.data)
}

const listarNegociosPorArticuloNew = async (id_articulo, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/articulo_negocio/articulo/${id_articulo}/negociosnew`).then(res => res.data)
}


const obtenerIdArticuloReal = async (id_articulo,idNegocio, token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/articulo_negocio/articulo/${id_articulo}/${idNegocio}/idArticuloReal`).then(res => res.data)
}

export {
    listarNegociosPorArticulo,
    listarNegociosPorArticuloNew,
    obtenerIdArticuloReal
}
