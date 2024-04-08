import {EmpresaParametro} from "../models/EmpresaParametro.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {GrupoArticulo} from "../models/GrupoArticulo.js";
import Sequelize, {Op} from "sequelize";
import Util from "../utils/Util.js";

class TipoNegocioRepository {
    static buscarPorId = async (id) => {
        return TipoNegocio.findByPk(id)
    }

    static listar = async (IdEmpresa) => {
        return TipoNegocio.findAll({
            attributes: [
                ['IdNegocio', 'id'],
                ['Nombre', 'nombre'],
                ['Dim3', 'dim_3'],
                ['Dim4', 'dim_4'],
                ['Dim5', 'dim_5']
                
            ],
            where: {
                IdEmpresa
            },
            order: [['Nombre']],
            raw: true
        })
    }
    
    static listarArticulos = async (IdEmpresa) => {
        return TipoNegocio.findAll({
            attributes: [
                ['IdNegocio', 'id'],
                ['Nombre', 'nombre'],
                ['Dim3', 'dim_3'],
                ['Dim4', 'dim_4'],
                ['Dim5', 'dim_5'],
            ],
            include: [
                {
                    model: GrupoArticulo,
                    attributes: [],
                    required: true
                }
            ],
            where: {
                IdEmpresa
            },
            order: [['Nombre']],
            raw: true
        })
    }

    static listarConPaginacion = async ({offset, limit, filter}) => {
        const where = Util.generateWhere(filter)
        where.push(Sequelize.where(
            Sequelize.col('Activo'), true
        ))

        return TipoNegocio.findAndCountAll({
            attributes: [
                ['IdNegocio', 'id'],
                ['Nombre', 'nombre'],
                ['Dim3', 'dim_3'],
                ['Dim4', 'dim_4'],
                ['Dim5', 'dim_5'],
                [Sequelize.literal('false'), 'checked'],
            ],
            where,
            order: [['Nombre']],
            raw: true,
            offset,
            limit
        })
    }
    
    static listarArticuloConPaginacion = async ({offset, limit, filter}) => {

        const where = Util.generateWhere(filter)
        where.push(Sequelize.where(
            Sequelize.col('`TipoNegocio`.`Activo`'), true
        ))


        const resultados = await GrupoArticulo.findAndCountAll({
            distinct: 'IdGrupoArticulo',
            attributes: [
                ['IdGrupoArticulo', 'idGrupoArticulo'],
                ['Nombre', 'NombreArticulo'],
                [Sequelize.col('TipoNegocio.IdNegocio'), 'id'],
                [Sequelize.col('TipoNegocio.Nombre'), 'nombre'],
                [Sequelize.col('TipoNegocio.Dim3'), 'dim_3'],
                [Sequelize.col('TipoNegocio.Dim4'), 'dim_4'],
                [Sequelize.col('TipoNegocio.Dim5'), 'dim_5'],
                [Sequelize.literal('false'), 'checked']
            ],
            include:[
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

        return resultados

    }

    static listarNegociosConEmpresa = async ({offset, limit, filter}) => {
        const where = Util.generateWhere(filter)
        return TipoNegocio.findAndCountAll({
            distinct: 'IdNegocio',
            attributes: [
                ['IdNegocio', 'id'],
                'Nombre',
                'Dim1',
                'Dim2',
                'Dim3',
                'Dim4',
                'Dim5',
                'CodigoUnidad',
                'IdEmpresa',
                [Sequelize.fn('IF', Sequelize.col('TipoNegocio.Activo'), ['Activo', 'Inactivo']), 'Activo'],
                [Sequelize.col('EmpresaParametro.RazonSocial'), 'empresa'],
            ],
            include: {
                model: EmpresaParametro,
                attributes: [],
                required: true
            },
            where,
            order: [['Nombre']],
            raw: true,
            offset,
            limit
        })
    }

    static buscarPorCodigos = async (codigos) => {
        return TipoNegocio.findAll({
            where: {
                IdNegocio: { [Op.in]: codigos }
            },
            raw: true
        }).then(negocios => negocios.map(negocio => negocio.IdNegocio))
    }

    static buscarPorNombres = async (negocios, IdEmpresa, transaction) => {
        return TipoNegocio.findAll({
            where: {
                Nombre: { [Op.in]: negocios },
                IdEmpresa,
                Activo: true
            },
            raw: true,
            transaction
        })
    }

    static buscarPorNombresAndEmpresa = async (nombreAndEmpresa, transaction) => {
        return TipoNegocio.findAll({
            include: {
                model: EmpresaParametro,
                attributes: [],
                required: true
            },
            where: {
                $and: Sequelize.where(
                    Sequelize.fn('CONCAT', Sequelize.col('Nombre'), '|', Sequelize.col('EmpresaParametro.RazonSocial')), {
                        [Op.in]: nombreAndEmpresa
                    }
                )
            },
            raw: true,
            transaction
        })
    }

    static buscarPorEmpresa = async (IdEmpresa) => {
        return TipoNegocio.findAll({
            where: {
                IdEmpresa
            },
            raw: true
        })
    }

    static create = async (data, transaction) => {
        return TipoNegocio.create(data,{
            transaction
        }).then(data => data.toJSON())
    }

    static bulkCreate = async (params, transaction) => {
        return TipoNegocio.bulkCreate(params, {
            transaction
        })
    }

    static update = async (params = {}, where = {}, transaction) => {
        return TipoNegocio.update(params, {
            where,
            transaction
        })
    }
}

export default TipoNegocioRepository
