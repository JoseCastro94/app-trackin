import {EmpresaParametro} from "../models/EmpresaParametro.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {GrupoArticulo} from "../models/GrupoArticulo.js";
import {GrupoArticuloMaestro} from "../models/GrupoArticuloMaestro.js";
import Sequelize, {Op} from "sequelize";
import Util from "../utils/Util.js";

class GrupoArticuloRepository {
    static buscarPorId = (id) => {
        return GrupoArticulo.findByPk(id)
    }

    static listar = (IdEmpresa) => {

        return GrupoArticuloMaestro.findAll({
            attributes: [
                ['IdGrupoArticuloMaestro', 'id'],
                ['Nombre', 'nombre']
            ],            
            where: {
                IdEmpresa
            },
            order: ['Nombre'],
            raw: true
        })
    }

    static listWithPagination = ({offset, limit, filter}) => {
        const where = Util.generateWhere(filter)
 
        return GrupoArticulo.findAndCountAll({
            distinct: 'IdGrupoArticulo',
            attributes: [
                ['IdGrupoArticulo', 'id'],
                'Nombre',
                'Descripcion',
                'U_Evaluacion',
                'U_DiasEntrega',
                'U_Devolucion',
                'TieneSerie',
                'IdEmpresa',
                'Activo',
                'IdGrupoArticuloMaestro',
                [Sequelize.col('EmpresaParametro.RazonSocial'), 'empresa'],
                [Sequelize.col('TipoNegocio.Nombre'), 'negocio'],
            ],
            include:[{
                    model: EmpresaParametro,
                    attributes: [],
                    required: true
                },
                {
                    model: TipoNegocio,
                    attributes: [],
                    required: true
                }
            ] ,
            where,
            order: [['Nombre', 'ASC']],
            offset,
            limit
        })
    }

    static buscarPorCodigos = async (codigos) => {
        return GrupoArticulo.findAll({
            where: {
                IdGrupoArticulo: { [Op.in]: codigos }
            },
            raw: true
        }).then(grupos => grupos.map(grupo => grupo.IdGrupoArticulo))
    }

    static buscarPorNombre = async (Nombre, IdGrupoArticulo = null) => {
        const where = {
            Nombre
        }

        if (IdGrupoArticulo) {
            where.IdGrupoArticulo = {[Op.ne]: IdGrupoArticulo}
        }

        return GrupoArticulo.findOne({
            where,
            raw: true
        })
    }

    static buscarPorNombres = async (nombres, IdEmpresa, transaction) => {
        return GrupoArticulo.findAll({
            where: {
                Nombre: { [Op.in]: nombres },
                IdEmpresa
            },
            raw: true,
            transaction
        })
    }

    static create = async (data, transaction) => {
        return GrupoArticulo.create(data,{
            transaction
        }).then(data => data.toJSON())
    }

    static update = async (params = {}, where = {}, transaction) => {
        return GrupoArticulo.update(params, {
            where,
            transaction
        })
    }

    static destroy = async (IdNegocio,IdGrupoArticuloMaestro) => {
        return GrupoArticulo.destroy({
            where: {
                IdNegocio : IdNegocio,
                IdGrupoArticuloMaestro: IdGrupoArticuloMaestro
            },
        })
    }

    static bulkCreate = async (params, transaction) => {
        return GrupoArticulo.bulkCreate(params, {
            transaction
        })
    }
}

export default GrupoArticuloRepository
