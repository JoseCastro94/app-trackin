import {EmpresaParametro} from "../models/EmpresaParametro.js";
import {Ubigeo} from "../models/Ubigeo.js";
import {Sequelize, Op} from "sequelize";
import Util from "../utils/Util.js";

class EmpresaRepository {
    static findById = async (id) => {
        return EmpresaParametro.findByPk(id)
    }

    static findByRuc = async (ruc, IdEmpresa = null) => {
        const where = {
            Ruc: ruc
        }

        if (IdEmpresa) {
            where.IdEmpresa = {[Op.ne]: IdEmpresa}
        }

        return EmpresaParametro.findOne({
            attributes: [
                [Sequelize.col('IdEmpresa'), 'id'],
                [Sequelize.col('RazonSocial'), 'razon_social'],
                [Sequelize.col('Ruc'), 'ruc'],
            ],
            where,
            raw: true
        })
    }

    static findByRazonSocial = async (razonSocial, IdEmpresa = null) => {
        const where = {
            RazonSocial: razonSocial
        }

        if (IdEmpresa) {
            where.IdEmpresa = {[Op.ne]: IdEmpresa}
        }

        return EmpresaParametro.findOne({
            attributes: [
                [Sequelize.col('IdEmpresa'), 'id'],
                [Sequelize.col('RazonSocial'), 'razon_social'],
                [Sequelize.col('Ruc'), 'ruc'],
            ],
            where,
            raw: true
        })
    }

    static buscarPorRucs = async (rucs) => {
        return EmpresaParametro.findAll({
            where: {
                Ruc: {[Op.in]: rucs}
            },
            raw: true
        })
    }

    static buscarPorNombres = async (nombreEmpresas) => {
        return EmpresaParametro.findAll({
            where: {
                RazonSocial: {[Op.in]: nombreEmpresas}
            },
            raw: true
        })
    }

    static listar = ({offset, limit, filter}) => {

        const where = Util.generateWhere(filter)
        return EmpresaParametro.findAndCountAll({
            distinct: 'IdEmpresa',
            attributes: [
                [Sequelize.col('IdEmpresa'), 'id'],
                [Sequelize.col('RazonSocial'), 'razonSocial'],
                [Sequelize.col('Ruc'), 'ruc'],
                [Sequelize.col('NombreComercial'), 'nombreComercial'],
                [Sequelize.col('Direccion'), 'direccion'],
                [Sequelize.col('Ubigeo.departamento'), 'departamento'],
                [Sequelize.col('Ubigeo.departamento_inei'), 'departamento_inei'],
                [Sequelize.col('Ubigeo.provincia'), 'provincia'],
                [Sequelize.col('Ubigeo.provincia_inei'), 'provincia_inei'],
                [Sequelize.col('Ubigeo.distrito'), 'distrito'],
                [Sequelize.col('Ubigeo.ubigeo_inei'), 'ubigeo_inei'],
                [Sequelize.fn('IF', Sequelize.col('Activo'), ['Activo', 'Inactivo']), 'Activo']
            ],
            include: {
                model: Ubigeo,
                attributes: [],
                required: true
            },
            where,
            order: [['RazonSocial', 'ASC']],
            offset,
            limit
        })
    }

    static create = async (data, transaction) => {
        return EmpresaParametro.create(data,{
            transaction
        }).then(data => data.toJSON())
    }

    static update = async (params = {}, where = {}, transaction) => {
        return EmpresaParametro.update(params, {
            where,
            transaction
        })
    }

    static bulkCreate = async (params, transaction) => {
        return EmpresaParametro.bulkCreate(params, {
            transaction
        })
    }
}

export default EmpresaRepository
