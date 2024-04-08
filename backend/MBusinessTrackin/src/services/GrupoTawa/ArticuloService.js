import BaseController from "../../controllers/BaseController.js";
import EmpresaRepository from "../../repositories/EmpresaRepository.js";
import axios from "axios";

const loginUrl = 'https://intranet.grupotawa.com/WsSAP_Tawa/Prod/api/Access/AccessAuthenticacion'
const articuloUrl = 'https://intranet.grupotawa.com/WsSAP_Tawa/Prod/api/Sap/GetPurchaseItems'

class ArticuloService extends BaseController {
    static buscarPorCodigo = async (req, res) => {
        try {
            const { codigo } = req.body
            const { company } = req.headers
            const empresa = await EmpresaRepository.findById(company.id)
            const token = await axios.post(loginUrl, {
                Usuario: empresa.UsuarioApiSap,
                Clave: empresa.ContrasenaApiSap,
                CodEmp: empresa.CodigoApiSap
            }).then(response => response.data)

            const config = {
                method: 'POST',
                url: articuloUrl,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data : {
                    db: empresa.BaseSAP,
                    filter: {
                        itemCode: `=${codigo}`
                    },
                }
            };

            const articulo = await axios(config).then(response => response.data)

            if (articulo)
                return this.successResponse(res, {
                    success: true,
                    data: articulo.rows[0],
                })
            return this.infoResponse(res, {
                success: false,
                message: `No existe el código de producto ${codigo} en SAP`,
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static listar = async (req, res) => {
        try {
            const { company } = req.headers
            let { page, limit, filter } = req.query
            const filters = filter.split('|')
            const empresa = await EmpresaRepository.findById(company.id)
            const token = await axios.post(loginUrl, {
                Usuario: empresa.UsuarioApiSap,
                Clave: empresa.ContrasenaApiSap,
                CodEmp: empresa.CodigoApiSap
            }).then(response => response.data)

            const config = {
                method: 'POST',
                url: articuloUrl,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data : {
                    db: empresa.BaseSAP,
                    filter: {
                        itemCode: filters[0],
                        itemName: filters[1]
                    },
                    rowsPerPage: limit,
                    pageNumber: page
                }
            };

            const response = await axios(config).then(response => response.data)
            return this.successResponse(res, {
                rows: response.rows,
                count: response.countRows
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
}

export default ArticuloService
