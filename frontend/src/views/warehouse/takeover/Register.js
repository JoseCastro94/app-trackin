import * as React from 'react'

import { useTheme } from '@mui/material/styles'
import {
    Grid,
    TextField,
    useMediaQuery,
    Container,
    Button,
    ButtonGroup,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    OutlinedInput,
    InputAdornment,
} from '@mui/material'

import DataGridApp from '../../../ui-component/grid/DataGridApp'

import { GridActionsCellItem } from '@mui/x-data-grid'

import { gridSpacing } from '../../../store/constant'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import SearchIcon from '@mui/icons-material/Search'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import TocOutlinedIcon from '@mui/icons-material/TocOutlined'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'

import PickUser from '../../shared/user/PickUser'
import ControlSeries from './ControlSeries'

import DialogMain from '../../../ui-component/alerts/DialogMain'
import AlertApp from '../../../ui-component/alerts/AlertApp'

import Adjunto from './Adjunto.js'

import { modeContext } from '../../../context/modeContext'

import {
    useParams,
    useNavigate
} from "react-router-dom"

const baseURL = process.env.PUBLIC_URL

const WarehouseTakeoverRegister = () => {
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { company, token, tokenCompany } = React.useContext(modeContext)
    let { IdRelevoAlmacen } = useParams()

    const navigate = useNavigate()

    const handleFindUser = () => {
        handleOpenUser(true)
    }

    const [listWarehouse, setListWarehouse] = React.useState([])

    React.useEffect(() => {
        fetch(process.env.REACT_APP_API + 'business/api/almacen/OwnJustAlmacen', {
            method: 'POST',
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
                setListWarehouse(response)
            })
    }, [token, tokenCompany])

    React.useEffect(() => {
        if (listWarehouse.length > 0) {
            if (IdRelevoAlmacen) {
                setDisabled(true)
                fetch(process.env.REACT_APP_API + 'business/api/relevo_almacen/getOne', {
                    method: 'POST',
                    body: JSON.stringify({
                        IdRelevoAlmacen: IdRelevoAlmacen
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
                        if (response) {
                            setWarehouse(response.IdAlmacen)
                            setUser({
                                id_user: response.IdUsuario,
                                documento: response.NroDocumento,
                                nombre: `${response.ApellidoPaterno} ${response.ApellidoMaterno} ${response.Nombres}`
                            })
                        } else {
                            navigate(`${baseURL}/warehouse/takeover/home`)
                        }
                    })
            }
        }
    }, [listWarehouse, IdRelevoAlmacen, navigate, token, tokenCompany])

    const [warehouse, setWarehouse] = React.useState('-')

    const handleChangeWarehouse = (event) => {
        let selectValue = event.target.value
        setWarehouse(selectValue)
    }

    const [openUser, setOpenUser] = React.useState(false)

    const handleOpenUser = (action) => {
        setOpenUser(action)
    }

    const [user, setUser] = React.useState({
        id_user: '',
        documento: '',
        nombre: ''
    })

    const handleSelectedUser = (pick_user) => {
        setUser({
            id_user: pick_user.id,
            documento: pick_user.NroDocumento,
            nombre: `${pick_user.ApellidoPaterno} ${pick_user.ApellidoMaterno} ${pick_user.Nombres}`
        })
    }

    React.useEffect(() => {
        if (user.id_user !== '' && IdRelevoAlmacen) {
            fetch(process.env.REACT_APP_API + 'business/api/relevo_almacen/getDetail', {
                method: 'POST',
                body: JSON.stringify({
                    IdRelevoAlmacen: IdRelevoAlmacen
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
                    setRows(response.list)
                    setSelectionModel(response.checked)
                })
        }
    }, [user, IdRelevoAlmacen, token, tokenCompany])

    const handleStart = () => {
        setDisabled(true)
        fetch(process.env.REACT_APP_API + 'business/api/relevo_almacen/ins', {
            method: 'POST',
            body: JSON.stringify({
                IdAlmacen: warehouse,
                IdUsuarioDestino: user.id_user
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
                if (response.status === 'Ok') {
                    setRows(response.relevo)
                    setIdRelevoAlmacen(response.IdRelevoAlmacen)
                } else {
                    setOpenAlert(true)
                    setStateMessage({
                        message: response.message,
                        severity: 'error'
                    })
                    setDisabled(false)
                }
            })
    }

    const [openControl, setOpenControl] = React.useState(false)
    const [paramControl, setParamControl] = React.useState({
        IdAlmacen: null,
        IdNegocio: null,
        IdArticulo: null,
        Tipo: null
    })

    const columns = React.useMemo(
        () => [
            { field: 'CodigoArticulo', headerName: 'Código artículo', width: 200, headerAlign: 'center', },
            { field: 'DescripcionArticulo', headerName: 'Artículo', width: 250, headerAlign: 'center', },
            { field: 'CategoriaArticulo', headerName: 'Categoría', width: 200, headerAlign: 'center', },
            { field: 'Negocio', headerName: 'Negocio', width: 200, headerAlign: 'center', },
            { field: 'Tipo', headerName: 'Tipo', width: 200, headerAlign: 'center', },
            {
                field: 'Cantidad',
                headerName: 'Cantidad',
                type: 'number',
                width: 90,
                headerAlign: 'center',
            },
            {
                field: 'CantidadActual',
                headerName: 'Stock',
                type: 'number',
                width: 90,
                headerAlign: 'center',
            },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    let a = []
                    a.push(
                        <GridActionsCellItem
                            icon={<InfoOutlinedIcon></InfoOutlinedIcon>}
                            label='Incidencias'
                            onClick={() => {
                                navigate(`${baseURL}/incident/register?IdAlmacen=${params.row.IdAlmacen}&IdNegocio=${params.row.IdNegocio}&IdArticulo=${params.row.IdArticulo}&Id=${params.row.id}&Back=${params.row.IdRelevoAlmacen}`)
                            }}
                        >
                        </GridActionsCellItem>
                    )
                    if (params.row.IsControlSerie) {
                        a.push(
                            <GridActionsCellItem
                                icon={<TocOutlinedIcon />}
                                label="Ver articulos"
                                onClick={() => {
                                    setOpenControl(true)
                                    setParamControl({
                                        IdAlmacen: params.row.IdAlmacen,
                                        IdNegocio: params.row.IdNegocio,
                                        IdArticulo: params.row.IdArticulo,
                                        Tipo: params.row.Tipo
                                    })
                                }}
                            />
                        )
                    }
                    return a
                },
            },
            { field: 'id', hide: true },
            { field: 'IdRelevoAlmacen', hide: true },
            { field: 'IdStock', hide: true },
            { field: 'IdAlmacen', hide: true },
            { field: 'IdNegocio', hide: true },
            { field: 'IdEmpresa', hide: true },
            { field: 'IdArticulo', hide: true },
            { field: 'IsControlSerie', hide: true },
        ],
        [navigate],
    )

    const [rows, setRows] = React.useState([])
    const [disabled, setDisabled] = React.useState(false)

    const [idRelevoAlmacen, setIdRelevoAlmacen] = React.useState(IdRelevoAlmacen)

    const handleSelected = (ids) => {
        if (idRelevoAlmacen) {
            setSelectionModel(ids)
            fetch(process.env.REACT_APP_API + 'business/api/relevo_almacen/updateCheck', {
                method: 'POST',
                body: JSON.stringify({
                    IdRelevoAlmacen: idRelevoAlmacen,
                    lista: ids
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
                    console.log(response)
                })
        }
    }

    const [selectionModel, setSelectionModel] = React.useState([])

    const handleBack = () => {
        navigate(`${baseURL}/warehouse/takeover/home`)
    }

    const [comentario, setComentario] = React.useState('')

    const handleChangeComentario = (event) => {
        setComentario(event.target.value)
    }

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


    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const [openDialog, setOpenDialog] = React.useState(false)
    const handleProcesar = () => {
        setDisabledProcess(true)
        setOpenDialog(false)
        fetch(process.env.REACT_APP_API + 'business/api/relevo_almacen/procesarRelevo', {
            method: 'POST',
            body: JSON.stringify({
                IdRelevoAlmacen: idRelevoAlmacen,
                Comentario: comentario
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
                if (response.status === 'Ok') {
                    process_takeover(() => {
                        setOpenAlert(true)
                        setStateMessage({
                            message: response.message,
                            severity: 'success'
                        })
                        setTimeout(() => {
                            navigate(`${baseURL}/warehouse/takeover/home`)
                        }, 1000)
                    })
                } else {
                    setOpenAlert(true)
                    setStateMessage({
                        message: response.message,
                        severity: 'error'
                    })
                    setDisabledProcess(false)
                }
            })
    }

    const handleOpenDialog = () => {
        const msg = []
        if (!idRelevoAlmacen) {
            msg.push('Debe de iniciar el relevo para procesar')
        }

        if (msg.length === 0) {
            setOpenDialog(true)
        } else {
            setOpenAlert(true)
            setStateMessage({
                message: msg.join(', '),
                severity: 'error'
            })
        }
    }

    const [disabledProcess, setDisabledProcess] = React.useState(false)

    const [openAdjunto, setOpenAdjunto] = React.useState(false)

    const handleOpenAttached = () => {
        if (idRelevoAlmacen) {
            handleRegisterEvaluation(true)
        }
    }

    const handleRegisterEvaluation = (status) => {
        setOpenAdjunto(status)
    }

    const handleDownload = () => {
        if (idRelevoAlmacen) {
            setLoadingDownload(true)
            fetch(`${process.env.REACT_APP_API}business/api/relevo_almacen/cargo`, {
                body: JSON.stringify({
                    IdRelevoAlmacen: idRelevoAlmacen
                }),
                method: 'POST',
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
                .then(response => response.blob())
                .then(blob => {
                    let url = window.URL.createObjectURL(blob)
                    let a = document.createElement('a')
                    a.href = url
                    a.download = 'cargo_relevo.pdf'
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    setLoadingDownload(false)
                })
        }
    }

    const [loadingDownload, setLoadingDownload] = React.useState(false)

    const process_takeover = (callback) => {
        callback = typeof callback === 'undefined' ? function () { } : callback
        fetch(`${process.env.REACT_APP_SECURITY_API}/api/external/process_takeover/${process.env.REACT_APP_ID_APP}`, {
            method: 'POST',
            body: JSON.stringify({
                id_user_selected: user.id_user
            }),
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
            .then(res => res.json())
            .then(response => {
                console.log(response)
                callback()
            })
            .catch(error => console.error('Error:', error))
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Nuevo Responsable</Typography>
            </Grid>
            <Container fixed>
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
                                <AccountCircleOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                Persona asignada
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                <Grid item xs={4} sm={2}>
                                    <FormControl fullWidth size='small' margin='normal'>
                                        <InputLabel id="lblWarehouse" disabled={disabled}>Almacen</InputLabel>
                                        <Select
                                            labelId="lblWarehouse"
                                            label="Almacen"
                                            size='small'
                                            value={warehouse}
                                            onChange={handleChangeWarehouse}
                                            disabled={disabled}
                                        >
                                            <MenuItem value='-'>--Seleccionar--</MenuItem>
                                            {
                                                listWarehouse.map((option) =>
                                                    <MenuItem key={option.IdAlmacen} value={option.IdAlmacen}>{option.Tipo} - {option.Nombre}</MenuItem>
                                                )
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <FormControl variant="outlined" margin='normal' fullWidth>
                                        <InputLabel htmlFor="txtDNI" disabled={disabled} size='small'>DNI:</InputLabel>
                                        <OutlinedInput
                                            id="txtDNI"
                                            type="text"
                                            size='small'
                                            value={user.documento}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size='small'
                                                        aria-label="toggle password visibility"
                                                        onClick={handleFindUser}
                                                        edge="end"
                                                        disabled={disabled}
                                                    >
                                                        <SearchIcon></SearchIcon>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="DNI:"
                                            disabled={disabled}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Nombre:"
                                        margin="normal"
                                        name="almacen_destino_responsable"
                                        type="text"
                                        size='small'
                                        value={user.nombre}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Razón Social:"
                                        margin="normal"
                                        name="almacen_destino_responsable"
                                        type="text"
                                        size='small'
                                        value={company?.razon_social}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size='medium'
                                        fullWidth
                                        sx={{
                                            marginTop: 2
                                        }}
                                        disabled={disabled}
                                        onClick={handleStart}
                                    >
                                        Iniciar
                                    </Button>
                                </Grid>
                            </Grid>
                            <PickUser
                                open={openUser}
                                options={{
                                    url: process.env.REACT_APP_API + 'business/api/usuario/UsuariosAlmacenEnabled',
                                    method: 'GET'
                                }}
                                handleClose={() => { handleOpenUser(false) }}
                                handleSelectedUser={handleSelectedUser}
                            >
                            </PickUser>
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
                                <PlaylistAddCheckIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                Resumen de artículos
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                <Grid item xs={12}>
                                    <DataGridApp
                                        rows={rows}
                                        columns={columns}
                                        height={420}
                                        checkboxSelection
                                        onSelectionModelChange={(ids) => {
                                            handleSelected(ids)
                                        }}
                                        selectionModel={selectionModel}
                                        disableSelectionOnClick
                                    ></DataGridApp>
                                </Grid>
                                <ControlSeries
                                    open={openControl}
                                    options={{
                                        url: process.env.REACT_APP_API + 'business/api/control_series/ListByStockType',
                                        param: paramControl,
                                        method: 'POST'
                                    }}
                                    handleClose={() => { setOpenControl(false) }}
                                >
                                </ControlSeries>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={8} sm={8}>
                            <ButtonGroup aria-label="outlined primary button group" fullWidth>
                                <TextField
                                    fullWidth
                                    label="Comentario"
                                    margin="normal"
                                    name="comentario_member"
                                    type="text"
                                    size='small'
                                    placeholder='Escribe aquí tu comentario'
                                    value={comentario}
                                    onChange={handleChangeComentario}
                                />
                                {
                                    loadingDownload &&
                                    <CircularProgress
                                        sx={{
                                            marginRight: 1,
                                            marginLeft: 1
                                        }}
                                        color="success"
                                    />
                                }
                                {
                                    !loadingDownload &&
                                    <IconButton
                                        sx={{
                                            marginRight: 1
                                        }}
                                        edge="end"
                                        aria-label="download cargo"
                                        onDoubleClick={handleDownload}
                                    >
                                        <AssignmentTurnedInOutlinedIcon />
                                    </IconButton>
                                }
                                <IconButton
                                    sx={{
                                        marginRight: 1
                                    }}
                                    edge="end"
                                    aria-label="upload cargo"
                                    onClick={handleOpenAttached}
                                >
                                    <FileUploadOutlinedIcon />
                                </IconButton>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={2} sm={2} alignSelf="center">
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={handleBack}
                            >
                                Regresar
                            </Button>
                        </Grid>
                        <Grid item xs={2} sm={2} alignSelf="center">
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleOpenDialog}
                                disabled={disabledProcess}
                            >
                                Procesar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <DialogMain
                    open={openDialog}
                    title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                    body='¿Desea procesar el relevo del almacen?'
                    buttons={[
                        {
                            text: 'Cancelar',
                            onClick: handleCloseDialog,
                            color: 'secondary',
                            variant: 'outlined'
                        },
                        {
                            text: 'Registrar',
                            onClick: handleProcesar,
                            color: 'primary',
                            variant: 'contained',
                        }
                    ]}
                ></DialogMain>
                <AlertApp
                    open={openAlert}
                    title="Registro de relevo de almacen"
                    body={stateMessage.message}
                    handleClose={handleCloseAlert}
                    severity={stateMessage.severity}
                >
                </AlertApp>
                <Adjunto
                    open={openAdjunto}
                    id={idRelevoAlmacen}
                    edit={idRelevoAlmacen}
                    title={idRelevoAlmacen}
                    handleClose={() => { handleRegisterEvaluation(false) }}
                >
                </Adjunto>
            </Container>
        </Grid>
    )
}

export default WarehouseTakeoverRegister