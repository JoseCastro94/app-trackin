import {ArticuloNegocio} from "../models/ArticuloNegocio.js";
import {GrupoArticulo} from "../models/GrupoArticulo.js";
import {GrupoArticuloMaestro} from "../models/GrupoArticuloMaestro.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {Parametro} from "../models/Parametro.js";
import {Articulo} from "../models/Articulo.js";
import Sequelize, {Op} from "sequelize";

class ArticuloNegocioRepository {
    static listarArticulos = async (IdEmpresa) => {
        return ArticuloNegocio.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('Articulo.IdArticulo')), 'id'],
                [Sequelize.col('Articulo.ItemCode'), 'codigo'],
                [Sequelize.col('Articulo.ItemName'), 'nombre'],
                [Sequelize.col('Articulo.Codebars'), 'codigo_barras'],
                [Sequelize.col('Articulo.GrupoArticulo.IdGrupoArticulo'), 'id_grupo_articulo'],
                [Sequelize.col('Articulo.GrupoArticulo.Nombre'), 'categoria'],
                [Sequelize.col('Articulo.GrupoArticulo.U_Devolucion'), 'devolucion'],
                [Sequelize.col('Articulo.GrupoArticulo.TieneSerie'), 'has_serie'],
                [Sequelize.col('Articulo.Parametro.IdParametro'), 'id_unidad_medida'],
                [Sequelize.col('Articulo.Parametro.Nombre'), 'unidad_medida'],
                [Sequelize.col('Articulo.Parametro.Descripcion'), 'descripcion_unidad_medida'],
            ],
            include: [
                {
                    model: Articulo,
                    attributes: [],
                    include: [{
                        model: GrupoArticulo,
                        attributes: [],
                        required: true
                    }, {
                        model: Parametro,
                        attributes: [],
                        required: true
                    }],
                    required: true
                },
                {
                    model: TipoNegocio,
                    attributes: [],
                    required: true,
                    where: {
                        IdEmpresa
                    }
                }
            ],
            order: [[Sequelize.col('Articulo.ItemName'), 'ASC']],
            raw: true
        })

    }
    
    static listarArticulosNew = async (IdEmpresa) => {
        const Articulos = await Articulo.findAll({
            attributes: [
                [Sequelize.col('GrupoArticulo->GrupoArticuloMaestro.IdGrupoArticuloMaestro'), 'grupo_articulo_maestro'],
                ['IdArticulo', 'id'],
                ['ItemCode', 'codigo'],
                ['ItemName', 'nombre'],
                ['Codebars', 'codigo_barras'],
                [Sequelize.col('Parametro.IdParametro'), 'id_unidad_medida'],
                [Sequelize.col('Parametro.Nombre'), 'unidad_medida'],
                [Sequelize.col('Parametro.Descripcion'), 'descripcion_unidad_medida'],
                [Sequelize.col('GrupoArticulo.Nombre'), 'categoria'],
                [Sequelize.col('GrupoArticulo.U_Devolucion'), 'devolucion'],
                [Sequelize.col('GrupoArticulo.TieneSerie'), 'has_serie']
            ],
            include: [
                {
                    model: GrupoArticulo,
                    required: true,
                    attributes: [],
                    include: [{
                            model: GrupoArticuloMaestro,
                            attributes: [],
                            required: true,
                        },
                        {
                            model: TipoNegocio,
                            attributes: [],
                            required: true,
                            where: {
                                IdEmpresa
                            }
                        }
                    ]
                }, {
                    model: Parametro,
                    attributes: [],
                    required: true
                }
                
            ],
            group: ['ItemCode','ItemName','Codebars'], 
            order: [['ItemName', 'ASC']],
            raw: true
        })

        
        // const NewArray = Articulos.map(articulo => articulo.get({ plain: true }));
        
        return Articulos

    }

    static buscarNegociosPorArticulo = async (IdArticulo, IdEmpresa) => {
        return ArticuloNegocio.findAll({
            attributes: [
                [Sequelize.col('TipoNegocio.IdNegocio'), 'id'],
                [Sequelize.col('TipoNegocio.Nombre'), 'nombre'],
            ],
            include: {
                model: TipoNegocio,
                attributes: [],
                required: true,
                where: {
                    IdEmpresa
                }
            },
            where: {
                IdArticulo
            },
            order: [[Sequelize.col('TipoNegocio.Nombre')]],
            raw: true
        })
    }

    
    static buscarNegociosPorArticuloNew = async (IdArticulo, IdEmpresa) => {
        const articulo = await Articulo.findAll({
            attributes: [
                ['IdArticulo', 'id'],
                ['ItemCode', 'codigo'],
                ['ItemName', 'nombre'],
                ['Codebars', 'codigo_barras']
            ],
            where: {
                IdArticulo
            },
            raw: true,
        })
        const NewData = [];
        const Resul = await Articulo.findAll({
            attributes: [
                [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`IdNegocio`'), 'id'],
                [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Nombre`'), 'nombre']
            ],
            include: [
                {
                    model: ArticuloNegocio,
                    required: false,
                    attributes: [
                        ['IdNegocio', 'id'],
                        [Sequelize.literal('`ArticuloNegocios->TipoNegocio`.`Nombre`'), 'nombre']
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
                ItemName: articulo[0].nombre,
                ItemCode: articulo[0].codigo,
                Codebars: articulo[0].codigo_barras
            },
            order: [[Sequelize.col('ArticuloNegocios->TipoNegocio.Nombre')]]
        })

        return Resul
    }
    
    static buscarArticuloReal = async (IdArticulo,IdNegocio, IdEmpresa) => {
        const articulo = await Articulo.findAll({
            attributes: [
                ['IdArticulo', 'id'],
                ['ItemCode', 'codigo'],
                ['ItemName', 'nombre'],
                ['Codebars', 'codigo_barras']
            ],
            where: {
                IdArticulo
            },
            raw: true,
        })
        const NewData = [];
        const Resul = await Articulo.findAll({
            attributes: [],
            include: [
                {
                    model: ArticuloNegocio,
                    required: false,
                    attributes: [
                        [Sequelize.literal('`Articulos`.`IdGrupoArticulo`'), 'idGrupoArticulo'],
                        [Sequelize.literal('`ArticuloNegocios`.`IdArticulo`'), 'idarticulo']
                    ],
                    include: {
                        model: TipoNegocio,
                        attributes: [],
                        required: true,
                        where: {
                            IdEmpresa
                        }
                    },
                    where: {
                        IdNegocio
                    }
                }
            ],
            where: {
                ItemName: articulo[0].nombre,
                ItemCode: articulo[0].codigo,
                Codebars: articulo[0].codigo_barras
            }
        })

        return Resul
    }

    static buscarPorArticuloAndNegocio = async (codigoArticuloNegocios, transaction) => {
        return ArticuloNegocio.findAll({
            attributes: [
                [Sequelize.col('Articulo.ItemCode'), 'ItemCode'],
                [Sequelize.col('Articulo.IdArticulo'), 'IdArticulo'],
                'IdNegocio',
                'Nombre',
                'Descripcion',
            ],
            include: {
                model: Articulo,
                required: true,
            },
            where: Sequelize.where(
                Sequelize.fn('CONCAT', Sequelize.col('ItemCode'), '|', Sequelize.col('IdNegocio')), {
                    [Op.in]: codigoArticuloNegocios
                }
            ),
            raw: true,
            transaction
        })
    }

    static buscarPorIdArticuloAndIdNegocio = async (IdArticuloIdNegocio, transaction) => {
        return ArticuloNegocio.findAll({
            where: Sequelize.where(
                Sequelize.fn('CONCAT', Sequelize.col('IdArticulo'), '|', Sequelize.col('IdNegocio')), {
                    [Op.in]: IdArticuloIdNegocio
                }
            ),
            raw: true,
            transaction
        })
    }

    static buscarPorCodigoArticuloAndNombreNegocio = async (ArticulosNegocios, IdEmpresa) => {
        return ArticuloNegocio.findAll({
            attributes: [
                'IdArticuloNegocio',
                'IdNegocio',
                [Sequelize.col('Articulo.IdArticulo'), 'IdArticulo'],
                [Sequelize.col('Articulo.ItemCode'), 'ItemCode'],
                [Sequelize.col('Articulo.ItemName'), 'ItemName'],
                [Sequelize.col('Articulo.Codebars'), 'Codebars'],
                [Sequelize.col('Articulo.U_BPP_TIPUNMED'), 'U_BPP_TIPUNMED'],
                [Sequelize.col('TipoNegocio.Nombre'), 'Negocio'],
            ],
            include: [
                {
                    model: Articulo,
                    attributes: [],
                    required: true,
                },
                {
                    model: TipoNegocio,
                    attributes: [],
                    where: { IdEmpresa },
                    required: true
                }
            ],
            where: Sequelize.where(
                Sequelize.fn('CONCAT', Sequelize.col('ItemCode'), '|', Sequelize.col('TipoNegocio.Nombre')), {
                    [Op.in]: ArticulosNegocios
                }
            ),
            raw: true
        })
    }

    static eliminarPorIdArticulo = (idArticulo, transaction) => {
        return ArticuloNegocio.destroy({
            where: {
                IdArticulo: idArticulo
            },
            transaction
        })
    }

    static eliminarPorIdArticulo = (idArticulo, transaction) => {
        return ArticuloNegocio.destroy({
            where: {
                IdArticulo: idArticulo
            },
            transaction
        })
    }

    static eliminarPorCodigoArticulo = (idArticulo, transaction) => {
        return ArticuloNegocio.destroy({
            where: {
                IdArticulo: idArticulo
            },
            transaction
        })
    }

    static bulkCreate = async (params, transaction) => {
        return ArticuloNegocio.bulkCreate(params, { transaction })
    }
}

export default ArticuloNegocioRepository
