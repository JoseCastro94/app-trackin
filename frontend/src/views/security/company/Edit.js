import { useContext, useEffect, useState } from 'react'

import {
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    FormGroup,
} from '@mui/material'

import MainModal from '../../../ui-component/modals/MainModal'
import AlertApp from '../../../ui-component/alerts/AlertApp'

import { modeContext } from '../../../context/modeContext'

import { gridSpacing } from '../../../store/constant.js'

const SecurityCompanyEdit = ({
    open = false,
    IdUsuario,
    handleClose = function () { },
    handleFetch = function () { },
}) => {
    const { token, tokenCompany } = useContext(modeContext)

    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const [openAlert, setOpenAlert] = useState(false)
    const [stateMessage, setStateMessage] = useState({
        message: '',
        severity: 'info'
    })
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    const load_data = (data) => {
        setTipoDocumento(data.TipoDocumento)
        setDocumento(data.NroDocumento)
        setResponsable(data.EsResponsable)
        setNombres(data.Nombres)
        setApellidoPaterno(data.ApellidoPaterno)
        setApellidoMaterno(data.ApellidoMaterno)
        setEmail(data.Correo)
        setActivo(data.Activo)
    }

    const clear_data = () => {
        setTipoDocumento('1')
        setDocumento('')
        setResponsable(false)
        setNombres('')
        setApellidoPaterno('')
        setApellidoMaterno('')
        setEmail('')
        setActivo(true)
    }

    useEffect(() => {
        if (open) {
            setLoading(true)
            if (IdUsuario) {
                setIsEdit(true)
                fetch(`${process.env.REACT_APP_API}business/api/usuario/Usuario`, {
                    method: 'POST',
                    body: JSON.stringify({
                        IdUsuario: IdUsuario
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
                        load_data(response)
                        setLoading(false)
                    })
            } else {
                setIsEdit(false)
                clear_data()
                setLoading(false)
            }
        }
    }, [open, IdUsuario, token, tokenCompany])

    const [listTipoDocumento, setListTipoDocumento] = useState([])

    useEffect(() => {
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
            })
    }, [token, tokenCompany])

    const [tipoDocumento, setTipoDocumento] = useState('-')
    const handleChangeTipoDocumento = (event) => {
        let selectValue = event.target.value
        setTipoDocumento(selectValue)
    }

    const [documento, setDocumento] = useState('')
    const handleChangeDocumento = (event) => {
        setDocumento(event.target.value)
    }

    const [nombres, setNombres] = useState('')
    const handleChangeNombres = (event) => {
        setNombres(event.target.value)
    }

    const [apellidoPaterno, setApellidoPaterno] = useState('')
    const handleChangeApellidoPaterno = (event) => {
        setApellidoPaterno(event.target.value)
    }

    const [apellidoMaterno, setApellidoMaterno] = useState('')
    const handleChangeApellidoMaterno = (event) => {
        setApellidoMaterno(event.target.value)
    }

    const [email, setEmail] = useState('')
    const handleChangeEmail = (event) => {
        setEmail(event.target.value)
    }

    const [activo, setActivo] = useState(true)
    const handleChangeActivo = (event) => {
        setActivo(event.target.checked)
    }

    const [responsable, setResponsable] = useState(false)
    const handleChangeResponsable = (event) => {
        setResponsable(event.target.checked)
    }

    const handleSave = () => {
        setLoading(true)
        if (isEdit) {
            fetch(`${process.env.REACT_APP_API}business/api/usuario/updUsuario`, {
                method: 'POST',
                body: JSON.stringify({
                    IdUsuario,
                    nombres,
                    apellidoPaterno,
                    apellidoMaterno,
                    email,
                    activo,
                    responsable,
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
                    if (response.status === 'Ok') {
                        handleClose()
                        handleFetch()
                    } else {
                        setStateMessage({
                            severity: 'error',
                            message: response.message
                        })
                        setOpenAlert(true)
                        setLoading(false)
                    }
                })
        } else {
            const procesar_usuario = (id_usuario) => {
                fetch(`${process.env.REACT_APP_SECURITY_API}/api/external/usuario/${process.env.REACT_APP_ID_APP}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        IdUsuario: id_usuario,
                        username: documento,
                        name: `${apellidoPaterno} ${apellidoMaterno} ${nombres}`,
                        email: email,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                })
                    .then(res => res.json())
                    .then(response => {
                        if (response.status === 'OK') {
                            handleClose()
                            handleFetch()
                        } else {
                            setStateMessage({
                                severity: 'error',
                                message: response.message
                            })
                            setOpenAlert(true)
                            setLoading(false)
                        }
                    })
                    .catch(error => console.error('Error:', error))
            }

            fetch(`${process.env.REACT_APP_API}business/api/usuario/insUsuario`, {
                method: 'POST',
                body: JSON.stringify({
                    nombres,
                    apellidoPaterno,
                    apellidoMaterno,
                    email,
                    activo,
                    responsable,
                    tipoDocumento,
                    documento,
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
                    if (response.status === 'Ok') {
                        procesar_usuario(response.datos.IdUsuario)
                    } else {
                        setStateMessage({
                            severity: 'error',
                            message: response.message
                        })
                        setOpenAlert(true)
                        setLoading(false)
                    }
                })
        }
    }

    return (
        <MainModal
            open={open}
            onClose={handleClose}
            aria_labelledby="modal-find-user"
            aria_describedby="modal-find-pick-user"
        >
            <Typography id="modal-find-worker" variant="h3" component="h2">
                Mantenimiento de usuario
            </Typography>
            <Grid container spacing={gridSpacing}>
                <Grid item sm={4}>
                    <FormControl fullWidth size='small' margin='normal' disabled={isEdit}>
                        <InputLabel id="lblTipoDocumento" disabled={isEdit}>Tipo documento</InputLabel>
                        <Select
                            disabled={isEdit}
                            labelId="lblTipoDocumento"
                            label="TipoDocumento"
                            size='small'
                            onChange={handleChangeTipoDocumento}
                            value={tipoDocumento}
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
                <Grid item sm={4}>
                    <TextField
                        disabled={isEdit}
                        fullWidth
                        label="Documento:"
                        margin="normal"
                        name="documento"
                        type="text"
                        size='small'
                        value={documento}
                        onChange={handleChangeDocumento}
                    />
                </Grid>
                <Grid item sm={4}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={responsable}
                                    onChange={handleChangeResponsable}
                                />
                            }
                            label="Responsable"
                        />
                    </FormGroup>
                </Grid>
                <Grid item sm={4}>
                    <TextField
                        fullWidth
                        label="Nombres:"
                        margin="normal"
                        name="nombres"
                        type="text"
                        size='small'
                        value={nombres}
                        onChange={handleChangeNombres}
                    />
                </Grid>
                <Grid item sm={4}>
                    <TextField
                        fullWidth
                        label="Apellido paterno:"
                        margin="normal"
                        name="apellido_paterno"
                        type="text"
                        size='small'
                        value={apellidoPaterno}
                        onChange={handleChangeApellidoPaterno}
                    />
                </Grid>
                <Grid item sm={4}>
                    <TextField
                        fullWidth
                        label="Apellido materno:"
                        margin="normal"
                        name="apellido_materno"
                        type="text"
                        size='small'
                        value={apellidoMaterno}
                        onChange={handleChangeApellidoMaterno}
                    />
                </Grid>
                <Grid item sm={4}>
                    <TextField
                        fullWidth
                        label="Correo:"
                        margin="normal"
                        name="correo"
                        type="email"
                        size='small'
                        value={email}
                        onChange={handleChangeEmail}
                    />
                </Grid>
                <Grid item sm={4}>
                    <FormGroup>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={activo}
                                        onChange={handleChangeActivo}
                                    />
                                }
                                label="Activo"
                            />
                        </FormGroup>
                    </FormGroup>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handleSave}
                sx={{
                    marginTop: 1
                }}
            >
                Grabar
            </Button>
            <AlertApp
                open={openAlert}
                title="Registro de solicitudes"
                body={stateMessage.message}
                handleClose={handleCloseAlert}
                severity={stateMessage.severity}
            >
            </AlertApp>
        </MainModal>
    )
}

export default SecurityCompanyEdit