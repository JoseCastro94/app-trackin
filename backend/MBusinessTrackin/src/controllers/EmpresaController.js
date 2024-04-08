import TipoNegocioRepository from "../repositories/TipoNegocioRepository.js";
import EmpresaRepository from "../repositories/EmpresaRepository.js";
import AlmacenRepository from "../repositories/AlmacenRepository.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import BaseController from "./BaseController.js";
import { Ubigeo } from "../models/Ubigeo.js";
import Util from "../utils/Util.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

class EmpresaController extends BaseController {
    static findByRuc = async (req, res) => {
        const { user } = req.headers
        try {
            const {
                ruc
            } = req.params

            const empresa = await EmpresaRepository.findByRuc(ruc)
            const usuario = await UsuarioRepository.findByPk(user.id_user)

            const token = jwt.sign({
                data: {
                    empresa,
                    usuario
                }
            }, process.env.SECRET_APP_JWT, {
                expiresIn: (60 * 60 * 8)
            })
            return this.successResponse(res, token)
        } catch (err) {
            return this.errorResponse(res, err)
        }
    }

    static listar = async (req, res) => {
        try {
            const pagination = Util.pagination(req)
            const data = await EmpresaRepository.listar(pagination)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static crear = async (req, res) => {
        try {
            const { user } = req.headers
            const { ruc, razonSocial, nombreComercial, direccion, ubigeo_inei } = req.body
            const existRuc = await EmpresaRepository.findByRuc(ruc)
            const existRazonSocial = await EmpresaRepository.findByRazonSocial(razonSocial)

            if (existRuc) {
                return this.infoResponse(res, {
                    success: false,
                    message: `El número de ruc ${ruc} ya existe!`,
                    data: existRuc
                })
            }

            if (existRazonSocial) {
                return this.infoResponse(res, {
                    success: false,
                    message: `La razón social ${razonSocial} ya existe`,
                    data: existRazonSocial
                })
            }

            const ubigeo = await Ubigeo.findOne({ where: { ubigeo_inei: ubigeo_inei } }).then(data => data.toJSON())
            const create = EmpresaRepository.create({
                Ruc: ruc,
                RazonSocial: razonSocial,
                NombreComercial: nombreComercial,
                Direccion: direccion,
                UsuarioCreacion: user.username,
                IdUbigeo: ubigeo.id_ubigeo

            })
            return this.createdResponse(res, {
                success: true,
                message: 'Registro exitoso',
                data: create
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static update = async (req, res) => {
        try {
            const { user } = req.headers
            const { ruc, razonSocial, nombreComercial, direccion, ubigeo_inei, id } = req.body

            const existRuc = await EmpresaRepository.findByRuc(ruc, id)
            const existRazonSocial = await EmpresaRepository.findByRazonSocial(razonSocial, id)

            if (existRuc) {
                return this.infoResponse(res, {
                    success: false,
                    message: `El número de ruc ${ruc} ya existe!`,
                    data: existRuc
                })
            }

            if (existRazonSocial) {
                return this.infoResponse(res, {
                    success: false,
                    message: `La razón social ${razonSocial} ya existe`,
                    data: existRazonSocial
                })
            }

            const ubigeo = await Ubigeo.findOne({ where: { ubigeo_inei: ubigeo_inei } }).then(data => data.toJSON())
            const update = EmpresaRepository.update({
                Ruc: ruc,
                RazonSocial: razonSocial,
                NombreComercial: nombreComercial,
                Direccion: direccion,
                UsuarioModifica: user.username,
                FechaModifica: new Date(),
                IdUbigeo: ubigeo.id_ubigeo
            }, {
                IdEmpresa: id
            })
            return this.createdResponse(res, {
                success: true,
                message: 'Actualización exitoso',
                data: update
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static destroy = async (req, res) => {
        const { user } = req.headers
        const { id } = req.params
        try {
            const almacenes = await AlmacenRepository.buscarPorEmpresa(id)
            const negocios = await TipoNegocioRepository.buscarPorEmpresa(id)

            if (almacenes.length > 0) {
                return this.infoResponse(res, {
                    message: 'La empresa tiene almacenes asignados.',
                })
            }

            if (negocios.length > 0) {
                return this.infoResponse(res, {
                    message: 'La empresa tiene negocios asignados.',
                })
            }

            const empresa = await EmpresaRepository.findById(id)

            const destroy = EmpresaRepository.update({
                Activo: !empresa.Activo,
                UsuarioModifica: user.username,
                FechaModifica: new Date(),
            }, {
                IdEmpresa: id
            })

            return this.createdResponse(res, {
                success: true,
                message: `Registro ${empresa.Activo ? 'eliminado' : 'activado'}.`,
                data: destroy
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static importData = async (req, res) => {
        const { user, company } = req.headers

        try {
            let empresas = []
            let empresasSuccess = []
            let empresasErrors = []
            if (req.files) {
                empresas = await Util.readExcel(req.files)
                empresas = empresas.reduce((previousValue, currentValue) => {
                    if (previousValue.find(empresa => empresa.Ruc === currentValue.Ruc)) {
                        currentValue.errores = currentValue.errores ?? []
                        currentValue.errores.push('La empresa se repite en el excel.')
                    }
                    previousValue.push(currentValue)
                    return previousValue
                }, [])

                empresas.filter(empresa => parseInt(empresa.Ruc).toString().length < 11).map(empresa => {
                    empresa.errores = empresa.errores ?? []
                    empresa.errores.push('El número de Ruc debe ser válido.')
                    return empresa
                })

                empresas.filter(empresa => !empresa.RazonSocial).map(empresa => {
                    empresa.errores = empresa.errores ?? []
                    empresa.errores.push('Razón Social es requerido.')
                    return empresa
                })

                empresas.filter(empresa => !empresa.NombreComercial).map(empresa => {
                    empresa.errores = empresa.errores ?? []
                    empresa.errores.push('Nombre Comercial es requerido.')
                    return empresa
                })

                const rucs = empresas.filter(empresa => !empresa.errores).map(empresa => empresa.Ruc)
                const empresasExistentes = await EmpresaRepository.buscarPorRucs(rucs)
                empresas.filter(empresa => empresasExistentes.find(item => item.Ruc === empresa.Ruc)).map(empresa => {
                    empresa.errores = empresa.errores ?? []
                    empresa.errores.push('La empresa ya existe en el sistema.')
                    return empresa
                })

                const codigos = empresas.filter(empresa => !empresa.errores).map(empresa => empresa.Ubigeo)
                const ubigeos = await Ubigeo.findAll({ where: { ubigeo_inei: { [Op.in]: codigos } }, raw: true })
                empresas = empresas.map(empresa => {
                    const ubigeo = ubigeos.find(ubigeo => parseInt(ubigeo.ubigeo_inei) === parseInt(empresa.Ubigeo))
                    if (!ubigeo) {
                        empresa.errores = empresa.errores ?? []
                        empresa.errores.push('El código de ubigeo no es existe.')
                    } else {
                        empresa.IdUbigeo = ubigeo.id_ubigeo
                        empresa.UsuarioCreacion = user.username
                    }
                    return empresa
                })

                empresasSuccess = empresas.filter(empresa => !empresa.errores)
                empresasErrors = empresas.filter(empresa => empresa.errores)

                await EmpresaRepository.bulkCreate(empresasSuccess)

                if (empresasErrors.length > 0) {
                    return this.infoResponse(res, {
                        success: false,
                        message: 'Archivo con errores.',
                        data: {
                            empresasSuccess: empresasSuccess.length,
                            empresasErrors: empresasErrors,
                        }
                    })
                }

                return this.successResponse(res, {
                    success: true,
                    message: 'Importación correcta.',
                    data: {
                        empresasSuccess
                    }
                })
            }

            return this.infoResponse(res, {
                success: false,
                message: 'No existe el archivo.'
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

}

export default EmpresaController
