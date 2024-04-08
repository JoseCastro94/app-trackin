import { EmpresaParametro } from "../models/EmpresaParametro.js";
import { GrupoArticuloMaestro } from "../models/GrupoArticuloMaestro.js";
import { GrupoArticulo } from "../models/GrupoArticulo.js";
import { Stock } from "../models/Stock.js";
import { TipoNegocio } from "../models/TipoNegocio.js";
import { Almacen } from "../models/Almacen.js";
import Sequelize, { Op } from "sequelize";
import Util from "../utils/Util.js";
import { Articulo } from "../models/Articulo.js";
import { UsuarioAlmacen } from "../models/UsuarioAlmacen.js";
import { Usuario } from "../models/Usuario.js";

class GrupoArticuloMaestroRepository {
  static buscarPorId = (id) => {
    return GrupoArticuloMaestro.findByPk(id);
  };

  static listar = (IdUsuario, IdEmpresa) => {
        return GrupoArticuloMaestro.findAll({
      attributes: [
        ["IdGrupoArticuloMaestro","id"],
        ["Nombre", "nombre"]
      ],
      include: [
        {
          model: GrupoArticulo,
          required: true,
          attributes: [
          ],
          include: {
            model: Articulo,
            required: true,
            attributes: [],
            include: [
              {
                model: Stock,
                required: true,
                attributes: [],
                include: [
                  {
                    model: Almacen,
                    required: true,
                    attributes: [],
                    include: [
                      {
                        model: EmpresaParametro,
                        required: true,
                        attributes: [],
                        where: {
                          IdEmpresa: IdEmpresa,
                        }
                      },
                      {
                        model: UsuarioAlmacen,
                        required: true,
                        attributes: [],
                        include: [
                          {
                            model: Usuario,
                            attributes: [],
                            where: {
                              IdUsuario: IdUsuario,
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    model: TipoNegocio,
                    required: true,
                    attributes: [],
                  },
                ],
              },
            ],
          },
           group: ['IdGrupoArticulo', 'Nombre']
        },
      ],
    })
  };

  static listWithPagination = ({ offset, limit, filter }) => {
    const where = Util.generateWhere(filter);
    /*
        where.push(Sequelize.where(
            Sequelize.col('GrupoArticuloMaestros.Activo'), true
        ))
        */
    return GrupoArticuloMaestro.findAndCountAll({
      distinct: "IdGrupoArticuloMaestro",
      attributes: [
        ["IdGrupoArticuloMaestro", "id"],
        "Nombre",
        "Descripcion",
        "U_Evaluacion",
        "U_DiasEntrega",
        "U_Devolucion",
        "TieneSerie",
        "IdEmpresa",
        "Activo",
        [Sequelize.col("EmpresaParametro.RazonSocial"), "empresa"],
      ],
      include: [
        {
          model: EmpresaParametro,
          attributes: [],
          required: true,
        },
        {
          model: GrupoArticulo,
          attributes: [
            ["IdGrupoArticulo", "IdGrupoArticulo"],
            ["IdNegocio", "id"],
            [
              Sequelize.literal("`GrupoArticulos->TipoNegocio`.`Nombre`"),
              "nombre",
            ],
            [
              Sequelize.literal("`GrupoArticulos->TipoNegocio`.`Dim3`"),
              "dim_3",
            ],
            [
              Sequelize.literal("`GrupoArticulos->TipoNegocio`.`Dim4`"),
              "dim_4",
            ],
            [
              Sequelize.literal("`GrupoArticulos->TipoNegocio`.`Dim5`"),
              "dim_5",
            ],
            [Sequelize.literal("false"), "checked"],
          ],
          include: {
            model: TipoNegocio,
            attributes: [],
            required: true,
          },
        },
      ],
      where,
      order: [["Nombre", "ASC"]],
      offset,
      limit,
    });
  };

  static buscarPorCodigos = async (codigos) => {
    return GrupoArticuloMaestro.findAll({
      where: {
        IdGrupoArticuloMaestro: { [Op.in]: codigos },
      },
      raw: true,
    }).then((grupos) => grupos.map((grupo) => grupo.IdGrupoArticuloMaestro));
  };

  static buscarPorNombre = async (Nombre, IdGrupoArticuloMaestro = null) => {
    const where = {
      Nombre,
    };

    if (IdGrupoArticuloMaestro) {
      where.IdGrupoArticuloMaestro = { [Op.ne]: IdGrupoArticuloMaestro };
    }

    return GrupoArticuloMaestro.findOne({
      where,
      raw: true,
    });
  };

  static buscarExistenciaNegocio = async (
    IdNegocio,
    IdGrupoArticuloMaestro
  ) => {
    return GrupoArticulo.findAll({
      include: {
        model: Articulo,
        attributes: [],
        required: true,
      },
      where: {
        IdNegocio: IdNegocio,
        IdGrupoArticuloMaestro: IdGrupoArticuloMaestro,
      },
      raw: true,
    });
  };

  static buscarPorNombres = async (nombres, IdEmpresa, transaction) => {
    return GrupoArticuloMaestro.findAll({
      where: {
        Nombre: { [Op.in]: nombres },
        IdEmpresa,
      },
      raw: true,
      transaction,
    });
  };

  static create = async (data, transaction) => {
    return GrupoArticuloMaestro.create(data, {
      transaction,
    }).then((data) => data.toJSON());
  };

  static update = async (params = {}, where = {}, transaction) => {
    console.log("params");
    console.log(params);
    console.log("where");
    console.log(where);
    console.log("transaction");
    console.log(transaction);
    return GrupoArticuloMaestro.update(params, {
      where,
      transaction,
    });
  };

  static bulkCreate = async (params, transaction) => {
    return GrupoArticuloMaestro.bulkCreate(params, {
      transaction,
    });
  };
}

export default GrupoArticuloMaestroRepository;
