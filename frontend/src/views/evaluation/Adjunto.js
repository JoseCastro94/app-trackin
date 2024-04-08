import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import {
    Typography,
    Button,
    List,
    ListItem,
    IconButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    CircularProgress,
    Box,
} from '@mui/material'

import { useSelector } from 'react-redux'

import MainModal from '../../ui-component/modals/MainModal.js'

import DeleteIcon from "@mui/icons-material/Delete"
import AttachFileIcon from "@mui/icons-material/AttachFile"

import { modeContext } from '../../context/modeContext'

import { gridSpacing } from '../../store/constant.js'

const AdjuntoEvaluation = React.forwardRef(({
    open = false,
    handleClose = function () { },
    handleFinishFetch = function () { },
    handleEvent = function () { },
    id = '',
    edit = '',
    disabled
}, ref) => {
    const customization = useSelector((state) => state.customization)

    const theme = useTheme()
    const [uploading, setUploading] = React.useState(false)
    const [listFile, setListFile] = React.useState([])
    const [comentario, setComentario] = React.useState('')
    const [estado, setEstado] = React.useState('-')
    const [conclusion, setConclusion] = React.useState('-')
    const [listEstado, setListEstado] = React.useState([])
    const [listConclusion, setListConclusion] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [cantidad, setCantidad] = React.useState(1)
    const [codigo, setCodigo] = React.useState('--sin asignar--')

    const { token, tokenCompany } = React.useContext(modeContext)

    const handleChangeCantidad = (event) => {
        setCantidad(parseInt(event.target.value))
    }

    const clear = () => {
        setListFile([])
        setComentario('')
        setEstado('-')
        setConclusion('-')
        setCantidad(1)
        setCodigo('--sin asignar--')
        setUploading(false)
        setLoading(false)
    }

    React.useImperativeHandle(ref, () => ({
        clear
    }))


    const loadInfo = React.useCallback(
        () => {
            setTimeout(() => {
                if (edit !== '') {
                    fetch(`${process.env.REACT_APP_API}business/api/evaluacion_articulo/Deep/${edit}`, {
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
                            setComentario(response.Comentario)
                            setCantidad(response.Cantidad)
                            setEstado(response.IdParametro)
                            setListFile(response.EvaluacionAdjuntos)
                            setConclusion(response.IdConclusion)
                            setCodigo(`REV-${response.Periodo}-${String(response.Correlativo).padStart(6, 0)}`)
                        })
                }
            })
        },
        [edit, token, tokenCompany],
    )

    React.useEffect(() => {
        if (open) {
            if (listEstado.length === 0) {
                fetch(`${process.env.REACT_APP_API}business/api/parametro/ParametroByGrupo/fa7dc607-8e72-4644-ba00-962e2df265c2`, {
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
                        setListEstado(response)
                    })
            }
            if (listConclusion.length === 0) {
                fetch(`${process.env.REACT_APP_API}business/api/parametro/ParametroByGrupo/c61f2a64-256c-436a-b85d-230db1103b18`, {
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
                        setListConclusion(response)
                    })
            }
        }
        if (open && listEstado.length > 0 && listConclusion.length > 0) {
            loadInfo()
        }
    }, [open, listEstado, listConclusion, loadInfo, token, tokenCompany])

    const handleChangeEstado = (event) => {
        let selectValue = event.target.value
        setEstado(selectValue)
    }

    const handleChangeConclusion = (event) => {
        let selectValue = event.target.value
        setConclusion(selectValue)
    }

    const handleChangeComentario = (event) => {
        setComentario(event.target.value)
    }

    const handleFileUpload = (e) => {
        if (!e.target.files) {
            return
        }
        setUploading(true)
        const file = e.target.files[0]

        if (file.size > 4194304) {
            setUploading(false)
            handleEvent()
            return
        }

        let data = new FormData()
        data.append('attached', file)

        fetch(process.env.REACT_APP_API + 'business/api/evaluacion_adjunto/file', {
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

    const handleSave = () => {
        setLoading(true)
        const post = (response) => {
            handleClose()
            handleFinishFetch()
            if (response.status === 'Ok') {
                console.log('Ok')
            } else {
                console.log(response.message)
            }
        }
        if (edit === '') {
            fetch(process.env.REACT_APP_API + 'business/api/evaluacion_articulo/ins', {
                method: 'POST',
                body: JSON.stringify({
                    comentario: comentario,
                    estado: estado,
                    codigo: id,
                    archivos: listFile,
                    cantidad: cantidad,
                    conclusion: conclusion,
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
                    post(response)
                })
        } else {
            fetch(process.env.REACT_APP_API + 'business/api/evaluacion_articulo/upd', {
                method: 'POST',
                body: JSON.stringify({
                    comentario: comentario,
                    estado: estado,
                    archivos: listFile,
                    cantidad: cantidad,
                    conclusion: conclusion,
                    id: edit
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
                    post(response)
                })
        }
    }

    const handleOpenAttached = (IdAdjunto, name) => {
        return () => {
            setLoadingDownload(true)
            fetch(`${process.env.REACT_APP_API}business/api/evaluacion_adjunto/getFile/${IdAdjunto}`, {
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
                    a.download = name
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    setLoadingDownload(false)
                })
        }
    }

    const [loadingDownload, setLoadingDownload] = React.useState(false)

    return (
        <MainModal
            open={open}
            onClose={handleClose}
            aria_labelledby="modal-find-evaluation"
            aria_describedby="modal-find-register-evaluation"
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Typography id="modal-register-evaluation" variant="h6" component="h6" >
                        {codigo}
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: 0 }}>
                    <Typography id="modal-register-evaluation" variant="h3" component="h2">
                        Evaluación Técnica
                    </Typography>
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
                {
                    listFile.length > 0 &&
                    <Grid item xs={12}>
                        <List dense={true}>
                            {
                                listFile.map((element) => (
                                    <ListItem
                                        key={element.IdAdjunto}
                                        secondaryAction={
                                            disabled &&
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={handleRemoveFile(element.IdAdjunto)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        {
                                            loadingDownload &&
                                            <CircularProgress
                                                size={49}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 6,
                                                    left: 12,
                                                    zIndex: 1,
                                                }}
                                            />
                                        }
                                        <ListItemAvatar
                                            onDoubleClick={handleOpenAttached(element.IdAdjunto, element.Nombre)}
                                        >
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
                }
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Comentario"
                        placeholder='Escribe aquí tus comentarios'
                        margin="normal"
                        name="comentario_adjunto"
                        type="text"
                        size='small'
                        value={comentario}
                        onChange={handleChangeComentario}
                        rows={2}
                        multiline
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size='small' margin='normal'>
                        <InputLabel id="lblEstado">Estado</InputLabel>
                        <Select
                            labelId="lblEstado"
                            label="Estado"
                            size='small'
                            onChange={handleChangeEstado}
                            value={estado}
                        >
                            <MenuItem value='-'>--Seleccionar--</MenuItem>
                            {
                                listEstado.map((option) =>
                                    <MenuItem key={option.IdParametro} value={option.IdParametro}>{option.Nombre}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                </Grid><Grid item xs={6}>
                    <FormControl fullWidth size='small' margin='normal'>
                        <InputLabel id="lblConclusion">Conclusión</InputLabel>
                        <Select
                            labelId="lblConclusion"
                            label="Conclusión"
                            size='small'
                            onChange={handleChangeConclusion}
                            value={conclusion}
                        >
                            <MenuItem value='-'>--Seleccionar--</MenuItem>
                            {
                                listConclusion.map((option) =>
                                    <MenuItem key={option.IdParametro} value={option.IdParametro}>{option.Nombre}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Cantidad"
                        margin="normal"
                        name="cantidad_adjunto"
                        type="number"
                        value={cantidad}
                        size='small'
                        color="primary"
                        onChange={handleChangeCantidad}
                    />
                </Grid>
                {
                    disabled &&
                    <Grid item xs={12} alignItems="center" alignSelf="center" alignContent="center" textAlign="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            Guardar
                        </Button>
                    </Grid>
                }
            </Grid>
        </MainModal>
    )
})

export default AdjuntoEvaluation