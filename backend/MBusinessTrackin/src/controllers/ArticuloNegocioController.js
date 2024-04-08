import BaseController from "./BaseController.js";
import ArticuloNegocioRepository from "../repositories/ArticuloNegocioRepository.js";

class ArticuloNegocioController extends BaseController {

    static listarArticulos = async (req, res) => {
        try {
            const {company} = req.headers
            const articulos = await ArticuloNegocioRepository.listarArticulos(company.id)
            this.successResponse(res, articulos)
        } catch (error) {
            this.errorResponse(res, error)
        }
    }
    

    static listarArticulosNew = async (req, res) => {
        try {
            const {company} = req.headers
            const articulos = await ArticuloNegocioRepository.listarArticulosNew(company.id)
            this.successResponse(res, articulos)
        } catch (error) {
            this.errorResponse(res, error)
        }
    }

    static buscarNegociosPorArticulo = async (req, res) => {
        try {
            const {company} = req.headers
            const {id_articulo} = req.params
            const negocios = await ArticuloNegocioRepository.buscarNegociosPorArticulo(id_articulo, company.id)
            this.successResponse(res, negocios)
        } catch (error) {
            this.errorResponse(res, error)
        }
    }
    
    static buscarNegociosPorArticuloNew = async (req, res) => {
        try {
            const {company} = req.headers
            const {id_articulo} = req.params
            const negocios = await ArticuloNegocioRepository.buscarNegociosPorArticuloNew(id_articulo, company.id)
            this.successResponse(res, negocios)
        } catch (error) {
            this.errorResponse(res, error)
        }
    }
    
    static buscarArticuloReal = async (req, res) => {
        try {
            const {company} = req.headers
            const {id_articulo,id_negocio} = req.params
            const negocios = await ArticuloNegocioRepository.buscarArticuloReal(id_articulo,id_negocio, company.id)
            this.successResponse(res, negocios)
        } catch (error) {
            this.errorResponse(res, error)
        }
    }

}

export default ArticuloNegocioController