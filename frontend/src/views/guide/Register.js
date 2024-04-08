import * as React from 'react'

import { useTheme } from '@mui/material/styles'

// material-ui
import {
    Grid,
    Typography,
    Container,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useMediaQuery,
    Button,
} from '@mui/material'
import { gridSpacing } from '../../store/constant'

import {
    useParams,
    useNavigate,
} from "react-router-dom"

import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DialogMain from '../../ui-component/alerts/DialogMain'
import AlertApp from '../../ui-component/alerts/AlertApp'

import Sender from './Sender'
import CarrierType from './CarrierType'
import Carrier from './Carrier'
import Article from './Article'

import { modeContext } from '../../context/modeContext'

const baseURL = process.env.PUBLIC_URL

const RegisterGuide = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)
    let { IdGuia } = useParams()

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const IdDespacho = urlParams.get('IdDespacho')
    const IdTransferencia = urlParams.get('IdTransferencia')

    React.useEffect(() => {
        if (IdDespacho) {
            fetch(process.env.REACT_APP_API + 'business/api/despachos/findOne', {
                method: 'POST',
                body: JSON.stringify({
                    IdDespacho
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'empresa': tokenCompany,
                    cache: 'no-cache',
                    pragma: 'no-cache',
                    'cache-control': 'no-cache'
                }
            })
                .catch(error => console.error('Error:', error))
                .then(res => res.json())
                .then(response => {
                    let lista_articulos = response.DetalleDespachoSolicituds.map(element => {
                        return {
                            UnidadMedida: element.DetalleSolicitudArticulo.ArticuloNegocio.Articulo.Parametro.Nombre,
                            DesUnidadMedida: element.DetalleSolicitudArticulo.ArticuloNegocio.Articulo.Parametro.Descripcion,
                            CantidadItems: element.CantidadEntrega,
                            DetalleItems: element.ItemName,
                            SKUProd: element.ItemCode,
                        }
                    })
                    setInfo({
                        DetalleGuiaRemisions: lista_articulos,
                        preaction: {
                            TipoDocumento: response.Usuario.TipoDocumento,
                            NroDocumento: response.Usuario.NroDocumento
                        }
                    })
                })
        }
    }, [IdDespacho, token, tokenCompany])

    React.useEffect(() => {
        if (IdTransferencia) {
            fetch(process.env.REACT_APP_API + 'business/api/translado_almacen/getOne', {
                method: 'POST',
                body: JSON.stringify({
                    IdTransferencia
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'empresa': tokenCompany,
                    cache: 'no-cache',
                    pragma: 'no-cache',
                    'cache-control': 'no-cache'
                }
            })
                .catch(error => console.error('Error:', error))
                .then(res => res.json())
                .then(response => {
                    let lista_articulos = response.DetalleTransladoAlmacenes.map(element => {
                        return {
                            UnidadMedida: element.Articulo.Parametro.Nombre,
                            DesUnidadMedida: element.Articulo.Parametro.Descripcion,
                            CantidadItems: element.CantidadEnviada,
                            DetalleItems: element.ItemName,
                            SKUProd: element.ItemCode,
                        }
                    })
                    setInfo({
                        DetalleGuiaRemisions: lista_articulos,
                        preaction: {
                            TipoDocumento: response.Usuario.TipoDocumento,
                            NroDocumento: response.Usuario.NroDocumento
                        },
                        routes: {
                            origin: response.AlmacenOrigen.Ubigeo.ubigeo_reniec,
                            origin_adress: response.AlmacenOrigen.Direccion,
                            target: response.AlmacenDestino.Ubigeo.ubigeo_reniec,
                            target_adress: response.AlmacenDestino.Direccion,
                        }
                    })
                })
        }
    }, [IdTransferencia, token, tokenCompany])

    const [info, setInfo] = React.useState({})

    const sender_remitente = React.createRef()
    const getDataRemitente = () => sender_remitente.current.getData()
    const getValidateRemitente = () => sender_remitente.current.getValidate()

    const sender_destinatario = React.createRef()
    const getDataDestinatario = () => sender_destinatario.current.getData()
    const getValidateDestinatario = () => sender_destinatario.current.getValidate()

    const carrier_type = React.createRef()
    const getDataCarrierType = () => carrier_type.current.getData()
    const getValidateCarrierType = () => carrier_type.current.getValidate()

    const carrier = React.createRef()
    const getDataCarrier = () => carrier.current.getData()
    const getValidateCarrier = () => carrier.current.getValidate()

    const article = React.createRef()
    const getDataArticle = () => article.current.getData()
    const getValidateArticle = () => article.current.getValidate()

    const [openAlert, setOpenAlert] = React.useState(false)
    const [stateMessage, setStateMessage] = React.useState({
        message: '',
        severity: 'info'
    })
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    const handleSave = () => {
        setOpenDialog(false)

        const data_remitente = getDataRemitente()
        const data_destinatario = getDataDestinatario()
        const data_carrier_type = getDataCarrierType()
        const data_carrier = getDataCarrier()
        const data_article = getDataArticle()

        const datos = {
            razon_social_remitente: data_remitente.razon_social,
            tipo_documento_remitente: data_remitente.tipo_documento,
            documento_remitente: data_remitente.numero_documento,
            ubigeo_remitente: data_remitente.ubigueo,
            direccion_remitente: data_remitente.direccion,
            urbanizacion_remitente: data_remitente.urbanizacion,
            departamento_remitente: data_remitente.departamento,
            provincia_remitente: data_remitente.provincia,
            distrito_remitente: data_remitente.distrito,

            razon_social_destinatario: data_destinatario.razon_social,
            tipo_documento_destinatario: data_destinatario.tipo_documento,
            documento_destinatario: data_destinatario.numero_documento,
            ubigeo_destinatario: data_destinatario.ubigueo,
            direccion_destinatario: data_destinatario.direccion,
            urbanizacion_destinatario: data_destinatario.urbanizacion,
            departamento_destinatario: data_destinatario.departamento,
            provincia_destinatario: data_destinatario.provincia,
            distrito_destinatario: data_destinatario.distrito,
            correo_emision: data_destinatario.email,

            razon_social_proveedor: data_carrier.razonSocial,
            tipo_documento_proveedor: data_carrier.tipoDocumento,
            documento_proveedor: data_carrier.documento,

            ///conductor
            nombre_conductor: data_carrier.nombreConductor,
            apellido_conductor: data_carrier.apellidoConductor,
            dni_conductor: data_carrier.dni,
            licencia_conductor: data_carrier.licenciaConductor,

            ubigeo_proveedor: data_carrier.ubigeoProveedor,
            direccion_proveedor: data_carrier.direccionProveedor,
            departamento_proveedor: data_carrier.departamentoProveedor,
            provincia_proveedor: data_carrier.provinciaProveedor,
            distrito_proveedor: data_carrier.distritoProveedor,

            placa: data_carrier.placa,

            codigo_motivo: data_carrier_type.codigo_motivo,
            motivo: String(data_carrier_type.descripcion).substring(0, 100),
            //// IndiTrans
            peso_total: data_carrier_type.pesoBruto,
            unidad_medicion_transportista: data_carrier_type.unidadMedicion,
            codigo_modalidad: data_carrier_type.tipo,
            fecha_transporte: data_carrier_type.inicioTranslado,

            razon_social_transportista: data_carrier.razonSocial,
            tipo_documento_transportista: data_carrier.tipoDocumento,
            documento_transportista: data_carrier.documento,

            ubigeo_partida: data_carrier.ubigeoPartido,
            direccion_partida: data_carrier.direccionPartida,
            //// urbanizacion partida
            departamento_partida: data_carrier.departamentoPartida,
            provincia_partida: data_carrier.provinciaPartida,
            distrito_partida: data_carrier.distritoPartida,

            ubigeo_destino: data_carrier.ubigeoDestino,
            direccion_destino: data_carrier.direccionDestino,
            //// urbanizacion partida
            departamento_destino: data_carrier.departamentoDestino,
            provincia_destino: data_carrier.provinciaDestino,
            distrito_destino: data_carrier.distritoDestino,

            comentario: data_article.comentario,
            mas_informacion: data_article.mas_informacion,
            lista: data_article.rows,
            IdDespacho: IdDespacho,
            IdTransferencia: IdTransferencia
        }

        fetch(process.env.REACT_APP_API + 'business/api/guia_remision', {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'empresa': tokenCompany,
                cache: 'no-cache',
                pragma: 'no-cache',
                'cache-control': 'no-cache'
            }
        })
            .catch(error => console.error('Error:', error))
            .then(res => res.json())
            .then(response => {
                const go_ok = (message) => {
                    setOpenAlert(true)
                    setStateMessage({
                        message: message,
                        severity: 'info'
                    })
                    setTimeout(() => {
                        navigate(`${baseURL}/guide/home`)
                    }, 2000)
                }
                const go_not_ok = (message) => {
                    setOpenAlert(true)
                    setStateMessage({
                        message: message,
                        severity: 'error'
                    })
                    setLoading(false)
                }
                if (response.status === 'Ok') {
                    if (Array.isArray(response.message)) {
                        const value_respo = response.message[0]
                        if (value_respo.DE_ERRO) {
                            const status_respo = value_respo.DE_ERRO.split(' || ')
                            if (status_respo[0] === "1") {
                                go_ok(String(status_respo[1]))
                            } else {
                                go_not_ok(String(status_respo[1]))
                            }
                        } else {
                            go_not_ok(String(response.message))
                        }
                    } else {
                        go_not_ok(String(response.message))
                    }
                } else {
                    go_not_ok(String(response.message))
                }
            })
    }

    const [loading, setLoading] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)

    const handleCloseDialog = () => {
        setLoading(false)
        setOpenDialog(false)
    }

    const handleOpenDialog = () => {
        const msg = []
        const val_remitente = getValidateRemitente()
        const val_destinatario = getValidateDestinatario()
        const val_tipo_carrier = getValidateCarrierType()
        const val_carrier = getValidateCarrier()
        const val_article = getValidateArticle()

        if (val_remitente.length > 0) {
            msg.push(`Remitente: ${val_remitente.join(', ')}`)
        }
        if (val_destinatario.length > 0) {
            msg.push(`Destinatario: ${val_remitente.join(', ')}`)
        }
        if (val_tipo_carrier.length > 0) {
            msg.push(`Tipo de transportista: ${val_tipo_carrier.join(', ')}`)
        }
        if (val_carrier.length > 0) {
            msg.push(`Transportista: ${val_carrier.join(', ')}`)
        }
        if (val_article.length > 0) {
            msg.push(`Articulos: ${val_article.join(', ')}`)
        }

        if (msg.length > 0) {
            setOpenAlert(true)
            setStateMessage({
                message: msg.join('\r\n'),
                severity: 'info'
            })
        } else {
            setLoading(true)
            setOpenDialog(true)
        }
    }

    const handleBack = () => {
        navigate(`${baseURL}/guide/home`)
    }

    const [showDocument, setShowDocument] = React.useState(false)
    const [showPlate, setShowPlate] = React.useState(false)

    const handleChangeTipoDestinatario = (value) => {
        setShowDocument(value === '01' ? false : true)
        setShowPlate(value === '01' ? false : true)
    }

    React.useEffect(() => {
        if (IdGuia) {
            fetch(process.env.REACT_APP_API + 'business/api/guia_remision/getOne', {
                method: 'POST',
                body: JSON.stringify({
                    IdGuia: IdGuia
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'empresa': tokenCompany,
                    cache: 'no-cache',
                    pragma: 'no-cache',
                    'cache-control': 'no-cache'
                }
            })
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    setInfo(response)
                })
        }
    }, [IdGuia, token, tokenCompany])

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Guía de Remisión</Typography>
            </Grid>
            <Container>
                <Grid item xs={12} sm={12}>
                    <Accordion
                        defaultExpanded={true}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                borderBottom: 1,
                                borderBottomColor: theme.palette.primary.main
                            }}
                        >
                            <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                                <WarehouseOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                Datos de Remitente
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Sender ref={sender_remitente} evaluate_company={true}></Sender>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Accordion
                        defaultExpanded={true}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                borderBottom: 1,
                                borderBottomColor: theme.palette.primary.main
                            }}
                        >
                            <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                                <WarehouseOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                Datos de Destinatario
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Sender ref={sender_destinatario} show_email={true} IdGuia={IdGuia} info={info}></Sender>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Accordion
                        defaultExpanded={true}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                borderBottom: 1,
                                borderBottomColor: theme.palette.primary.main
                            }}
                        >
                            <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                                <LocalShippingOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                Tipo de Transportista
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CarrierType ref={carrier_type} onChangeTipo={handleChangeTipoDestinatario} IdGuia={IdGuia} info={info}></CarrierType>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Accordion
                        defaultExpanded={true}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                borderBottom: 1,
                                borderBottomColor: theme.palette.primary.main
                            }}
                        >
                            <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                                <LocalShippingOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                Datos del Transportista
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Carrier
                                ref={carrier}
                                display_document={showDocument}
                                display_plate={showPlate}
                                IdGuia={IdGuia}
                                info={info}
                            ></Carrier>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Accordion
                        defaultExpanded={true}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                borderBottom: 1,
                                borderBottomColor: theme.palette.primary.main
                            }}
                        >
                            <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                                <PlaylistAddCheckOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                Artículos
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Article ref={article} IdGuia={IdGuia} info={info}></Article>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Grid
                        container
                        spacing={matchDownSM ? 0 : 2}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                        <Grid item xs={2} sm={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={handleBack}
                                disabled={loading}
                            >
                                Regresar
                            </Button>
                        </Grid>
                        {
                            !IdGuia &&
                            <Grid item xs={2} sm={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleOpenDialog}
                                    disabled={loading}
                                >
                                    Guardar
                                </Button>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Container>
            <DialogMain
                open={openDialog}
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                body='¿Desea registrar la guia de remisión?'
                buttons={[
                    {
                        text: 'Cancelar',
                        onClick: handleCloseDialog,
                        color: 'secondary',
                        variant: 'outlined'
                    },
                    {
                        text: 'Registrar',
                        onClick: handleSave,
                        color: 'primary',
                        variant: 'contained',
                    }
                ]}
            >
            </DialogMain>
            <AlertApp
                open={openAlert}
                title="Registro de solicitudes"
                body={stateMessage.message}
                handleClose={handleCloseAlert}
                severity={stateMessage.severity}
            >
            </AlertApp>
        </Grid >
    )
}

export default RegisterGuide