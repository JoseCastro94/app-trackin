import {GrupoParametro} from "../models/GrupoParametro.js";
import {Parametro} from "../models/Parametro.js";
import Sequelize, {Op} from "sequelize";
import Util from "../utils/Util.js";

class GrupoParametroRepository {
    static buscarPorId = (id) => {
        return GrupoParametro.findByPk(id)
    }

    static getParametros = async (IdGrupo) => {
        return GrupoParametro.findOne({
            where: {
                IdGrupo,
                Activo: 1
            },
            include: [{
                model: Parametro,
                required: true,
                attributes: [
                    ['IdParametro', 'id'],
                    ['Nombre', 'nombre'],
                    ['Valor1', 'valor_1']
                ],
                where: {
                    Activo: 1,
                    IdParametro: {[Op.notIn]: [
                        '217aeef5-2957-4a87-bfa8-8a6e65ed0737'
                    ]}
                },
            }],
        }).then(data => data.toJSON())
            .then(data => data.Parametros)
            .catch(error => {
                console.log(error)
                return []
            })
    }

    static buscarPorNombre = async (Nombre) => {
        return GrupoParametro.findOne({
            where: {
                Nombre
            },
            raw: true
        })
    }

    static buscarPorNombres = async (Nombres) => {
        return GrupoParametro.findAll({
            where: {
                Nombre: {[Op.in]: Nombres}
            },
            raw: true
        })
    }

    static listar = ({offset, limit, filter}) => {
        const where = Util.generateWhere(filter)
        return GrupoParametro.findAndCountAll({
            attributes: [
                ['IdGrupo', 'id'],
                'Nombre',
                'Descripcion',
                [Sequelize.fn('IF', Sequelize.col('Activo'), ['Activo', 'Inactivo']), 'Activo']
            ],
            where,
            order: [['Nombre', 'ASC']],
            offset,
            limit
        })
    }

    static create = async (data, transaction) => {
        return GrupoParametro.create(data,{
            transaction
        }).then(data => data.toJSON())
    }

    static update = async (params = {}, where = {}, transaction) => {
        return GrupoParametro.update(params, {
            where,
            transaction
        })
    }

    static bulkCreate = async (params, transaction) => {
        return GrupoParametro.bulkCreate(params, {
            transaction
        })
    }
}

export default GrupoParametroRepository
