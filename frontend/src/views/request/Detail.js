import * as React from 'react'

import PropTypes from 'prop-types'

import { useTheme, styled } from '@mui/material/styles'

// material-ui
import {
    Grid,
    Typography,
    Container,
    Stack,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    Button,
    Snackbar,
    Alert,
} from '@mui/material'

import { stepConnectorClasses } from '@mui/material/StepConnector'

import Check from '@mui/icons-material/Check'
import CheckIcon from '@mui/icons-material/Check'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import StorefrontIcon from '@mui/icons-material/Storefront'
import InventoryIcon from '@mui/icons-material/Inventory'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelIcon from '@mui/icons-material/Cancel'

import {
    useParams,
    useNavigate,
} from "react-router-dom"

import { gridSpacing } from '../../store/constant'

import DataGridApp from '../../ui-component/grid/DataGridApp.js'

import { format } from 'date-fns'

import DialogMain from '../../ui-component/alerts/DialogMain.js'

import { modeContext } from '../../context/modeContext'
import { Box } from '@mui/system'

import { APP_REQUEST_STATUS } from '../../store/constant.js'

const baseURL = process.env.PUBLIC_URL

const columns = [
    { field: 'Articulo', headerName: '', width: 350 },
    { field: 'CodArticulo', headerName: 'Cod. producto', width: 170 },
    { field: 'Cantidad', headerName: 'Cant. soli.', width: 80, editable: true, type: 'number' },
    { field: 'Documento', headerName: 'DNI', width: 90 },
    { field: 'CantidadEntregado', headerName: 'Cant. entreg.', width: 80 },
    { field: 'FechaCreacion', headerName: 'F. Registro', width: 100, type: 'date' },
    { field: 'Estado', headerName: 'Estado', width: 200 },
    { field: 'CodAlmacen', hide: true },
]

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: theme.palette.success.main,
    }),
    '& .QontoStepIcon-completedIcon': {
        color: theme.palette.success.main,
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}))

function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    )
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
}

const ColorlibConnector = styled(StepConnector)(({ theme, ownerState }) => {
    let color = 'warning'

    if (ownerState.state === APP_REQUEST_STATUS.ENTREGADO) {
        color = 'success'
    } else if (ownerState.state === APP_REQUEST_STATUS.CANCELADO) {
        color = 'error'
    }
    return ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor: theme.palette[color].main,
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor: theme.palette[color].main,
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
            borderRadius: 1,
        },
    })
})

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundColor: theme.palette[ownerState.color].main,
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundColor: theme.palette[ownerState.color].main,
    }),
}))

function ColorlibStepIcon(step, state) {
    return (props) => {
        const { active, completed, className } = props

        const icons = {
            1: <CheckIcon />,
            2: <WarehouseOutlinedIcon />,
            3: <CheckCircleOutlineOutlinedIcon />,
            4: <StorefrontIcon />,
            5: <InventoryIcon />,
            6: <DocumentScannerIcon />,
            100: <CancelIcon />,
        }

        let icon = props.icon

        if (step.icon) {
            icon = step.icon
        }

        let color = 'warning'

        if (state === APP_REQUEST_STATUS.ENTREGADO) {
            color = 'success'
        } else if (state === APP_REQUEST_STATUS.CANCELADO) {
            color = 'error'
        }

        return (
            <ColorlibStepIconRoot ownerState={{ completed, active, color }} className={className}>
                {icons[String(icon)]}
            </ColorlibStepIconRoot>
        )
    }
}

ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
}

const RequestDetail = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const { token, tokenCompany } = React.useContext(modeContext)
    let { IdSocilitud } = useParams()
    const [solicitud, setSolicitud] = React.useState({
        id: '-',
        FechaSolicitud: '',
        Codigo: '-',
        state: theme.palette.secondary.main
    })

    const [steps, setSteps] = React.useState([
        {
            title: 'Pendiente Programar',
            sub: ''
        }, {
            title: 'En proceso',
            sub: ''
        }, {
            title: 'Entregado',
            sub: ''
        }
    ])
    const [step, setStep] = React.useState(-1)

    const [detalle, setDetalle] = React.useState([])

    const evalColorState = React.useCallback(
        (response) => {
            switch (response.IdParametro) {
                case APP_REQUEST_STATUS.PENDIENTE:
                    response.state = theme.palette.warning.main
                    response.back = theme.palette.warning.light
                    break;
                case APP_REQUEST_STATUS.EN_PROCESO:
                    response.state = theme.palette.success.main
                    response.back = theme.palette.success.light
                    break;
                case APP_REQUEST_STATUS.ENTREGADO:
                    response.state = theme.palette.primary.main
                    response.back = theme.palette.secondary.dark
                    break;
                case APP_REQUEST_STATUS.CANCELADO:
                    response.state = theme.palette.error.main
                    response.back = theme.palette.error.light
                    break;
                default:
                    response.state = theme.palette.warning.main
                    response.back = theme.palette.warning.light
                    break;
            }
        },
        [theme.palette],
    )

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API}business/api/solicitud_articulo/SolicitudArticulosInfo/${IdSocilitud}`, {
            method: 'GET',
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
                if (response !== null) {
                    response.FechaSolicitud = format(new Date(response.FechaSolicitud), "dd/LL/yyyy hh:mm:ss")
                    response.Codigo = `SOL-${response.Periodo}-${String(response.Correlativo).padStart(6, 0)}`

                    evalColorState(response)
                    setSolicitud(response)
                } else {
                    navigate(`${baseURL}/request/info`)
                }
            })
        fetch(`${process.env.REACT_APP_API}business/api/detalle_solicitud_articulo/detail/${IdSocilitud}`, {
            method: 'GET',
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
                response.forEach(element => {
                    element.FechaCreacion = new Date(element.FechaCreacion)
                })
                setDetalle(response)
            })

        fetch(`${process.env.REACT_APP_API}business/api/solicitud_articulo/TrackSolicitud/${IdSocilitud}`, {
            method: 'GET',
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
                let s = -1
                let l = null
                let pendiente = ''
                if (response.pendiente.Estados.length > 0) {
                    pendiente = format(new Date(response.pendiente.Estados[0].FechaCreacion), "dd/LL/yyyy hh:mm:ss")
                    s = 0
                    l = -2
                }
                let proceso = ''
                if (response.proceso.Estados.length > 0) {
                    proceso = format(new Date(response.proceso.Estados[0].FechaCreacion), "dd/LL/yyyy hh:mm:ss")
                    s = 1
                    l = -1
                }
                let entregado = ''
                if (response.entregado.Estados.length > 0) {
                    entregado = format(new Date(response.entregado.Estados[0].FechaCreacion), "dd/LL/yyyy hh:mm:ss")
                    s = 2
                    l = null
                }

                let pasos = [
                    {
                        title: 'Pendiente Programar',
                        sub: pendiente
                    }, {
                        title: 'En proceso',
                        sub: proceso
                    }, {
                        title: 'Entregado',
                        sub: entregado
                    }
                ]

                let cancelado = ''
                if (response.cancelado.Estados.length > 0) {
                    s++;
                    cancelado = format(new Date(response.cancelado.Estados[0].FechaCreacion), "dd/LL/yyyy hh:mm:ss")
                    pasos = pasos.slice(0, l)
                    pasos.push({
                        title: 'Cancelado',
                        sub: cancelado,
                        icon: 100
                    })
                }
                setSteps(pasos)
                setStep(s)
            })
    }, [IdSocilitud, evalColorState, navigate, token, tokenCompany])

    const [proc, setProc] = React.useState({
        id: null
    })

    const handleEditDetail = (
        params,
    ) => {
        setProc(params)
        handleOpenDialog()
    }

    const [openDialog, setOpenDialog] = React.useState(false)

    const handleCloseDialog = () => {
        handleBackData()
        setOpenDialog(false)
    }

    const handleOpenDialog = () => {
        setOpenDialog(true)
    }

    const handleBackData = () => {
        setDetalle(detalle.map(row => row))
    }

    const handleSave = () => {
        setOpenDialog(false)
        let params = proc
        let cantidad = parseInt(params.value)
        if (!isNaN(cantidad)) {
            fetch(`${process.env.REACT_APP_API}business/api/detalle_solicitud_articulo/updateCantidad/${params.id}`, {
                method: 'POST',
                body: JSON.stringify({
                    cantidad
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
                    switch (response.status) {
                        case 'Error':
                            handleBackData()
                            setAlert({
                                message: response.message,
                                severity: 'error'
                            })
                            setOpenAlert(true)
                            console.log(response)
                            break
                        case 'Ok':
                            setAlert({
                                message: response.message,
                                severity: 'info'
                            })
                            setOpenAlert(true)
                            console.log(response)
                            break
                        default:
                            console.log(response)
                            break
                    }
                    console.log(response)
                })
        }
    }

    const [alert, setAlert] = React.useState({
        message: '',
        severity: 'info'
    })

    const [openAlert, setOpenAlert] = React.useState(false)

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} style={{ paddingTop: 2 }}>
                <Typography variant='h5' sx={{ color: theme.palette.primary.main }}>#{solicitud.Codigo}</Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: 6 }}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Detalle de solicitud</Typography>
            </Grid>
            <Grid item xs={12}>
                <Container fixed>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={1}>
                            <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Estado:</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Box sx={{
                                backgroundColor: solicitud.back,
                                padding: 1,
                                marginTop: -1,
                                border: '1px solid ' + solicitud.state
                            }}>
                                <Typography variant='h4' sx={{ color: solicitud.state }}>{solicitud.Estado}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Fecha de registro:</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant='h4' sx={{ color: theme.palette.success.main }}>{solicitud.FechaSolicitud}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Proceso:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack sx={{ width: '100%' }} spacing={4}>
                                <Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector ownerState={{ state: solicitud.IdParametro }} />}>
                                    {steps.map((step) => (
                                        <Step key={step.title}>
                                            <StepLabel StepIconComponent={ColorlibStepIcon(step, solicitud.IdParametro)}>
                                                <Typography variant='h5' sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{step.title}</Typography>
                                                <Typography variant='h6' sx={{ color: theme.palette.primary.main }}>{step.sub}</Typography>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Resumen de artículos:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <DataGridApp
                                rows={detalle}
                                columns={columns}
                                onCellEditCommit={handleEditDetail}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
            <DialogMain
                open={openDialog}
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                body='¿Desea modificar la cantidad del detalle de la solicitud?'
                actions={
                    <div>
                        <Button onClick={handleCloseDialog}>No</Button>
                        <Button onClick={handleSave}>Si</Button>
                    </div>
                }
            >
            </DialogMain>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openAlert}
                key="top_left"
                autoHideDuration={6000}
                onClose={handleCloseAlert}
            >
                <Alert severity={alert.severity} onClose={handleCloseAlert} sx={{ width: '100%' }}>{alert.message}</Alert>
            </Snackbar>
        </Grid>
    )
}

export default RequestDetail