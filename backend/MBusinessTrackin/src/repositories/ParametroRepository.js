import {GrupoParametro} from "../models/GrupoParametro.js";
import {Parametro} from "../models/Parametro.js";
import Sequelize, {Op} from "sequelize";
import Util from "../utils/Util.js";

class ParametroRepositry {
    static buscarPorId = async (id) => {
        return Parametro.findByPk(id)
    }

    static buscarPorIdGrupo = async (id_grupo) => {
        return Parametro.findAll({
            attributes: [['IdParametro', 'id'], ['Nombre', 'estado']],
            where: {
                IdGrupo: id_grupo,
                Activo: 1
            }
        })
    }

    static buscarPorCodigos = async (codigos) => {
        return Parametro.findAll({
            where: {
                IdParametro: { [Op.in]: codigos }
            },
            raw: true
        }).then(parametros => parametros.map(parametro => parametro.IdParametro))
    }

    static buscarPorNombres = async (nombres, IdGrupo, transaction) => {
        const where = {
            Nombre: { [Op.in]: nombres },
            Activo: true
        }

        if (IdGrupo) {
            where.IdGrupo = IdGrupo
        }

        return Parametro.findAll({
            where,
            raw: true,
            transaction
        })
    }

    static existe = async (Nombre, IdGrupo) => {
        return Parametro.findOne({
            where: {
                Nombre,
                IdGrupo,
            },
            raw: true
        })
    }

    static listar = ({offset, limit, filter}) => {
        const where = Util.generateWhere(filter)
        return Parametro.findAndCountAll({
            distinct: 'IdParametro',
            attributes: [
                ['IdParametro', 'id'],
                'Nombre',
                'Descripcion',
                [Sequelize.col('GrupoParametro.IdGrupo'), 'IdGrupo'],
                [Sequelize.col('GrupoParametro.Nombre'), 'Grupo'],
                [Sequelize.fn('IF', Sequelize.col('Parametros.Activo'), ['Activo', 'Inactivo']), 'Activo']
            ],
            include: {
                model: GrupoParametro,
                attributes: [],
                required: true
            },
            where,
            order: [[Sequelize.col('GrupoParametro.Nombre'), 'ASC'], [Sequelize.col('Parametros.Nombre'), 'ASC']],
            offset,
            limit
        })
    }

    static create = async (data, transaction) => {
        return Parametro.create(data,{
            transaction
        }).then(data => data.toJSON())
    }

    static update = async (params = {}, where = {}, transaction) => {
        return Parametro.update(params, {
            where,
            transaction
        })
    }

    static bulkCreate = async (params, transaction) => {
        return Parametro.bulkCreate(params, {
            transaction
        })
    }
}

export default ParametroRepositry
