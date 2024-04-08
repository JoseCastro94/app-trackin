import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import { gridSpacing } from '../../store/constant'

import {
    Grid,
    Typography,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton,
    Button,
    useMediaQuery,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    OutlinedInput,
    InputAdornment,
} from '@mui/material'

import {
    useNavigate
} from "react-router-dom"

import { useSelector } from 'react-redux'

import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import AttachFileIcon from '@mui/icons-material/AttachFile'

import PickArticle from '../shared/article/PickArticle.js'

import DialogMain from '../../ui-component/alerts/DialogMain.js'

import PickSerie from '../shared/serie/PickSerie.js'

import { modeContext } from '../../context/modeContext'
import { Box } from '@mui/system'

const baseURL = process.env.PUBLIC_URL

const IncidentRegister = () => {
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)
    const navigate = useNavigate()
    const customization = useSelector((state) => state.customization)

    const urlParams = new URLSearchParams(window.location.search)
    const [getParams] = React.useState({
        IdAlmacen: urlParams.get('IdAlmacen'),
        IdNegocio: urlParams.get('IdNegocio'),
        IdArticulo: urlParams.get('IdArticulo'),
        Id: urlParams.get('Id'),
        Back: urlParams.get('Back'),
    })

    const handleBack = () => {
        if (getParams.Back) {
            navigate(`${baseURL}/warehouse/takeover/register/${getParams.Back}`)
        } else {
            navigate(`${baseURL}/incident/home`)
        }
    }

    const [loading, setLoading] = React.useState(false)

    const [openDialog, setOpenDialog] = React.useState(false)

    const handleOpenDialog = () => {
        const val = []

        if (article.CodArticle === '') {
            val.push('Debe de seleccionar un artículo')
        }

        if (contable === false && serie.IdControlSerie === null) {
            val.push('Debe de seleccionar una serie')
        }

        if (cuenta === '-') {
            val.push('Debe de seleccionar una cuenta')
        }

        if (incidente === '-') {
            val.push('Debe de seleccionar un incidente')
        }

        if (tipo === '-') {
            val.push('Debe de seleccionar un tipo de incidente')
        }

        if (val.length === 0) {
            setLoading(true)
            setOpenDialog(true)
        } else {
            setAlert({
                message: val.join(', '),
                severity: 'error'
            })
            setOpenAlert(true)
        }
    }

    const handleCloseDialog = () => {
        setLoading(false)
        setOpenDialog(false)
    }

    const [disabledCuenta, setDisabledCuenta] = React.useState(false)
    const [cuenta, setCuenta] = React.useState('-')
    const [cuentaOptions, setCuentaOptions] = React.useState([])

    const [disabledAlmacen, setDisabledAlmacen] = React.useState(false)
    const [almacen, setAlmacen] = React.useState('-')
    const [almacenes, setAlmacenes] = React.useState([])

    const [disabledArticle, setDisabledArticle] = React.useState(false)
    const [article, setArticle] = React.useState({
        CodArticle: '',
        IdArticle: '',
        Article: '',
        IdArticuloNegocio: '',
        IdAlmacen: '',
        IdNegocio: '',
        Almacen: '',
        U_BPP_TIPUNMED: '',
        U_Devolucion: '',
        U_Evaluacion: '',
        Grupo: '',
        TieneSerie: 0
    })

    const [cantidad, setCantidad] = React.useState(1)
    const handleChangeCantidad = (event) => {
        setCantidad(parseInt(event.target.value))
    }

    const [comentario, setComentario] = React.useState('')
    const handleChangeComentario = (event) => {
        setComentario(event.target.value)
    }

    const [incidente, setIncidente] = React.useState('-')

    const [tipo, setTipo] = React.useState('-')

    const [listIncidente, setListIncidente] = React.useState([])

    const [listTipo, setListTipo] = React.useState([])

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API}business/api/almacen/getAlmacenEmpresa`, {
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
                setAlmacenes(response)
                if (getParams.IdAlmacen) {
                    setDisabledAlmacen(true)
                    setAlmacen(getParams.IdAlmacen)
                }
            })
    }, [getParams, token, tokenCompany])

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API}business/api/tipo_negocio/getTipoNegocio`, {
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
                setCuentaOptions(response)
                if (getParams.IdNegocio) {
                    setDisabledCuenta(true)
                    setCuenta(getParams.IdNegocio)
                }
            })
    }, [getParams, token, tokenCompany])

    React.useEffect(() => {
        if (getParams.IdArticulo && cuenta !== '-' && almacen !== '-') {
            fetch(`${process.env.REACT_APP_API}business/api/articulo/getArticle`, {
                method: 'POST',
                body: JSON.stringify({
                    IdNegocio: cuenta,
                    IdAlmacen: almacen,
                    IdArticulo: getParams.IdArticulo
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
                        setDisabledArticle(true)
                        handleSelectedArticle(response)
                    }
                })
        }
    }, [getParams, almacen, cuenta, token, tokenCompany])

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API}business/api/parametro/ParametroByGrupo/fa7dc607-8e72-4644-ba00-962e2df265d1`, {
            method: 'POST',
            body: JSON.stringify({
                Valor1: 'INCIDENTE'
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
                setListIncidente(response)
            })

        fetch(`${process.env.REACT_APP_API}business/api/parametro/ParametroByGrupo/0628088b-6992-4029-b86c-6e8690ce5e45`, {
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
                setListTipo(response)
            })
    }, [token, tokenCompany])

    const handleChangeAlmacen = (event) => {
        let selectValue = event.target.value
        setAlmacen(selectValue)
    }

    const handleChangeCuenta = (event) => {
        let selectValue = event.target.value
        setCuenta(selectValue)
    }

    const handleChangeIncidente = (event) => {
        let selectValue = event.target.value
        setIncidente(selectValue)
    }

    const handleChangeTipo = (event) => {
        let selectValue = event.target.value
        setTipo(selectValue)
    }

    const [openFind, setOpenFind] = React.useState(false)

    const handleOpenFind = (action) => {
        if (almacen !== '-' && cuenta !== '-') {
            setOpenFind(action)
        }
    }

    const [openAlert, setOpenAlert] = React.useState(false)
    const [alert, setAlert] = React.useState({
        message: '',
        severity: 'info'
    })
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    const handleSelectedArticle = (article) => {
        setArticle({
            IdArticuloNegocio: article.IdArticuloNegocio,
            IdArticle: article.IdArticulo,
            CodArticle: article.CodArticulo,
            Article: article.Articulo,
            IdAlmacen: article.CodAlmacen,
            Almacen: article.Almacen,
            IdNegocio: article.IdNegocio,
            U_BPP_TIPUNMED: article.U_BPP_TIPUNMED,
            U_Devolucion: article.U_Devolucion,
            U_Evaluacion: article.U_Evaluacion,
            Grupo: article.Grupo,
            TieneSerie: article.TieneSerie
        })
        setContable(article.TieneSerie !== 1)
        setCantidad(1)
        setSerie({
            IdControlSerie: null,
            SerialNumber: '',
        })
    }

    const handleSave = () => {
        setOpenDialog(false)
        fetch(process.env.REACT_APP_API + 'business/api/incidencias/ins', {
            method: 'POST',
            body: JSON.stringify({
                IdAlmacen: article.IdAlmacen,
                IdNegocio: article.IdNegocio,
                IdArticulo: article.IdArticle,
                Cantidad: cantidad,
                Comentario: comentario,
                IdParametro: incidente,
                IdTipo: tipo,
                Adjuntos: listFile,
                U_BPP_TIPUNMED: article.U_BPP_TIPUNMED,
                U_Devolucion: article.U_Devolucion,
                U_Evaluacion: article.U_Evaluacion,
                Grupo: article.Grupo,
                ItemCode: article.CodArticle,
                ItemName: article.Article,
                serie: serie,
                IdDetalleRelevoAlmacen: getParams.Id
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
                    setAlert({
                        message: response.message,
                        severity: 'info'
                    })
                    setOpenAlert(true)
                    setTimeout(() => {
                        if (getParams.Back) {
                            navigate(`${baseURL}/warehouse/takeover/register/${getParams.Back}`)
                        } else {
                            navigate(`${baseURL}/incident/home`)
                        }
                    }, 2000)
                } else {
                    setAlert({
                        message: response.message,
                        severity: 'error'
                    })
                    setOpenAlert(true)
                    setLoading(false)
                }
            })
    }

    const [listFile, setListFile] = React.useState([])

    const [uploading, setUploading] = React.useState(false)

    const handleFileUpload = (e) => {
        if (!e.target.files) {
            return
        }
        setUploading(true)
        const file = e.target.files[0]

        if (file.size > 4194304) {
            setUploading(false)
            setAlert({
                message: 'se excedió el límite',
                severity: 'info'
            })
            setOpenAlert(true)
            return
        }

        let data = new FormData()
        data.append('attached', file)

        fetch(process.env.REACT_APP_API + 'business/api/incidente_adjunto/file', {
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
                console.log(response)
                setListFile(list => [...list, response])
            })
    }

    const handleRemoveFile = (IdAdjunto) => {
        return () => {
            setListFile(list => {
                return list.filter(f => f.IdAdjunto !== IdAdjunto)
            })
        }
    }

    const [contable, setContable] = React.useState(true)
    const [serie, setSerie] = React.useState({
        IdControlSerie: null,
        SerialNumber: '',
    })

    const [openSerie, setOpenSerie] = React.useState(false)

    const handleOpenSerie = (action) => {
        setOpenSerie(action)
    }

    const handleSelectedSerie = (pick_serie) => {
        setSerie({
            IdControlSerie: pick_serie.id,
            SerialNumber: pick_serie.SerialNumber
        })
    }

    return (
        <Container fixed>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Registro de incidencias en almacén</Typography>
                </Grid>
                <Grid item xs={4} sm={3}>
                    <FormControl fullWidth size='small' margin='normal'>
                        <InputLabel id="lblAlmacen" disabled={disabledAlmacen}>Almacen</InputLabel>
                        <Select
                            labelId="lblAlmacen"
                            label="Almacen"
                            size='small'
                            onChange={handleChangeAlmacen}
                            value={almacen}
                            disabled={disabledAlmacen}
                        >
                            <MenuItem value='-'>--Seleccionar--</MenuItem>
                            {
                                almacenes.map((option) =>
                                    <MenuItem key={option.IdAlmacen} value={option.IdAlmacen}>{option.Nombre}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={3}>
                    <FormControl fullWidth size='small' margin='normal'>
                        <InputLabel id="lblCuenta" disabled={disabledCuenta}>Cuenta/Área</InputLabel>
                        <Select
                            labelId="lblCuenta"
                            label="Cuenta/Área"
                            size='small'
                            onChange={handleChangeCuenta}
                            value={cuenta}
                            disabled={disabledCuenta}
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
                <Grid item xs={4} sm={2}>
                    <FormControl variant="outlined" margin='normal' fullWidth>
                        <InputLabel htmlFor="txtCodArticulo" disabled={disabledArticle} size='small'>Cod. de producto</InputLabel>
                        <OutlinedInput
                            id="txtCodArticulo"
                            type="text"
                            size='small'
                            value={article.CodArticle}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        size='small'
                                        aria-label="toggle password visibility"
                                        onClick={() => { handleOpenFind(true) }}
                                        edge="end"
                                        disabled={disabledArticle}
                                    >
                                        <SearchIcon></SearchIcon>
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Cod. de producto:"
                            disabled={disabledArticle}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <TextField
                        fullWidth
                        label="Descripción:"
                        margin="normal"
                        name="registro_articulo"
                        type="text"
                        size='small'
                        value={article.Article}
                        disabled={disabledArticle}
                    />
                </Grid>
                {
                    contable ?
                        <Grid item xs={4} sm={4}>
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
                        </Grid> :
                        <Grid item xs={4} sm={4}>
                            <FormControl variant="outlined" margin='normal' fullWidth>
                                <InputLabel htmlFor="txtSerie">Serie</InputLabel>
                                <OutlinedInput
                                    id="txtSerie"
                                    type="text"
                                    size='small'
                                    value={serie.SerialNumber}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => { handleOpenSerie(true) }}
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
                }
                <Grid item xs={4} sm={4}>
                    <FormControl fullWidth size='small' margin='normal'>
                        <InputLabel id="lblIncidente">Incidente</InputLabel>
                        <Select
                            labelId="lblIncidente"
                            label="Incidente"
                            size='small'
                            onChange={handleChangeIncidente}
                            value={incidente}
                        >
                            <MenuItem value='-'>--Seleccionar--</MenuItem>
                            {
                                listIncidente.map((option) =>
                                    <MenuItem key={option.IdParametro} value={option.IdParametro}>{option.Nombre}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <FormControl fullWidth size='small' margin='normal'>
                        <InputLabel id="lblTipo">Tipo</InputLabel>
                        <Select
                            labelId="lblTipo"
                            label="Tipo"
                            size='small'
                            onChange={handleChangeTipo}
                            value={tipo}
                        >
                            <MenuItem value='-'>--Seleccionar--</MenuItem>
                            {
                                listTipo.map((option) =>
                                    <MenuItem key={option.IdParametro} value={option.IdParametro}>{option.Nombre}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        fullWidth
                        label="Comentario:"
                        margin="normal"
                        name="registro_comentario"
                        type="text"
                        size='small'
                        value={comentario}
                        onChange={handleChangeComentario}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{
                        backgroundColor: theme.palette.grey[200],
                        padding: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: `${customization.borderRadius}px`,
                        border: 'dashed 1px'
                    }}>
                        <Button
                            variant="contained"
                            color="info"
                            component="label"
                            disabled={uploading}
                        >
                            {
                                uploading ? "Cargando" : "Seleccionar archivo"
                            }
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                hidden
                            />
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                    <List dense={true}>
                        {
                            listFile.map((element) => (
                                <ListItem
                                    key={element.IdAdjunto}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={handleRemoveFile(element.IdAdjunto)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.primary[800],
                                                color: '#fff'
                                            }}
                                        >
                                            <AttachFileIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={element.Nombre}
                                        secondary={element.Mime}
                                    />
                                </ListItem>
                            ))
                        }
                    </List>
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
                <PickArticle
                    open={openFind}
                    reload={true}
                    handleClose={() => { handleOpenFind(false) }}
                    handleSelectedArticle={handleSelectedArticle}
                    url={process.env.REACT_APP_API + 'business/api/articulo/getArticles'}
                    param={{
                        IdNegocio: cuenta,
                        IdAlmacen: almacen
                    }}
                    columns={[
                        { field: 'Articulo', headerName: 'Producto', width: 400 },
                        { field: 'CodArticulo', headerName: 'Cod. Producto', width: 200 },
                        { field: 'Almacen', headerName: 'Almacen', width: 150 },
                        { field: 'Categoria', headerName: 'Categoria', width: 150 },
                        {
                            field: 'Stock',
                            headerName: 'Stock',
                            type: 'number',
                            width: 90,
                        },
                        { field: 'id', hide: true },
                        { field: 'CodAlmacen', hide: true },
                        { field: 'IdArticulo', hide: true },
                        { field: 'TieneSerie', hide: true },
                        { field: 'IdAlmacen', hide: true },
                        { field: 'IdNegocio', hide: true },
                    ]}
                >
                </PickArticle>
                <PickSerie
                    open={openSerie}
                    handleClose={() => { handleOpenSerie(false) }}
                    handleSelectedArticle={handleSelectedSerie}
                    url={process.env.REACT_APP_API + 'business/api/control_series/ListByArticle'}
                    param={{
                        IdNegocio: cuenta,
                        IdAlmacen: article.IdAlmacen,
                        IdArticulo: article.IdArticle,
                    }}
                >
                </PickSerie>
                <DialogMain
                    open={openDialog}
                    title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                    body='¿Desea registrar la incidencia en almacén en el sistema?'
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
        </Container>
    )
}

export default IncidentRegister