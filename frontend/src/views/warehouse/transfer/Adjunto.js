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
    Grid,
    CircularProgress,
    Box,
} from '@mui/material'

import { useSelector } from 'react-redux'

import MainModal from '../../../ui-component/modals/MainModal.js'

import DeleteIcon from "@mui/icons-material/Delete"
import AttachFileIcon from "@mui/icons-material/AttachFile"

import { modeContext } from '../../../context/modeContext'

import { gridSpacing } from '../../../store/constant.js'

const AdjuntoTransfer = React.forwardRef(({
    codigo = '--sin asignar--',
    open = false,
    handleClose = function () { },
    handleEvent = function () { },
    edit = '',
}, ref) => {
    const customization = useSelector((state) => state.customization)
    const theme = useTheme()
    const { token, tokenCompany } = React.useContext(modeContext)
    const [uploading, setUploading] = React.useState(false)
    const [listFile, setListFile] = React.useState([])

    const clear = () => {
        setListFile([])
    }

    React.useImperativeHandle(ref, () => ({
        clear
    }))


    const loadInfo = React.useCallback(
        () => {
            setTimeout(() => {
                fetch(`${process.env.REACT_APP_API}business/api/transferencia_adjuntos/files/${edit}`, {
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
                        setListFile(response)
                    })
            })
        },
        [edit, token, tokenCompany],
    )

    React.useEffect(() => {
        if (open) {
            loadInfo()
        }
    }, [open, loadInfo])

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

        fetch(process.env.REACT_APP_API + 'business/api/transferencia_adjuntos/file/' + edit, {
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
                setListFile(list => [...list, response])
            })
    }

    const handleRemoveFile = (IdAdjunto) => {
        return () => {
            fetch(`${process.env.REACT_APP_API}business/api/transferencia_adjuntos/delFile/${IdAdjunto}`, {
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
            setListFile(list => {
                return list.filter(f => f.IdAdjunto !== IdAdjunto)
            })
        }
    }

    const handleOpenAttached = (IdAdjunto, name) => {
        return () => {
            setLoadingDownload(true)
            fetch(`${process.env.REACT_APP_API}business/api/transferencia_adjuntos/getFile/${IdAdjunto}`, {
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
                        Adjunto de transferencia
                    </Typography>
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
            </Grid>
        </MainModal>
    )
})

export default AdjuntoTransfer