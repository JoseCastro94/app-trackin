import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import {
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    useMediaQuery,
    TextField,
    IconButton,
    OutlinedInput,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import EmailIcon from '@mui/icons-material/Email'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'

import AlertApp from '../../ui-component/alerts/AlertApp.js'

import { modeContext } from '../../context/modeContext'

const SenderGuide = React.forwardRef(({
    show_email = false,
    evaluate_company = false,
    IdGuia,
    info = {}
}, ref) => {
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)

    const [disabled, setDisabled] = React.useState(false)

    const [tipoDocumento, setTipoDocumento] = React.useState('-')
    const handleChangeTipoDocumento = (event) => {
        let selectValue = event.target.value
        setTipoDocumento(selectValue)
    }

    const [listTipoDocumento, setListTipoDocumento] = React.useState([])

    const [documento, setDocumento] = React.useState('')

    const handleDocumento = (event) => {
        let selectValue = event.target.value
        setDocumento(selectValue)
    }

    const [razonSocial, setRazonSocial] = React.useState('')
    const handleRazonSocial = (event) => {
        let selectValue = event.target.value
        setRazonSocial(selectValue)
    }

    const [direccion, setDireccion] = React.useState('')
    const handleDireccion = (event) => {
        let selectValue = event.target.value
        setDireccion(selectValue)
    }

    const [ubigeo, setUbigeo] = React.useState('')

    const handleUbigeo = (event) => {
        let selectValue = event.target.value
        setUbigeo(selectValue)
    }

    const [urbanizacion, setUrbanizacion] = React.useState('')

    const handleUrbanizacion = (event) => {
        let selectValue = event.target.value
        setUrbanizacion(selectValue)
    }

    const buscar_ubigeo = React.useCallback((ubigeo_inei) => {
        return new Promise((resolve, reject) => {
            fetch(`${process.env.REACT_APP_API}business/api/ubigeo/getUbigeo`, {
                method: 'POST',
                body: JSON.stringify({
                    ubigeo_inei
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
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    console.error('Error:', error)
                    reject(error)
                })
        })
    }, [token, tokenCompany])

    const buscar_provincia = React.useCallback((departamento_inei) => {
        return new Promise((resolve, reject) => {
            fetch(`${process.env.REACT_APP_API}business/api/ubigeo/getProvincia`, {
                method: 'POST',
                body: JSON.stringify({
                    departamento_inei: departamento_inei
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
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    console.error('Error:', error)
                    reject(error)
                })
        })
    }, [token, tokenCompany])

    const buscar_distrito = React.useCallback((provincia_inei) => {
        return new Promise((resolve, reject) => {
            fetch(`${process.env.REACT_APP_API}business/api/ubigeo/getDistrito`, {
                method: 'POST',
                body: JSON.stringify({
                    provincia_inei: provincia_inei
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
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                    console.error('Error:', error)
                })
        })
    }, [token, tokenCompany])

    const findDocument = React.useCallback(
        (param) => {
            if (param.dni || param.ruc) {
                fetch(`${process.env.REACT_APP_API}business/api/tipo_negocio/findApi`, {
                    method: 'POST',
                    body: JSON.stringify(param),
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token,
                        'empresa': tokenCompany,
                        cache: 'no-cache',
                        pragma: 'no-cache',
                        'cache-control': 'no-cache'
                    }
                })
                    .then(res => {
                        if (res.status === 500) {
                            setStateMessage({
                                message: 'No se encontró información',
                                severity: 'error'
                            })
                            setOpenAlert(true)
                            setDireccion('')
                            setRazonSocial('')
                            return new Promise((resolve, reject) => { })
                        } else {
                            return res.json()
                        }
                    })
                    .then(response => {
                        if (param.dni) {
                            if (response.success) {
                                setDireccion('')
                                setRazonSocial(response.nombre)
                            }
                        }
                        if (param.ruc) {
                            if (response.success) {
                                setDireccion(response.direccion_simple)
                                setRazonSocial(response.nombre_o_razon_social)
                                buscar_ubigeo(response.ubigeo)
                                    .then(ubigeo => {
                                        setDepartamento(ubigeo.departamento_inei)
                                        buscar_provincia(ubigeo.departamento_inei)
                                            .then(provincias => {
                                                setListProvincia(provincias)
                                                setProvincia(ubigeo.provincia_inei)
                                                buscar_distrito(ubigeo.provincia_inei)
                                                    .then(distritos => {
                                                        setListDistrito(distritos)
                                                        setDistrito(ubigeo.ubigeo_inei)
                                                        setUbigeo(ubigeo.ubigeo_inei)
                                                    })
                                            })
                                    })
                            }
                        }
                    })
                    .catch(error => {
                        setDireccion('')
                        setRazonSocial('')
                    })
            }
        },
        [token, tokenCompany, buscar_ubigeo, buscar_provincia, buscar_distrito],
    )

    const handleFindDocument = (event) => {
        const param = {}
        if (event.documento) {
            param.ruc = event.documento
        } else {
            if (tipoDocumento === '1') {
                param.dni = documento
            } else if (tipoDocumento === '6') {
                param.ruc = documento
            }
        }
        findDocument(param)
    }

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API}business/api/parametro/ParametroByGrupo/fa7dc607-8e72-4644-ba01-962e2df275d3`, {
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
                setListTipoDocumento(response)
                setTipoDocumento('6')
            })
    }, [token, tokenCompany])

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API}business/api/ubigeo/getDepartamento`, {
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
            .then(response => {
                setListDepartamento(response)
            })
            .catch(error => console.error('Error:', error))
    }, [token, tokenCompany])

    React.useEffect(() => {
        if (evaluate_company) {
            fetch(`${process.env.REACT_APP_API}business/api/empresaparametro/getMyEmpresa`, {
                method: 'GET',
                headers: {
                    'token': token,
                    'empresa': tokenCompany,
                    cache: 'no-cache',
                    pragma: 'no-cache',
                    'cache-control': 'no-cache'
                }
            })
                .then(res => res.json())
                .then(response => {
                    if (response !== null) {
                        setDocumento(response.Ruc)
                        findDocument({
                            ruc: response.Ruc
                        })
                        setDisabled(true)
                    }
                })
                .catch(error => console.error('Error:', error))
        }
    }, [evaluate_company, findDocument, token, tokenCompany])

    React.useEffect(() => {
        if (!evaluate_company) {
            if (IdGuia) {
                setDisabled(true)
                if (info) {
                    if (info.DocumentoDest) {
                        setDocumento(info.DocumentoDest)
                    }
                    if (info.RazonSocialDest) {
                        setRazonSocial(info.RazonSocialDest)
                    }
                    if (info.DireccionDest) {
                        setDireccion(info.DireccionDest)
                    }
                    if (info.UrbaDest) {
                        setUrbanizacion(info.UrbaDest)
                    }
                    if (info.UbigeoDest) {
                        buscar_ubigeo(info.UbigeoDest)
                            .then(ubigeo => {
                                setDepartamento(ubigeo.departamento_inei)
                                buscar_provincia(ubigeo.departamento_inei)
                                    .then(provincias => {
                                        setListProvincia(provincias)
                                        setProvincia(ubigeo.provincia_inei)
                                        buscar_distrito(ubigeo.provincia_inei)
                                            .then(distritos => {
                                                setListDistrito(distritos)
                                                setDistrito(ubigeo.ubigeo_inei)
                                                setUbigeo(ubigeo.ubigeo_inei)
                                            })
                                    })
                            })
                    }
                    if (info.CorreoEmision) {
                        let lstEmail = String(info.CorreoEmision).split(';')
                        setListEmail(lstEmail)
                    }
                }
            } else {
                if (info) {
                    if (info.preaction) {
                        if (info.preaction.TipoDocumento) {
                            setTipoDocumento(info.preaction.TipoDocumento)
                        }
                        if (info.preaction.NroDocumento) {
                            setDocumento(info.preaction.NroDocumento)
                        }
                        if (info.preaction.TipoDocumento && info.preaction.NroDocumento) {
                            const param = {}
                            if (info.preaction.TipoDocumento === '1') {
                                param.dni = info.preaction.NroDocumento
                            } else if (info.preaction.TipoDocumento === '6') {
                                param.ruc = info.preaction.NroDocumento
                            }

                            findDocument(param)
                        }
                    }
                }
            }
        }
    }, [evaluate_company, IdGuia, info, buscar_distrito, buscar_provincia, buscar_ubigeo, findDocument])

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

    const [departamento, setDepartamento] = React.useState('-')
    const handleChangeDepartamento = (event) => {
        let selectValue = event.id ? event.id : event.target.value
        let callback = event.callback ? event.callback : () => { }

        setDepartamento(selectValue)
        buscar_provincia(selectValue)
            .then(response => {
                setProvincia('-')
                setDistrito('-')
                setListProvincia(response)
                callback()
            })
    }
    const [listDepartamento, setListDepartamento] = React.useState([])


    const [provincia, setProvincia] = React.useState('-')
    const handleChangeProvincia = (event) => {
        let selectValue = event.id ? event.id : event.target.value
        let callback = event.callback ? event.callback : () => { }
        setProvincia(selectValue)
        buscar_distrito(selectValue)
            .then(response => {
                setDistrito('-')
                setListDistrito(response)
                callback()
            })
    }
    const [listProvincia, setListProvincia] = React.useState([])

    const [distrito, setDistrito] = React.useState('-')
    const handleChangeDistrito = (event) => {
        let selectValue = event.id ? event.id : event.target.value
        setDistrito(selectValue)
        setUbigeo(selectValue)
    }
    const [listDistrito, setListDistrito] = React.useState([])

    const [email, setEmail] = React.useState('')
    const handleEmail = (event) => {
        let selectValue = event.target.value
        setEmail(selectValue)
    }

    const [listEmail, setListEmail] = React.useState([])
    const isValidEmail = (text) => {
        return /\S+@\S+\.\S+/.test(email)
    }
    const handleAddEmail = () => {
        if (!isValidEmail(email)) {
            setStateMessage({
                message: 'El correo no es válido',
                severity: 'error'
            })
            setOpenAlert(true)
        } else if (listEmail.length === 5) {
            setStateMessage({
                message: 'Solo se puede listar un maximo de 5 correos',
                severity: 'error'
            })
            setOpenAlert(true)
        } else {
            const findEmail = listEmail.find(f => f === email)
            if (findEmail) {
                setStateMessage({
                    message: 'El correo ya se encuentra en la lista',
                    severity: 'error'
                })
                setOpenAlert(true)
            } else {
                setListEmail(preview => {
                    let a = [...preview, String(email).trim()]
                    return a
                })
                setEmail('')
            }
        }
    }
    const handleRemoveEmail = (text) => {
        return () => {
            setListEmail(list => {
                return list.filter(f => f !== text)
            })
        }
    }

    const getData = () => {
        const find_departamento = listDepartamento.find(f => f.departamento_inei === departamento)
        const find_provincia = listProvincia.find(f => f.provincia_inei === provincia)
        const find_distrito = listDistrito.find(f => f.ubigeo_inei === distrito)
        const data = {
            tipo_documento: tipoDocumento,
            numero_documento: documento,
            razon_social: razonSocial,
            direccion: direccion,
            ubigueo: ubigeo,
            departamento: find_departamento.departamento,
            provincia: find_provincia.provincia,
            distrito: find_distrito.distrito,
            urbanizacion: urbanizacion,
            email: listEmail.join(';')
        }
        return data
    }

    const getValidate = () => {
        let msg = []
        if (tipoDocumento === '-') {
            msg.push('Debe de seleccionar un tipo de documento')
        }
        if (documento === '') {
            msg.push('Debe de ingresar el numero de documento')
        }
        if (razonSocial === '') {
            msg.push('Debe de ingresar la razon social')
        }
        if (direccion === '') {
            msg.push('Debe de ingresar la dirección')
        }
        if (ubigeo === '') {
            msg.push('Debe de ingresar el ubigeo')
        }
        if (departamento === '-') {
            msg.push('Debe de seleccionar el departamento')
        }
        if (provincia === '-') {
            msg.push('Debe de seleccionar la provincia')
        }
        if (distrito === '-') {
            msg.push('Debe de seleccionar el distrito')
        }
        if (show_email) {
            if (listEmail.length === 0) {
                msg.push('Debe de ingresar el correo')
            }
        }
        return msg
    }

    React.useImperativeHandle(ref, () => ({
        getData,
        getValidate,
    }))

    return (
        <Grid container spacing={matchDownSM ? 0 : 2}>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblTipoDocumento" disabled={disabled}>Tipo de documento:</InputLabel>
                    <Select
                        labelId="lblTipoDocumento"
                        label="Tipo de documento"
                        size='small'
                        name='TipoDocumento'
                        onChange={handleChangeTipoDocumento}
                        value={tipoDocumento}
                        disabled={disabled}
                    >
                        <MenuItem value='-'>--Seleccionar--</MenuItem>
                        {
                            listTipoDocumento.map((option) =>
                                <MenuItem key={option.Nombre} value={option.Nombre}>{option.Descripcion}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={4} sm={3}>
                <FormControl variant="outlined" margin='normal' fullWidth>
                    <InputLabel htmlFor="txtDocumento" disabled={disabled} size='small'># de Documento</InputLabel>
                    <OutlinedInput
                        id="txtDocumento"
                        type="text"
                        size='small'
                        value={documento}
                        onChange={handleDocumento}
                        disabled={disabled}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    size='small'
                                    aria-label="toggle password visibility"
                                    edge="end"
                                    onClick={handleFindDocument}
                                    disabled={disabled}
                                >
                                    <SearchIcon></SearchIcon>
                                </IconButton>
                            </InputAdornment>
                        }
                        label="# de Documento"
                    />
                </FormControl>
            </Grid>
            <Grid item xs={3} sm={3}>
                <TextField
                    fullWidth
                    label="Razón Social:"
                    margin="normal"
                    name="razon_social"
                    type="text"
                    size='small'
                    value={razonSocial}
                    onChange={handleRazonSocial}
                    disabled={disabled}
                />
            </Grid>
            <Grid item xs={4} sm={4}>
                <TextField
                    fullWidth
                    label="Dirección:"
                    margin="normal"
                    name="direccion"
                    type="text"
                    size='small'
                    value={direccion}
                    onChange={handleDireccion}
                    disabled={disabled}
                />
            </Grid>
            <Grid item xs={3} sm={3}>
                <TextField
                    fullWidth
                    label="Ubigeo:"
                    margin="normal"
                    name="ubigeo"
                    type="text"
                    size='small'
                    onChange={handleUbigeo}
                    value={ubigeo}
                    disabled={true}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblDepartamento" disabled={disabled}>Departamento:</InputLabel>
                    <Select
                        labelId="lblDepartamento"
                        label="Departamento"
                        size='small'
                        name='Departamento'
                        onChange={handleChangeDepartamento}
                        value={departamento}
                        disabled={disabled}
                    >
                        <MenuItem value='-'>--Seleccionar--</MenuItem>
                        {
                            listDepartamento.map((option) =>
                                <MenuItem key={option.departamento_inei} value={option.departamento_inei}>{option.departamento}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblProvincia" disabled={disabled}>Provincia:</InputLabel>
                    <Select
                        labelId="lblProvincia"
                        label="Provincia"
                        size='small'
                        name='Provincia'
                        onChange={handleChangeProvincia}
                        value={provincia}
                        disabled={disabled}
                    >
                        <MenuItem value='-'>--Seleccionar--</MenuItem>
                        {
                            listProvincia.map((option) =>
                                <MenuItem key={option.provincia_inei} value={option.provincia_inei}>{option.provincia}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblDistrito" disabled={disabled}>Distrito:</InputLabel>
                    <Select
                        labelId="lblDistrito"
                        label="Distrito"
                        size='small'
                        name='Distrito'
                        value={distrito}
                        onChange={handleChangeDistrito}
                        disabled={disabled}
                    >
                        <MenuItem value='-'>--Seleccionar--</MenuItem>
                        {
                            listDistrito.map((option) =>
                                <MenuItem key={option.ubigeo_inei} value={option.ubigeo_inei}>{option.distrito}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3} sm={3}>
                <TextField
                    fullWidth
                    label="Urbanización:"
                    margin="normal"
                    name="urbanizacion"
                    type="text"
                    size='small'
                    onChange={handleUrbanizacion}
                    value={urbanizacion}
                    disabled={disabled}
                />
            </Grid>
            {
                show_email && !IdGuia &&
                <Grid item xs={6} sm={6}>
                    <FormControl variant="outlined" margin='normal' fullWidth>
                        <InputLabel htmlFor="txtEmail" disabled={disabled} size='small'>Email:</InputLabel>
                        <OutlinedInput
                            id="txtEmail"
                            type="text"
                            size='small'
                            value={email}
                            onChange={handleEmail}
                            disabled={disabled}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        size='small'
                                        aria-label="add email"
                                        edge="end"
                                        disabled={disabled}
                                        onClick={handleAddEmail}
                                    >
                                        <ArrowCircleRightIcon></ArrowCircleRightIcon>
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Email:"
                        />
                    </FormControl>
                </Grid>
            }
            {
                show_email &&
                <Grid item xs={6} sm={6}>
                    <List dense={true}>
                        {
                            listEmail.map(element => (
                                <ListItem
                                    key={element}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={handleRemoveEmail(element)}
                                            disabled={IdGuia ? true : false}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                background: theme.palette.primary.main,
                                                color: theme.palette.primary.light,
                                            }}
                                        >
                                            <EmailIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={element}
                                    />
                                </ListItem>
                            ))
                        }
                    </List>
                </Grid>
            }
            <AlertApp
                open={openAlert}
                title="Registro de solicitudes"
                body={stateMessage.message}
                handleClose={handleCloseAlert}
                severity={stateMessage.severity}
            >
            </AlertApp>
        </Grid>
    )
})

export default SenderGuide