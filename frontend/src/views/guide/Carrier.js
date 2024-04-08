import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import {
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    useMediaQuery,
    OutlinedInput,
    InputAdornment,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'

import AlertApp from '../../ui-component/alerts/AlertApp.js'

import { STATUS_TIPO_DOCUMENTO } from '../../store/constant'

import { modeContext } from '../../context/modeContext'

const Carrier = React.forwardRef(({
    display_document = true,
    display_plate = true,
    IdGuia,
    info = {}
}, ref) => {
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)

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

    const [nombreConductor, setNombreConductor] = React.useState('')
    const handleNombreConductor = (event) => {
        let selectValue = event.target.value
        setNombreConductor(selectValue)
    }

    const [apellidoConductor, setApellidoConductor] = React.useState('')
    const handleApellidoConductor = (event) => {
        let selectValue = event.target.value
        setApellidoConductor(selectValue)
    }

    const [dni, setDni] = React.useState('')
    const handleDni = (event) => {
        let selectValue = event.target.value
        setDni(selectValue)
    }

    const [licenciaConductor, setLicenciaConductor] = React.useState('')
    const handleLicenciaConductor = (event) => {
        let selectValue = event.target.value
        setLicenciaConductor(selectValue)
    }

    const [placa, setPlaca] = React.useState('')
    const handlePlaca = (event) => {
        let selectValue = event.target.value
        setPlaca(selectValue)
    }

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
                    console.error('Error:', error)
                    reject(error)
                })
        })
    }, [token, tokenCompany])

    const [direccionPartida, setDireccionPartida] = React.useState('')
    const handleDireccionPartida = (event) => {
        let selectValue = event.target.value
        setDireccionPartida(selectValue)
    }

    const [departamentoPartida, setDepartamentoPartida] = React.useState('-')
    const handleDepartamentoPartida = (event) => {
        let selectValue = event.target.value
        setDepartamentoPartida(selectValue)
        buscar_provincia(selectValue)
            .then(response => {
                setProvinciaPartida('-')
                setDistritoPartida('-')
                setListProvinciaPartida(response)
            })
    }

    const [provinciaPartida, setProvinciaPartida] = React.useState('-')
    const handleProvinciaPartida = (event) => {
        let selectValue = event.target.value
        setProvinciaPartida(selectValue)
        buscar_distrito(selectValue)
            .then(response => {
                setDistritoPartida('-')
                setListDistritoPartida(response)
            })
    }

    const [distritoPartida, setDistritoPartida] = React.useState('-')
    const handleDistritoPartida = (event) => {
        let selectValue = event.target.value
        setDistritoPartida(selectValue)
    }

    const [direccionDestino, setDireccionDestino] = React.useState('')
    const handleDireccionDestino = (event) => {
        let selectValue = event.target.value
        setDireccionDestino(selectValue)
    }

    const [departamentoDestino, setDepartamentoDestino] = React.useState('-')
    const handleDepartamentoDestino = (event) => {
        let selectValue = event.target.value
        setDepartamentoDestino(selectValue)
        buscar_provincia(selectValue)
            .then(response => {
                setProvinciaDestino('-')
                setDistritoDestino('-')
                setListProvinciaDestino(response)
            })
    }

    const [provinciaDestino, setProvinciaDestino] = React.useState('-')
    const handleProvinciaDestino = (event) => {
        let selectValue = event.target.value
        setProvinciaDestino(selectValue)
        buscar_distrito(selectValue)
            .then(response => {
                setDistritoDestino('-')
                setListDistritoDestino(response)
            })
    }

    const [distritoDestino, setDistritoDestino] = React.useState('-')
    const handleDistritoDestino = (event) => {
        let selectValue = event.target.value
        setDistritoDestino(selectValue)
    }

    const [listDepartamentoPartida, setListDepartamentoPartida] = React.useState([])
    const [listProvinciaPartida, setListProvinciaPartida] = React.useState([])
    const [listDistritoPartida, setListDistritoPartida] = React.useState([])
    const [listDepartamentoDestino, setListDepartamentoDestino] = React.useState([])
    const [listProvinciaDestino, setListProvinciaDestino] = React.useState([])
    const [listDistritoDestino, setListDistritoDestino] = React.useState([])

    const handleFindDocument = () => {
        const param = {}

        if (tipoDocumento === STATUS_TIPO_DOCUMENTO.DNI) {
            param.dni = documento
        } else if (tipoDocumento === STATUS_TIPO_DOCUMENTO.RUC) {
            param.ruc = documento
        }

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
                        setRazonSocial('')
                        return new Promise((resolve, reject) => { })
                    } else {
                        return res.json()
                    }
                })
                .then(response => {
                    if (param.dni) {
                        if (response.success) {
                            setRazonSocial(response.nombre)
                            setUbigeo({
                                ubigeo: '',
                                departamento: '',
                                provincia: '',
                                distrito: '',
                                direccion: ''
                            })
                        }
                    } else if (param.ruc) {
                        if (response.success) {
                            setRazonSocial(response.nombre_o_razon_social)
                            setUbigeo({
                                ubigeo: response.ubigeo,
                                departamento: response.departamento,
                                provincia: response.provincia,
                                distrito: response.distrito,
                                direccion: response.direccion
                            })
                        }
                    } else {
                        setUbigeo({
                            ubigeo: '',
                            departamento: '',
                            provincia: '',
                            distrito: '',
                            direccion: ''
                        })
                    }
                })
                .catch(error => {
                    setRazonSocial('')
                })
        }
    }

    const [ubigeo, setUbigeo] = React.useState({
        ubigeo: '',
        departamento: '',
        provincia: '',
        distrito: '',
        direccion: ''
    })

    const getData = () => {
        const find_departamento_partida = listDepartamentoPartida.find(f => f.departamento_inei === departamentoPartida)
        const find_provincia_partida = listProvinciaPartida.find(f => f.provincia_inei === provinciaPartida)
        const find_distrito_partida = listDistritoPartida.find(f => f.ubigeo_inei === distritoPartida)

        const find_departamento_destino = listDepartamentoDestino.find(f => f.departamento_inei === departamentoDestino)
        const find_provincia_destino = listProvinciaDestino.find(f => f.provincia_inei === provinciaDestino)
        const find_distrito_destino = listDistritoDestino.find(f => f.ubigeo_inei === distritoDestino)

        const data = {
            tipoDocumento: tipoDocumento,
            documento: documento,
            razonSocial: razonSocial,
            nombreConductor: nombreConductor,
            apellidoConductor: apellidoConductor,
            dni: display_document ? dni : '',
            licenciaConductor: licenciaConductor,
            placa: display_plate ? placa : '',
            direccionPartida: direccionPartida,
            departamentoPartida: find_departamento_partida.departamento,
            provinciaPartida: find_provincia_partida.provincia,
            distritoPartida: find_distrito_partida.distrito,
            ubigeoPartido: distritoPartida,
            direccionDestino: direccionDestino,
            departamentoDestino: find_departamento_destino.departamento,
            provinciaDestino: find_provincia_destino.provincia,
            distritoDestino: find_distrito_destino.distrito,
            ubigeoDestino: distritoDestino,
            direccionProveedor: ubigeo.direccion,
            departamentoProveedor: ubigeo.departamento,
            provinciaProveedor: ubigeo.provincia,
            distritoProveedor: ubigeo.distrito,
            ubigeoProveedor: ubigeo.ubigeo,
        }

        if (tipoDocumento === STATUS_TIPO_DOCUMENTO.DNI) {
            data.direccionProveedor = data.direccionPartida
            data.departamentoProveedor = data.departamentoPartida
            data.provinciaProveedor = data.provinciaPartida
            data.distritoProveedor = data.distritoPartida
            data.ubigeoProveedor = data.ubigeoPartido
        }

        return data
    }

    const getValidate = () => {
        let msg = []
        if (tipoDocumento === '-') {
            msg.push('Debe de seleccionar un tipo de documento')
        }
        if (documento === '') {
            msg.push('Debe de ingresar un numero de documento')
        }
        if (razonSocial === '') {
            msg.push('Debe de ingresar la razón social')
        }
        if (nombreConductor === '') {
            msg.push('Debe de ingresar el nombre del conductor')
        }
        if (apellidoConductor === '') {
            msg.push('Debe de ingresar el apellido del conductor')
        }
        if (display_document) {
            if (dni === '') {
                msg.push('Debe de ingresar el documento del conductor')
            }
        }
        if (display_plate) {
            if (placa === '') {
                msg.push('Debe de ingresar la placa del conductor')
            }
        }
        if (direccionPartida === '') {
            msg.push('Debe de ingresar la dirección de partida')
        }
        if (departamentoPartida === '-') {
            msg.push('Debe de seleccionar el departamento de partida')
        }
        if (provinciaPartida === '-') {
            msg.push('Debe de seleccionar la provincia de partida')
        }
        if (distritoPartida === '-') {
            msg.push('Debe de seleccionar el distrito de partida')
        }
        if (direccionDestino === '') {
            msg.push('Debe de ingresar la dirección de destino')
        }
        if (departamentoDestino === '-') {
            msg.push('Debe de seleccionar el departamento de destino')
        }
        if (provinciaDestino === '-') {
            msg.push('Debe de seleccionar la provincia de destino')
        }
        if (distritoDestino === '-') {
            msg.push('Debe de seleccionar el distrito de destino')
        }
        return msg
    }

    React.useImperativeHandle(ref, () => ({
        getData,
        getValidate,
    }))

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
        if (!IdGuia) {
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
                    setListDepartamentoPartida(response)
                    setListDepartamentoDestino(response)
                })
                .catch(error => console.error('Error:', error))
        }
    }, [IdGuia, token, tokenCompany])

    React.useEffect(() => {
        if (IdGuia && info) {
            if (listTipoDocumento.length > 0) {
                if (info.TipoDocProv) {
                    setTipoDocumento(info.TipoDocProv)
                }
            }
        }
    }, [IdGuia, listTipoDocumento, info])

    const [selectDefault, setSelectDefault] = React.useState({
        departamentoPartida: '--Seleccionar--',
        provinciaPartida: '--Seleccionar--',
        distritoPartida: '--Seleccionar--',
        departamentoDestino: '--Seleccionar--',
        provinciaDestino: '--Seleccionar--',
        distritoDestino: '--Seleccionar--'
    })

    React.useEffect(() => {
        if (IdGuia) {
            if (info) {
                if (info.DocumentoTrans) {
                    setDocumento(info.DocumentoTrans)
                }
                if (info.RazonSocialTrans) {
                    setRazonSocial(info.RazonSocialTrans)
                }
                if (info.NombreCond) {
                    setNombreConductor(info.NombreCond)
                }
                if (info.ApellidoCond) {
                    setApellidoConductor(info.ApellidoCond)
                }
                if (info.DocumentoCond) {
                    setDni(info.DocumentoCond)
                }
                if (info.LicenciaCond) {
                    setLicenciaConductor(info.LicenciaCond)
                }
                if (info.DireccionPartida) {
                    setDireccionPartida(info.DireccionPartida)
                }
                if (info.DireccionDestino) {
                    setDireccionDestino(info.DireccionDestino)
                }
                setSelectDefault({
                    departamentoPartida: info.DepaPartida,
                    provinciaPartida: info.ProvPartida,
                    distritoPartida: info.DistPartida,
                    departamentoDestino: info.DepaDestino,
                    provinciaDestino: info.ProvDestino,
                    distritoDestino: info.DistDestino,
                })
            }
        } else {
            if (info) {
                const buscar_ubigeo = (ubigeo_inei, callback) => {
                    callback = typeof callback === 'undefined' ? () => { } : callback
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
                            callback(response)
                        })
                        .catch(error => {
                            console.error('Error:', error)
                        })
                }
                if (info.routes) {
                    if (info.routes.origin) {
                        buscar_ubigeo(info.routes.origin, (ubigeo) => {
                            setDepartamentoPartida(ubigeo.departamento_inei)
                            buscar_provincia(ubigeo.departamento_inei)
                                .then(provincias => {
                                    setListProvinciaPartida(provincias)
                                    setProvinciaPartida(ubigeo.provincia_inei)
                                    buscar_distrito(ubigeo.provincia_inei)
                                        .then(distritos => {
                                            setListDistritoPartida(distritos)
                                            setDistritoPartida(ubigeo.ubigeo_inei)
                                        })
                                })
                        })
                    }
                    if (info.routes.origin_adress) {
                        setDireccionPartida(info.routes.origin_adress)
                    }
                    if (info.routes.target) {
                        buscar_ubigeo(info.routes.target, (ubigeo) => {
                            setDepartamentoDestino(ubigeo.departamento_inei)
                            buscar_provincia(ubigeo.departamento_inei)
                                .then(provincias => {
                                    setListProvinciaDestino(provincias)
                                    setProvinciaDestino(ubigeo.provincia_inei)
                                    buscar_distrito(ubigeo.provincia_inei)
                                        .then(distritos => {
                                            setListDistritoDestino(distritos)
                                            setDistritoDestino(ubigeo.ubigeo_inei)
                                        })
                                })
                        })
                    }
                    if (info.routes.target_adress) {
                        setDireccionDestino(info.routes.target_adress)
                    }
                }
            }
        }
    }, [IdGuia, info, token, tokenCompany, buscar_provincia, buscar_distrito])


    return (
        <Grid container spacing={matchDownSM ? 0 : 2}>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblTipoDocumento" disabled={IdGuia ? true : false}>Tipo de documento:</InputLabel>
                    <Select
                        labelId="lblTipoDocumento"
                        label="Tipo de documento"
                        size='small'
                        name='TipoDocumento'
                        onChange={handleChangeTipoDocumento}
                        value={tipoDocumento}
                        disabled={IdGuia ? true : false}
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
            <Grid item xs={2} sm={2}>
                <FormControl variant="outlined" margin='normal' fullWidth>
                    <InputLabel htmlFor="txtDocumento" disabled={IdGuia ? true : false} size='small'># de Documento</InputLabel>
                    <OutlinedInput
                        id="txtDocumento"
                        type="text"
                        size='small'
                        value={documento}
                        onChange={handleDocumento}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    size='small'
                                    aria-label="toggle password visibility"
                                    edge="end"
                                    onClick={handleFindDocument}
                                    disabled={IdGuia ? true : false}
                                >
                                    <SearchIcon></SearchIcon>
                                </IconButton>
                            </InputAdornment>
                        }
                        label="# de Documento"
                        disabled={IdGuia ? true : false}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={4} sm={4}>
                <TextField
                    fullWidth
                    label="Razon Social:"
                    margin="normal"
                    name="razon_social"
                    type="text"
                    size='small'
                    value={razonSocial}
                    onChange={handleRazonSocial}
                    disabled={IdGuia ? true : false}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <TextField
                    fullWidth
                    label="Nombre del Conductor:"
                    margin="normal"
                    name="nombre_conductor"
                    type="text"
                    size='small'
                    value={nombreConductor}
                    onChange={handleNombreConductor}
                    disabled={IdGuia ? true : false}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <TextField
                    fullWidth
                    label="Apellido del Conductor:"
                    margin="normal"
                    name="apellido_conductor"
                    type="text"
                    size='small'
                    value={apellidoConductor}
                    onChange={handleApellidoConductor}
                    disabled={IdGuia ? true : false}
                />
            </Grid>
            {
                display_document &&
                <Grid item xs={2} sm={2}>
                    <TextField
                        fullWidth
                        label="DNI:"
                        margin="normal"
                        name="dni"
                        type="text"
                        size='small'
                        value={dni}
                        onChange={handleDni}
                        disabled={IdGuia ? true : false}
                    />
                </Grid>
            }
            <Grid item xs={2} sm={2}>
                <TextField
                    fullWidth
                    label="Licencia del conductor:"
                    margin="normal"
                    name="licencia"
                    type="text"
                    size='small'
                    value={licenciaConductor}
                    onChange={handleLicenciaConductor}
                    disabled={IdGuia ? true : false}
                />
            </Grid>
            {
                display_plate &&
                <Grid item xs={2} sm={2} display={display_plate}>
                    <TextField
                        fullWidth
                        label="Placa:"
                        margin="normal"
                        name="placa"
                        type="text"
                        size='small'
                        value={placa}
                        onChange={handlePlaca}
                        disabled={IdGuia ? true : false}
                    />
                </Grid>
            }
            <Grid item xs={12} sm={12}>
                <Typography variant='h4' sx={{ color: theme.palette.secondary.main }}>
                    Punto de Partida
                </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
                <TextField
                    fullWidth
                    label="Dirección:"
                    margin="normal"
                    name="direccion_partida"
                    type="text"
                    size='small'
                    value={direccionPartida}
                    onChange={handleDireccionPartida}
                    disabled={IdGuia ? true : false}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblDepartamentoPartida" disabled={IdGuia ? true : false}>Departamento:</InputLabel>
                    <Select
                        labelId="lblDepartamentoPartida"
                        label="Departamento"
                        size='small'
                        name='DepartamentoPartida'
                        onChange={handleDepartamentoPartida}
                        value={departamentoPartida}
                        disabled={IdGuia ? true : false}
                    >
                        <MenuItem value='-'>{selectDefault.departamentoPartida}</MenuItem>
                        {
                            listDepartamentoPartida.map((option) =>
                                <MenuItem key={option.departamento_inei} value={option.departamento_inei}>{option.departamento}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblProvinciaPartida" disabled={IdGuia ? true : false}>Provincia:</InputLabel>
                    <Select
                        labelId="lblProvinciaPartida"
                        label="Provincia"
                        size='small'
                        name='ProvinciaPartida'
                        onChange={handleProvinciaPartida}
                        value={provinciaPartida}
                        disabled={IdGuia ? true : false}
                    >
                        <MenuItem value='-'>{selectDefault.provinciaPartida}</MenuItem>
                        {
                            listProvinciaPartida.map((option) =>
                                <MenuItem key={option.provincia_inei} value={option.provincia_inei}>{option.provincia}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblDistritoPartida" disabled={IdGuia ? true : false}>Distrito:</InputLabel>
                    <Select
                        labelId="lblDistritoPartida"
                        label="Distrito"
                        size='small'
                        name='DistritoPartida'
                        value={distritoPartida}
                        onChange={handleDistritoPartida}
                        disabled={IdGuia ? true : false}
                    >
                        <MenuItem value='-'>{selectDefault.distritoPartida}</MenuItem>
                        {
                            listDistritoPartida.map((option) =>
                                <MenuItem key={option.ubigeo_inei} value={option.ubigeo_inei}>{option.distrito}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Typography variant='h4' sx={{ color: theme.palette.secondary.main }}>
                    Punto de Destino
                </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
                <TextField
                    fullWidth
                    label="Dirección:"
                    margin="normal"
                    name="direccion_destino"
                    type="text"
                    size='small'
                    value={direccionDestino}
                    onChange={handleDireccionDestino}
                    disabled={IdGuia ? true : false}
                />
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblDepartamentoDestino" disabled={IdGuia ? true : false}>Departamento:</InputLabel>
                    <Select
                        labelId="lblDepartamentoDestino"
                        label="Departamento"
                        size='small'
                        name='DepartamentoDestino'
                        onChange={handleDepartamentoDestino}
                        value={departamentoDestino}
                        disabled={IdGuia ? true : false}
                    >
                        <MenuItem value='-'>{selectDefault.departamentoDestino}</MenuItem>
                        {
                            listDepartamentoDestino.map((option) =>
                                <MenuItem key={option.departamento_inei} value={option.departamento_inei}>{option.departamento}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblProvinciaDestino" disabled={IdGuia ? true : false}>Provincia:</InputLabel>
                    <Select
                        labelId="lblProvinciaDestino"
                        label="Provincia"
                        size='small'
                        name='ProvinciaDestino'
                        onChange={handleProvinciaDestino}
                        value={provinciaDestino}
                        disabled={IdGuia ? true : false}
                    >
                        <MenuItem value='-'>{selectDefault.provinciaDestino}</MenuItem>
                        {
                            listProvinciaDestino.map((option) =>
                                <MenuItem key={option.provincia_inei} value={option.provincia_inei}>{option.provincia}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2} sm={2}>
                <FormControl fullWidth size='small' margin='normal'>
                    <InputLabel id="lblDistritoDestino" disabled={IdGuia ? true : false}>Distrito:</InputLabel>
                    <Select
                        labelId="lblDistritoDestino"
                        label="Distrito"
                        size='small'
                        name='DistritoDestino'
                        value={distritoDestino}
                        onChange={handleDistritoDestino}
                        disabled={IdGuia ? true : false}
                    >
                        <MenuItem value='-'>{selectDefault.distritoDestino}</MenuItem>
                        {
                            listDistritoDestino.map((option) =>
                                <MenuItem key={option.ubigeo_inei} value={option.ubigeo_inei}>{option.distrito}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
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

export default Carrier