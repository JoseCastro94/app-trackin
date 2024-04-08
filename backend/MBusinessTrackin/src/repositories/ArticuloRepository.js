import {ArticuloNegocio} from "../models/ArticuloNegocio.js";
import {GrupoArticulo} from "../models/GrupoArticulo.js";
import {GrupoArticuloMaestro} from "../models/GrupoArticuloMaestro.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {Parametro} from "../models/Parametro.js";
import {Articulo} from "../models/Articulo.js";
import Sequelize, {Op} from "sequelize";
import Util from "../utils/Util.js";

class ArticuloRepository {
    static findById = (id) => {
        return Articulo.findByPk(id)
    }

    static listar = async ({offset, limit, filter}, IdEmpresa) => {
        const where = Util.generateWhere(filter)
        const Articulos = await Articulo.findAll({
            attributes: [
                [Sequelize.col('GrupoArticulo->GrupoArticuloMaestro.IdGrupoArticuloMaestro'), 'id_grupo'],
                ['ItemCode', 'codigo'],
                ['ItemName', 'name'],
                ['Codebars', 'code_bar'],
                [Sequelize.col('Parametro.IdParametro'), 'unidad_medida'],
                [Sequelize.col('Parametro.Nombre'), 'unidad_medida_nombre'],
                ['FotoAttach', 'foto'],
                ['FichaTecnicaAttach', 'file'],
                ['Procedencia', 'procedencia'],
                [Sequelize.col('GrupoArticulo.Nombre'), 'grupo'],
                [Sequelize.col('GrupoArticulo.Descripcion'), 'description'],
                [Sequelize.col('GrupoArticulo.U_Devolucion'), 'devolucion'],
                [Sequelize.col('GrupoArticulo.U_DiasEntrega'), 'dias_entrega'],
                [Sequelize.col('GrupoArticulo.U_Evaluacion'), 'evaluacion'],
                [Sequelize.col('GrupoArticulo.TieneSerie'), 'tiene_serie'],
                [Sequelize.fn('IF', Sequelize.col('Articulos.Activo'), ['Activo', 'Inactivo']), 'Activo']
            ],
            include: [
                {
                    model: GrupoArticulo,
                    required: true,
                    attributes: [],
                    include: {
                        model: GrupoArticuloMaestro,
                        attributes: [],
                        required: true,
                    }
                }, {
                    model: Parametro,
                    required: true
                },
            ],
            where,
            group: ['GrupoArticulo->GrupoArticuloMaestro.IdGrupoArticuloMaestro','Parametro.IdParametro','Parametro.Nombre','FotoAttach','FichaTecnicaAttach','Procedencia','ItemCode','ItemName','Codebars'], 
            order: [['ItemName', 'ASC']],
            limit,
            offset,
        })
        const NewArray = Articulos.map(articulo => articulo.get({ plain: true }));
        const NewData = [];

        for await (const dat of NewArray) {
            const Resul = await Articulo.findAll({
                attributes: [
                    ['IdArticulo', 'id'],
                    ['IdGrupoArticulo', 'idGrupoArticulo'],
                ],
                include: [
                    {
                        model: ArticuloNegocio,
                        required: false,
                        attributes: [
                            ['IdNegocio', 'id'],
                            [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Nombre`'), 'nombre'],
                            [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Dim3`'), 'dim_3'],
                            [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Dim4`'), 'dim_4'],
                            [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Dim5`'), 'dim_5'],
                            [Sequelize.literal('false'), 'checked'],
                        ],
                        include: {
                            model: TipoNegocio,
                            attributes: [],
                            required: true,
                            where: {
                                IdEmpresa
                            }
                        }
                    }
                ],
                where: {
                    ItemName: dat.name,
                    ItemCode: dat.codigo,
                    Codebars: dat.code_bar,
                    IdUnidadMedida: dat.unidad_medida,
                }
            })
            
            const resultado = Resul.map(res => res.get({ plain: true }));
            const arrayArticuloNegocio = []
            resultado.map( r => {
                arrayArticuloNegocio.push({...r.ArticuloNegocios[0],idGrupoArticulo:r.idGrupoArticulo,idArticulo:r.id})
            })
            

            const toSave = { ArticuloNegocios:arrayArticuloNegocio, ...dat };
            NewData.push(toSave)
        }

        return NewData
        
        /* return Articulo.findAndCountAll({
            distinct: 'IdArticulo',
            attributes: [
                ['IdArticulo', 'id'],
                [Sequelize.col('GrupoArticulo->GrupoArticuloMaestro.IdGrupoArticuloMaestro'), 'id_grupo'],
                ['ItemCode', 'codigo'],
                ['ItemName', 'name'],
                ['Codebars', 'code_bar'],
                [Sequelize.col('Parametro.IdParametro'), 'unidad_medida'],
                [Sequelize.col('Parametro.Nombre'), 'unidad_medida_nombre'],
                ['FotoAttach', 'foto'],
                ['FichaTecnicaAttach', 'file'],
                ['Procedencia', 'procedencia'],
                [Sequelize.col('GrupoArticulo.Nombre'), 'grupo'],
                [Sequelize.col('GrupoArticulo.Descripcion'), 'description'],
                [Sequelize.col('GrupoArticulo.U_Devolucion'), 'devolucion'],
                [Sequelize.col('GrupoArticulo.U_DiasEntrega'), 'dias_entrega'],
                [Sequelize.col('GrupoArticulo.U_Evaluacion'), 'evaluacion'],
                [Sequelize.col('GrupoArticulo.TieneSerie'), 'tiene_serie'],
                [Sequelize.fn('IF', Sequelize.col('Articulos.Activo'), ['Activo', 'Inactivo']), 'Activo']
            ],
            include: [
                {
                    model: GrupoArticulo,
                    required: true,
                    attributes: [],
                    include: {
                        model: GrupoArticuloMaestro,
                        attributes: [],
                        required: true,
                    }
                }, {
                    model: Parametro,
                    required: true
                },
                {
                    model: ArticuloNegocio,
                    required: false,
                    attributes: [
                        ['IdNegocio', 'id'],
                        [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Nombre`'), 'nombre'],
                        [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Dim3`'), 'dim_3'],
                        [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Dim4`'), 'dim_4'],
                        [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Dim5`'), 'dim_5'],
                        [Sequelize.literal('false'), 'checked'],
                    ],
                    include: {
                        model: TipoNegocio,
                        attributes: [],
                        required: true,
                        where: {
                            IdEmpresa
                        }
                    }
                }
            ],
            where,
            order: [['ItemName', 'ASC']],
            offset,
            limit
        }) */
    }

    static buscarPorIdGrupoArticulo = async (IdGrupoArticulo) => {
        return Articulo.findAll({
            where: {
                Activo: true,
                IdGrupoArticulo
            },
            raw: true
        })
    }

    static buscarPorCodigos = async (codigos, transaction) => {
        return Articulo.findAll({
            where: {
                Activo: true,
                ItemCode: { [Op.in]: codigos }
            },
            raw: true,
            transaction
        })
    }

    static buscarPorCodigo = async (codigo) => {
        return Articulo.findOne({
            where: {
                ItemCode: codigo,
                Activo: true
            },
            raw: true
        })
    }

    static create = async (data, transaction) => {
        return Articulo.create(data,{
            include: [ArticuloNegocio],
            transaction
        }).then(data => data.toJSON())
    }

    static bulkCreate = async (params, transaction) => {
        return Articulo.bulkCreate(params, {
            include: [ArticuloNegocio],
            transaction
        })
    }

    static update = async (params = {}, where = {}, transaction) => {
        
        return Articulo.update(params, {
            where,
            transaction
        })
    }

    static eliminarPorId = (idArticulo, transaction) => {
        return Articulo.destroy({
            where: {
                IdArticulo: idArticulo
            },
            transaction
        })
    }
}

export default ArticuloRepository
