import * as React from 'react'

import { useTheme } from '@mui/material/styles'
import {
    Grid,
    TextField,
    useMediaQuery,
    Container,
    Button,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItem,
    ListItemText,
    OutlinedInput,
    InputAdornment,
} from '@mui/material'

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined'

import { gridSpacing } from '../../store/constant'

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Stack from '@mui/material/Stack'
import esLocale from 'date-fns/locale/es'

import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'

import MainModal from '../../ui-component/modals/MainModal.js'

import { GridActionsCellItem } from '@mui/x-data-grid'

import DataGridApp from '../../ui-component/grid/DataGridApp.js'

import { v4 as uuidv4 } from 'uuid'

import DialogMain from '../../ui-component/alerts/DialogMain.js'
import AlertApp from '../../ui-component/alerts/AlertApp.js'

import { modeContext } from '../../context/modeContext'

import {
    useNavigate
} from "react-router-dom"

import UploadFileIcon from "@mui/icons-material/UploadFile"

const localeMap = {
    es: esLocale
}

const columns = [
    { field: 'Articulo', headerName: 'Producto', width: 400, headerAlign: 'center', },
    {
        field: 'Stock',
        headerName: 'Stock',
        type: 'number',
        width: 90,
        headerAlign: 'center',
    },
    { field: 'CodArticulo', headerName: 'Cod. Producto', width: 200, headerAlign: 'center', },
    { field: 'Almacen', headerName: 'Almacen', width: 300, headerAlign: 'center', },
    { field: 'Categoria', headerName: 'Categoria', width: 300, headerAlign: 'center', },
    { field: 'id', hide: true },
    { field: 'CodAlmacen', hide: true },
    { field: 'IdArticulo', hide: true },
    { field: 'U_BPP_TIPUNMED', hide: true },
    { field: 'U_Devolucion', hide: true },
    { field: 'U_Evaluacion', hide: true },
]

const columnsWorker = [
    { field: 'TipoDocumento', headerName: 'Tipo', width: 100, headerAlign: 'center', },
    { field: 'NroDocumento', headerName: 'Documento', width: 150, headerAlign: 'center', },
    { field: 'ApellidoPaterno', headerName: 'A. Paterno', width: 150, headerAlign: 'center', },
    { field: 'ApellidoMaterno', headerName: 'A. Materno', width: 200, headerAlign: 'center', },
    { field: 'Nombres', headerName: 'Nombres', width: 150, headerAlign: 'center', },
    { field: 'id', hide: true },
]

///iniciar variable del app
const baseURL = process.env.PUBLIC_URL

const RequestRegister = () => {
    const [value, setValue] = React.useState(new Date())
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)

    const navigate = useNavigate()

    const [employee, setEmployee] = React.useState({
        IdUsuario: null,
        ApellidoPaterno: "",
        ApellidoMaterno: "",
        Nombres: "",
        TipoDocumento: "",
        NroDocumento: ""
    })
    
    const [article, setArticle] = React.useState({
        CodArticle: '',
        IdArticle: '',
        Article: '',
        IdArticuloNegocio: '',
        CodAlmacen: '',
        Almacen: '',
        U_BPP_TIPUNMED: '',
        U_Devolucion: '',
        U_Evaluacion: '',
        Grupo: ''
    })
    const [stock, setStock] = React.useState({
        codigo: '',
        cantidad: 0
    })

    const [listArticle, setListArticle] = React.useState([])
    const [openFind, setOpenFind] = React.useState(false)
    const handleOpenFind = () => {
        setOpenFind(true)
        fetch(process.env.REACT_APP_API + 'business/api/articulo/ArticulosUsuario', {
            method: 'POST',
            body: JSON.stringify({
                IdNegocio: cuenta
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
                setListArticle(response)
            })
    }
    const handleCloseFind = () => setOpenFind(false)

    const [cuentaOptions, setCuentaOptions] = React.useState([])
    const [ccosto, setCcosto] = React.useState({
        codigo_ccosto: '',
        ccosto: '',
        isValid: false
    })


    const pickUser = React.useCallback((user) => {
        setEmployee(user)
        fetch(process.env.REACT_APP_API + 'business/api/tipo_negocio/TipoNegocioUsuario', {
            method: 'POST',
            body: JSON.stringify({
                IdUsuario: user.IdUsuario
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
                setCuentaOptions(response)
            })
        fetch(process.env.REACT_APP_API + 'business/api/usuario/CostCenter', {
            method: 'POST',
            body: JSON.stringify({
                IdUsuario: user.IdUsuario
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
                response.isValid = true
                setCcosto(response)
            })
    }, [token, tokenCompany])

    const pickMyseft = React.useCallback(
        () => {
            fetch(process.env.REACT_APP_API + 'business/api/usuario/MyInfo', {
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
                        pickUser(response)
                    }
                })
        },
        [pickUser, token, tokenCompany],
    )

    React.useEffect(() => {
        pickMyseft()
    }, [pickMyseft])

    const [cuenta, setCuenta] = React.useState('-')
    const [usuarioNegocio, setUsuarioNegocio] = React.useState('')

    const handleChangeCuenta = (event) => {
        let selectValue = event.target.value
        setCuenta(selectValue)
        const selectedRowCuenta = cuentaOptions.find((row) =>
            row.IdNegocio === selectValue
        )
        let selectUsuarioNegocio = ''
        if (selectedRowCuenta) {
            if (selectedRowCuenta.UsuarioNegocios) {
                if (selectedRowCuenta.UsuarioNegocios.length > 0) {
                    selectUsuarioNegocio = selectedRowCuenta.UsuarioNegocios[0].IdUsuarioNegocio
                }
            }
        }
        setUsuarioNegocio(selectUsuarioNegocio)
    }

    const [cantidad, setCantidad] = React.useState(1)
    const handleChangeCantidad = (event) => {
        setCantidad(parseInt(event.target.value))
    }

    const [motivo, setMotivo] = React.useState('')
    const handleChangeMotivo = (event) => {
        setMotivo(event.target.value)
    }

    const handleSelectedArticle = (ids) => {
        const selectedIDs = new Set(ids)
        const selectedRowData = listArticle.find((row) =>
            selectedIDs.has(row.id)
        )
        if (selectedRowData) {
            setOpenFind(false)
            setArticle({
                IdArticuloNegocio: selectedRowData.IdArticuloNegocio,
                IdArticle: selectedRowData.IdArticulo,
                CodArticle: selectedRowData.CodArticulo,
                Article: selectedRowData.Articulo,
                CodAlmacen: selectedRowData.CodAlmacen,
                Almacen: selectedRowData.Almacen,
                U_BPP_TIPUNMED: selectedRowData.U_BPP_TIPUNMED,
                U_Devolucion: selectedRowData.U_Devolucion,
                U_Evaluacion: selectedRowData.U_Evaluacion,
                Grupo: selectedRowData.Grupo,
            })
            setStock({
                cantidad: selectedRowData.Stock,
                codigo: selectedRowData.id
            })
        }
    }

    const [listDetail, setListDetail] = React.useState([])

    const [listStock, setListStock] = React.useState([])

    const handleAddDetail = () => {
        let msg = []

        if (cantidad > stock.cantidad) {
            msg.push('La cantidad ingresada supera al stock disponible')
        }

        if (article.CodArticle === '') {
            msg.push('Debe de seleccionar un artículo')
        }

        if (cuenta === '-') {
            msg.push('Debe de seleccionar una cuenta')
        }

        const find_replay = listDetail.find(f =>
            f.IdArticulo === article.IdArticle &&
            f.IdArticuloNegocio === article.IdArticuloNegocio &&
            f.CodAlmacen === article.CodAlmacen &&
            f.IdUsuario === employee.IdUsuario
        )
        
        if (find_replay) {
            msg.push('El articulo seleccionado ya se encuentra en el listado')
        }

        if (msg.length === 0) {
            let newDetail = {
                id: uuidv4(),
                CodArticulo: article.CodArticle,
                Articulo: article.Article,
                DNI: employee.NroDocumento,
                Cantidad: cantidad,
                IdUsuario: employee.IdUsuario,
                IdArticuloNegocio: article.IdArticuloNegocio,
                CodAlmacen: article.CodAlmacen,
                Almacen: article.Almacen,
                IdNegocio: cuenta,
                IdUsuarioNegocio: usuarioNegocio,
                CCosto: ccosto.ccosto,
                CodigoCCosto: ccosto.codigo_ccosto,
                IdArticulo: article.IdArticle,
                Nombre: `${employee.ApellidoPaterno} ${employee.ApellidoMaterno} ${employee.Nombres}`,
                U_BPP_TIPUNMED: article.U_BPP_TIPUNMED,
                U_Devolucion: article.U_Devolucion,
                U_Evaluacion: article.U_Evaluacion,
                Grupo: article.Grupo,
                IdStock: stock.codigo,
            }
            setListStock(list => {
                let pre = [...list]
                let find = pre.find(f => f.codigo === stock.codigo)
                if (!find) {
                    pre.push({
                        codigo: stock.codigo,
                        cantidad: stock.cantidad,
                    })
                }
                return pre
            })
            setListDetail(list => [...list, newDetail])
            ClearDetail()
        } else {
            setOpenAlert(true)
            setStateMessage(
                {
                    message: msg.join(', '),
                    severity: 'warning'
                }
            )
        }
    }

    const ClearDetail = () => {
        setArticle({
            IdArticuloNegocio: '',
            IdArticle: '',
            CodArticle: '',
            Article: '',
            CodAlmacen: '',
            Almacen: '',
            IdUsuarioNegocio: '',
            U_BPP_TIPUNMED: '',
            U_Devolucion: '',
            U_Evaluacion: '',
        })
        setCantidad(1)
    }

    const [loading, setLoading] = React.useState(false)

    const [openDialog, setOpenDialog] = React.useState(false)

    const handleSave = () => {
        setOpenDialog(false)
        fetch(process.env.REACT_APP_API + 'business/api/solicitud_articulo', {
            method: 'POST',
            body: JSON.stringify({
                tipo: 'PEDIDO',
                fecha_propuesta: value,
                detalle: listDetail,
                motivo: motivo
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
                if (response.status === 'Ok') {
                    setOpenAlert(true)
                    setStateMessage({
                        message: 'Se insertó la solicitud correctamente',
                        severity: 'info'
                    })
                    setTimeout(() => {
                        navigate(`${baseURL}/request/info`)
                    }, 2000)
                } else {
                    setOpenAlert(true)
                    setStateMessage({
                        message: response.message,
                        severity: 'error'
                    })
                    setLoading(false)
                }
            })
    }

    const [listAlmacen, setListAlmacen] = React.useState([])

    const handleOpenDialog = () => {
        const msg = []
        if (employee.IdUsuario === null) {
            msg.push('Debe de seleccionar un usuario')
        }

        if (motivo === '') {
            msg.push('Debe de ingresar un motivo')
        }

        if (value === null) {
            msg.push('Debe de seleccionar una fecha de recojo')
        }

        if (listDetail.length < 1) {
            msg.push('Debe de seleccionar un articulo con asignación para procesar')
        }

        if (msg.length === 0) {
            const almacenes = []

            listDetail.forEach(m => {
                const find_almacen = almacenes.find(f => f === m.Almacen)
                if (!find_almacen) {
                    almacenes.push(m.Almacen)
                }
            })

            setListAlmacen(almacenes)

            setLoading(true)
            setOpenDialog(true)
        } else {
            setOpenAlert(true)
            setStateMessage({
                message: msg.join(', '),
                severity: 'error'
            })
        }
    }

    const handleCloseDialog = () => {
        setLoading(false)
        setOpenDialog(false)
    }

    const deleteDetail = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                setListDetail((prevRows) => prevRows.filter((row) => row.id !== id))
            });
        },
        [],
    )

    const columnsDetail = React.useMemo(
        () => [
            { field: 'Articulo', headerName: 'Producto', width: 350, headerAlign: 'center', },
            { field: 'CodArticulo', headerName: 'Cod. Producto', width: 150, headerAlign: 'center', },
            { field: 'Almacen', headerName: 'Almacen', width: 150, headerAlign: 'center', },
            { field: 'DNI', headerName: 'DNI', width: 100, headerAlign: 'center', },
            { field: 'Nombre', headerName: 'Nombre', width: 250, headerAlign: 'center', },
            {
                field: 'Cantidad',
                headerName: 'Cantidad',
                type: 'number',
                width: 90,
                editable: true,
                headerAlign: 'center',
            },
            { field: 'id', hide: true },
            { field: 'IdUsuario', hide: true },
            { field: 'IdArticuloNegocio', hide: true },
            { field: 'CodAlmacen', hide: true },
            { field: 'IdNegocio', hide: true },
            { field: 'IdUsuarioNegocio', hide: true },
            { field: 'CCosto', hide: true },
            { field: 'CodigoCCosto', hide: true },
            { field: 'IdArticulo', hide: true },
            { field: 'IdStock', hide: true },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={deleteDetail(params.id)}
                    />,
                ],
            },
        ],
        [deleteDetail],
    )

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

    const handleBack = () => {
        navigate(`${baseURL}/request/info`)
    }

    const [openPickWorker, setOpenPickWorker] = React.useState(false)
    const [listWorker, setListWorker] = React.useState([])
    const handleOpenPickWorker = () => {
        setOpenPickWorker(true)
        fetch(process.env.REACT_APP_API + 'business/api/grupo_trabajador', {
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
                setListWorker(response)
            })
    }
    const handleSelectedWorker = (ids) => {
        const selectedIDs = new Set(ids)
        const selectedRowData = listWorker.find((row) =>
            selectedIDs.has(row.id)
        )
        if (selectedRowData) {
            setOpenPickWorker(false)
            selectedRowData.IdUsuario = selectedRowData.id
            pickUser(selectedRowData)
        }
    }
    const handleClosePickWorker = () => setOpenPickWorker(false)

    const handlePickMyseft = () => {
        setOpenPickWorker(false)
        pickMyseft()
    }

    const handleEditCantidad = (
        params,
    ) => {
        const id = params.id
        const key = params.field
        const value = params.value
        const number = parseInt(value)

        const back = () => {
            setListDetail(previews => {
                return previews.map(element => element)
            })
        }

        const row = listDetail.find(f => f.id === id)

        if (row) {
            let msg = []
            const find_stock = listStock.find(f => f.codigo === row.IdStock)
            if (find_stock) {
                if (number > find_stock.cantidad) {
                    msg.push('La cantidad ingresada supera al stock disponible')
                }
            }

            if (msg.length > 0) {
                setStateMessage({
                    message: msg[0],
                    severity: 'error'
                })
                setOpenAlert(true)
                back()
            } else {
                setListDetail(previews => {
                    let preview = previews.find(f => f.id === id)
                    if (preview) {
                        preview[key] = number
                    }
                    return previews
                })
            }
        }
    }

    const [openCarga, setOpenCarga] = React.useState(false)

    const handleCloseCarga = () => setOpenCarga(false)

    const [uploading, setUploading] = React.useState(false)

    const handleFileUpload = (e) => {
        if (!e.target.files) {
            return
        }
        setUploading(true)
        const file = e.target.files[0]

        if (file.size > 4194304) {
            setUploading(false)
            setStateMessage({
                message: 'se excedió el límite',
                severity: 'info'
            })
            setOpenAlert(true)
            return
        }

        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setUploading(false)
            setStateMessage({
                message: 'debe de seleccionar un archivo XLSX',
                severity: 'info'
            })
            setOpenAlert(true)
            return
        }

        let data = new FormData()
        data.append('attached', file)

        fetch(process.env.REACT_APP_API + 'business/api/solicitud_articulo/loadFromFile', {
            method: 'POST',
            body: data,
            headers: {
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
                e.target.value = ""
                setUploading(false)
                setListCarga(response)
            })
    }

    const columnsCarga = [
        { field: 'CodAlmacen', headerName: 'IdAlmacen', width: 250, headerAlign: 'center', },
        { field: 'IdNegocio', headerName: 'IdNegocio', width: 250, headerAlign: 'center', },
        { field: 'Documento', headerName: 'Documento', width: 250, headerAlign: 'center', },
        { field: 'ItemCode', headerName: 'ItemCode', width: 250, headerAlign: 'center', },
        {
            field: 'Cantidad',
            headerName: 'Cantidad',
            type: 'number',
            width: 90,
            headerAlign: 'center',
        },
        { field: '__status', headerName: 'Estado', width: 250, headerAlign: 'center', },
        { field: '__message', headerName: 'Mensaje', width: 250, headerAlign: 'center', },
        { field: 'id', hide: true },
        { field: 'CodArticulo', hide: true },
        { field: 'IdUsuario', hide: true },
        { field: 'IdArticulo', hide: true },
        { field: 'Articulo', hide: true },
        { field: 'DNI', hide: true },
        { field: 'IdArticuloNegocio', hide: true },
        { field: 'Almacen', hide: true },
        { field: 'IdUsuarioNegocio', hide: true },
        { field: 'CCosto', hide: true },
        { field: 'CodigoCCosto', hide: true },
        { field: 'Nombre', hide: true },
        { field: 'U_BPP_TIPUNMED', hide: true },
        { field: 'U_Devolucion', hide: true },
        { field: 'U_Evaluacion', hide: true },
        { field: 'Grupo', hide: true },
        { field: 'IdStock', hide: true },
    ]

    const [listCarga, setListCarga] = React.useState([])

    const handleProcesar = () => {
        handleCloseCarga()
        const listProceso = listCarga.filter(f => f.__status === 'Ok')
        setListDetail(listProceso)
    }

    const handleDatos = () => {
        fetch(`${process.env.REACT_APP_API}business/api/solicitud_articulo/DataUpload`, {
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
            .catch(error => console.error('Error:', error))
            .then(response => response.blob())
            .then(blob => {
                let url = window.URL.createObjectURL(blob)
                let a = document.createElement('a')
                a.href = url
                a.download = 'datos.xlsx'
                document.body.appendChild(a)
                a.click()
                a.remove()
            })
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={8} sm={10}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Nueva Solicitud</Typography>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Grid
                    container
                    spacing={matchDownSM ? 0 : 2}
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                >
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                setListCarga([])
                                setOpenCarga(true)
                            }}
                        >
                            Cargar Excel
                        </Button>
                    </Grid>
                </Grid>
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
                                <Grid item xs={4} sm={3}>
                                    <FormControl variant="outlined" margin='normal' fullWidth>
                                        <InputLabel htmlFor="registro_DNI" size='small'>DNI:</InputLabel>
                                        <OutlinedInput
                                            id="registro_DNI"
                                            type="text"
                                            size='small'
                                            value={employee.NroDocumento}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="find to pick worker"
                                                        onClick={handleOpenPickWorker}
                                                        edge="end"
                                                    >
                                                        <SearchIcon></SearchIcon>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="DNI:"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4} sm={5}>
                                    <TextField
                                        fullWidth
                                        label="Nombre completo:"
                                        margin="normal"
                                        name="registro_Nombre"
                                        type="text"
                                        size='small'

                                        value={employee.ApellidoPaterno + ' ' + employee.ApellidoMaterno + ' ' + employee.Nombres}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={4}>
                                    <FormControl fullWidth size='small' margin='normal' >
                                        <InputLabel id="lblCuenta">Cuenta/Área</InputLabel>
                                        <Select
                                            labelId="lblCuenta"
                                            label="Cuenta/Área"
                                            size='small'
                                            onChange={handleChangeCuenta}
                                            value={cuenta}
                                        >
                                            <MenuItem value='-'>--Seleccionar--</MenuItem>
                                            {
                                                cuentaOptions.map((option) =>
                                                    <MenuItem key={option.IdNegocio} value={option.IdNegocio}>{option.Nombre}</MenuItem>
                                                )
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4} sm={3}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                        adapterLocale={localeMap["es"]}
                                    >
                                        <Stack spacing={0}>
                                            <DesktopDatePicker
                                                size='small'
                                                label="Fecha de recojo"
                                                value={value}
                                                minDate={new Date()}
                                                onChange={(newValue) => {
                                                    setValue(newValue)
                                                }}
                                                renderInput={
                                                    (params) => {
                                                        params.fullWidth = true
                                                        params.margin = "normal"
                                                        params.size = 'small'
                                                        return (
                                                            <TextField {...params} />
                                                        )
                                                    }
                                                }
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={8} sm={9}>
                                    <TextField
                                        fullWidth
                                        label="Motivo:"
                                        margin="normal"
                                        name="registro_Motivo"
                                        type="text"
                                        size='small'

                                        value={motivo}
                                        onChange={handleChangeMotivo}
                                    />
                                </Grid>
                                {
                                    ccosto.isValid &&
                                    <Grid item xs={12} >
                                        <Typography variant='h5' sx={{ color: theme.palette.secondary.main }}>
                                            CENTRO DE COSTO: {ccosto.codigo_ccosto} - {ccosto.ccosto}
                                        </Typography>
                                    </Grid>
                                }
                            </Grid>
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
                                <AddBoxOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                Nuevo Producto
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                <Grid item xs={4} sm={3}>
                                    <FormControl variant="outlined" margin='normal' fullWidth>
                                        <InputLabel htmlFor="registro_cod_prod" size='small'>Cod. de producto:</InputLabel>
                                        <OutlinedInput
                                            id="registro_cod_prod"
                                            type="text"
                                            size='small'
                                            value={article.CodArticle}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size='small'
                                                        aria-label="find to pick article"
                                                        onClick={handleOpenFind}
                                                        edge="end"
                                                    >
                                                        <SearchIcon></SearchIcon>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Cod. de producto:"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={8} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Almacen:"
                                        margin="normal"
                                        name="registro_almacen"
                                        type="text"
                                        size='small'

                                        value={article.Almacen}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Cantidad"
                                        margin="normal"
                                        name="registro_Cantidad"
                                        type="number"
                                        value={cantidad}
                                        size='small'
                                        color="primary"

                                        onChange={handleChangeCantidad}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={3}>
                                    <Typography variant='h5' sx={{ color: theme.palette.secondary.main }}>
                                        Stock disponible: {stock.cantidad}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={matchDownSM ? 0 : 2}
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="flex-end"
                            >
                                <Grid item xs={10} sm={10}>
                                    <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                                        {article.Article}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sm={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleAddDetail}
                                    >
                                        Añadir
                                    </Button>
                                </Grid>
                            </Grid>
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
                                Resumen de Productos
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <DataGridApp
                                rows={listDetail}
                                columns={columnsDetail}
                                onCellEditCommit={handleEditCantidad}
                            ></DataGridApp>
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
                        sx={{
                            marginTop: 1
                        }}
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
                    </Grid>
                </Grid>
                <MainModal
                    open={openCarga}
                    onClose={handleCloseCarga}
                    aria_labelledby="modal-find-article"
                    aria_describedby="modal-find-pick-article"
                >
                    <Typography id="modal-find-article" variant="h3" component="h2">
                        Carga de detalle
                    </Typography>
                    <DataGridApp
                        rows={listCarga}
                        columns={columnsCarga}
                        height={420}
                    ></DataGridApp>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ marginRight: "1rem" }}
                        href="../bucket/SOLICITUD_CARGA.xlsx"
                        target="_blank"
                    >
                        Plantilla
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ marginRight: "1rem" }}
                        onClick={handleDatos}
                    >
                        Datos
                    </Button>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        sx={{ marginRight: "1rem" }}
                        disabled={uploading}
                    >
                        {
                            uploading ? "Cargando" : "Cargar"
                        }
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            hidden
                        />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleProcesar}
                        disabled={uploading}
                    >
                        Procesar
                    </Button>
                </MainModal>
                <MainModal
                    open={openFind}
                    onClose={handleCloseFind}
                    aria_labelledby="modal-find-article"
                    aria_describedby="modal-find-pick-article"
                >
                    <Typography id="modal-find-article" variant="h3" component="h2">
                        SKU Inventarios
                    </Typography>
                    <DataGridApp
                        rows={listArticle}
                        columns={columns}
                        onSelectionModelChange={handleSelectedArticle}
                        height={420}
                    ></DataGridApp>
                </MainModal>
                <MainModal
                    open={openPickWorker}
                    onClose={handleClosePickWorker}
                    aria_labelledby="modal-find-worker"
                    aria_describedby="modal-find-pick-worker"
                >
                    <Typography id="modal-find-worker" variant="h3" component="h2">
                        Grupo
                    </Typography>
                    <DataGridApp
                        rows={listWorker}
                        columns={columnsWorker}
                        onSelectionModelChange={handleSelectedWorker}
                    ></DataGridApp>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePickMyseft}
                        sx={{
                            marginTop: 1
                        }}
                    >
                        Usuario Activo
                    </Button>
                </MainModal>
                <DialogMain
                    open={openDialog}
                    title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                    body={`¿Desea registrar la solicitud en el sistema?, los almacenes utilizados son los siguientes:`}
                    content={
                        listAlmacen.map(almacen =>
                            <ListItem>
                                <ListItemText
                                    primary={almacen}
                                />
                            </ListItem>
                        )
                    }
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
            </Container>
        </Grid >
    )
}

export default RequestRegister