import axios from "./axios";

  const obtenerAlmacenes = async ({ page, limit, filters = '' } = {},  token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token;
      axios.defaults.headers.common['empresa'] = tokenCompany;
      axios.defaults.headers.common['cache'] = 'no-cache';
      axios.defaults.headers.common['pragma'] = 'no-cache';
      axios.defaults.headers.common['cache-control'] = 'no-cache';
      if (!page || !limit){

        return axios.get(`${process.env.REACT_APP_API}business/api/almacen/getAlmacenEmpresa`).then(res => res.data)
      }
      return axios.get(`${process.env.REACT_APP_API}business/api/almacen/getAlmacenEmpresa?page=${page}&limit=${limit}&filter=${filters}`).then(res => res.data)
      

  }
  
  const listarUsuarios = async (token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/usuario`).then(res => res.data)
}

const listarAlmacenes = async (token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/usuario/almacenes`).then(res => res.data)
}

const listarEmpresas = () => {
    return fetch(`${process.env.REACT_APP_API}business/api/usuario/empresas`, {
        method: 'GET'
    }).then(res => res.json())
}



const listarCorreos = (token, tokenCompany) => {
    axios.defaults.headers.common['token'] = token
    axios.defaults.headers.common['empresa'] = tokenCompany
    axios.defaults.headers.common['cache'] = 'no-cache'
    axios.defaults.headers.common['pragma'] = 'no-cache'
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    return axios.get(`${process.env.REACT_APP_API}business/api/usuario/correos`).then(res => res.data)
}

export {
    listarUsuarios,
    listarAlmacenes,
    listarEmpresas,
    listarCorreos,
    obtenerAlmacenes
}
