import {EmpresaParametro} from "../models/EmpresaParametro.js";
import {Almacen} from "../models/Almacen.js";
import {Ubigeo} from "../models/Ubigeo.js";
import Sequelize, {Op} from "sequelize";
import Util from "../utils/Util.js";

class AlmacenRepository {
    static buscarPorId = (id) => {
        return Almacen.findByPk(id)
    }

    static listar = (IdEmpresa) => {
        return Almacen.findAll({
            attributes: [
                ['IdAlmacen', 'id'],
                [Sequelize.fn('CONCAT', Sequelize.col('Nombre'), ' - ', Sequelize.col('Tipo')), 'nombre'],
                ['Descripcion', 'descripcion']
            ],
            where: {
                IdEmpresa,
                Activo: true
            },
            order: [['Nombre', 'ASC']]
        })
    }

    static listarConPaginacion = ({offset, limit, filter}) => {
        const where = Util.generateWhere(filter)
        return Almacen.findAndCountAll({
            distinct: 'IdAlmacen',
            attributes: [
                ['IdAlmacen', 'id'],
                ['Nombre', 'nombre'],
                ['Descripcion', 'descripcion'],
                ['Tipo', 'tipo'],
                ['Direccion', 'direccion'],
                [Sequelize.col('EmpresaParametro.RazonSocial'), 'empresa'],
                [Sequelize.col('Ubigeo.departamento'), 'departamento'],
                [Sequelize.col('Ubigeo.departamento_inei'), 'departamento_inei'],
                [Sequelize.col('Ubigeo.provincia'), 'provincia'],
                [Sequelize.col('Ubigeo.provincia_inei'), 'provincia_inei'],
                [Sequelize.col('Ubigeo.distrito'), 'distrito'],
                [Sequelize.col('Ubigeo.ubigeo_inei'), 'ubigeo_inei'],
                [Sequelize.fn('IF', Sequelize.col('Almacenes.Activo'), ['Activo', 'Inactivo']), 'Activo']
            ],
            include: [
                {
                    model: EmpresaParametro,
                    attributes: [],
                    required: true
                },
                {
                    model: Ubigeo,
                    attributes: [],
                    required: true
                }
            ],
            where,
            order: [['Nombre', 'ASC']],
            offset,
            limit
        })
    }

    static almacenesExistentes = async (search, IdEmpresa, transaction) => {
        return Almacen.findAll({
            where: {
                IdEmpresa,
                $and: Sequelize.where(
                    Sequelize.fn('CONCAT', Sequelize.col('Nombre'), '|', Sequelize.col('Tipo')), {
                        [Op.in]: search
                    }
                )
            },
            transaction,
            raw: true
        })
    }

    static existe = async (search, IdEmpresa, transaction) => {
        return Almacen.findOne({
            where: {
                IdEmpresa,
                $and: Sequelize.where(
                    Sequelize.fn('CONCAT', Sequelize.col('Nombre'), '|', Sequelize.col('Tipo')), {
                        [Op.eq]: search
                    }
                )
            },
            transaction
        })
    }

    static existeForUpdate = async (search, IdEmpresa, IdAlmacen, transaction) => {
        return Almacen.findOne({
            where: {
                IdEmpresa,
                $and: Sequelize.where(
                    Sequelize.fn('CONCAT', Sequelize.col('Nombre'), '|', Sequelize.col('Tipo')), {
                        [Op.eq]: search
                    }
                ),
                IdAlmacen: {[Op.ne]: IdAlmacen}
            },
            transaction
        })
    }

    static buscarPorEmpresa = async (IdEmpresa, transaction) => {
        return Almacen.findAll({
            where: {
                IdEmpresa
            },
            raw: true,
            transaction,
        })
    }

    static create = async (data, transaction) => {
        return Almacen.create(data,{
            transaction
        }).then(data => data.toJSON())
    }

    static bulkCreate = async (params, transaction) => {
        return Almacen.bulkCreate(params, {
            transaction
        })
    }

    static update = async (params = {}, where = {}, transaction) => {
        return Almacen.update(params, {
            where,
            transaction
        })
    }
}

export default AlmacenRepository
