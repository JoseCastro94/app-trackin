import Sequelize from "sequelize";
import {UsuarioAlmacen} from "../models/UsuarioAlmacen.js";
import {Almacen} from "../models/Almacen.js";
import {Usuario} from "../models/Usuario.js";

class UsuarioAlmacenRepository {
    static buscarResponsableAlmacen = (IdAlmacen) => {
        return UsuarioAlmacen.findOne({
            attributes: [
                [Sequelize.col('Usuario.IdUsuario'), 'idUsuario'],
                [Sequelize.fn('CONCAT',
                    Sequelize.col('Usuario.ApellidoPaterno'), ' ',
                    Sequelize.col('Usuario.ApellidoMaterno'), ' ',
                    Sequelize.col('Usuario.Nombres')), 'nombreUsuario'],
            ],
            include: [
                {
                    model: Usuario,
                    attributes: [],
                    required: true,
                    where: {
                        Activo: true
                    }
                }
            ],
            where: {
                IdAlmacen,
                IsAdmin: true
            },
            raw: true
        })
    }

    static listarResponsables = () => {
        return UsuarioAlmacen.findAll({
            attributes: [
                [Sequelize.col('Usuario.IdUsuario'), 'id'],
                [Sequelize.fn('CONCAT',
                    Sequelize.col('Usuario.ApellidoPaterno'), ' ',
                    Sequelize.col('Usuario.ApellidoMaterno'), ' ',
                    Sequelize.col('Usuario.Nombres')), 'nombre'],
            ],
            include: [
                {
                    model: Usuario,
                    attributes: [],
                    required: true,
                    where: {
                        Activo: true
                    }
                }
            ],
            where: {
                IsAdmin: true
            },
            group: Sequelize.col('Usuario.IdUsuario'),
            raw: true
        })
    }

    static listarPorId = (IdUsuario) => {
       
        return UsuarioAlmacen.findAll({
            attributes: [
                [Sequelize.col('Almacene.IdAlmacen'), 'id'],
                [Sequelize.col('Almacene.Nombre'), 'nombre'],
            ],
            include: [
                {
                    model: Almacen,
                    attributes: [],
                    required: true,
                    where: {
                        Activo: true
                    }
                }
            ],
            where: {
                IdUsuario
            },
            raw: true
        })
    }
}

export default UsuarioAlmacenRepository
