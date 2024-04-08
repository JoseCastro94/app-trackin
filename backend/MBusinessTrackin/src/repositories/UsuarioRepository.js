import {Usuario} from "../models/Usuario.js";
import {UsuarioEmpresa} from "../models/UsuarioEmpresa.js";
import {EmpresaParametro} from "../models/EmpresaParametro.js";
import Sequelize from "sequelize";

class UsuarioRepository {
    static findByPk = async (id) => {
        return Usuario.findByPk(id)
    }

    static listarResponsables = async () => {
        return Usuario.findAll({
            attributes: [
                ['IdUsuario', 'id'],
                ['ApellidoPaterno', 'ape_materno'],
                ['ApellidoMaterno', 'ape_paterno'],
                ['Nombres', 'nombres'],
                ['Correo', 'correo'],
                ['TipoDocumento', 'tipo_doc'],
                ['NroDocumento', 'num_doc']
            ],
            where: {
                EsResponsable: true,
                Activo: true
            }
        })
    }

    static listarEmpresas = async (IdUsuario) => {
        return UsuarioEmpresa.findAll({
            attributes: [
                [Sequelize.col('EmpresaParametro.RazonSocial'), 'razon_social'],
                [Sequelize.col('EmpresaParametro.Ruc'), 'ruc'],
                [Sequelize.col('EmpresaParametro.NombreComercial'), 'nombre_comercial'],
            ],
            include: [{
                model: EmpresaParametro,
                attributes: [],
                required: true
            }],
            where: {
                IdUsuario
            }
        })
    }

    static listarCorreos = async (IdEmpresa) => {
        return UsuarioEmpresa.findAll({
            attributes: [
                [Sequelize.col('Usuario.Correo'), 'Correo']
            ],
            include: [{
                model: Usuario,
                attributes: [],
                required: true
            }],
            where: {
                IdEmpresa
            },
            group: Sequelize.col('Usuario.Correo'),
            order: [[Sequelize.col('Usuario.Correo'), 'ASC']]
        })
    }
}

export default UsuarioRepository
