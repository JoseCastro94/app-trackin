import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import {
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Grid,
    CircularProgress,
} from '@mui/material'

import MainModal from '../../../ui-component/modals/MainModal.js'
import AttachFileIcon from "@mui/icons-material/AttachFile"

import { modeContext } from '../../../context/modeContext'

import { gridSpacing } from '../../../store/constant.js'

const AdjuntoTakeoverView = React.forwardRef(({
    title = 'Archivos adjuntos',
    open = false,
    handleClose = function () { },
    edit = '',
}, ref) => {
    const theme = useTheme()
    const [listFile, setListFile] = React.useState([])
    const { token, tokenCompany } = React.useContext(modeContext)

    const clear = () => {
        setListFile([])
    }

    React.useImperativeHandle(ref, () => ({
        clear
    }))


    const loadInfo = React.useCallback(
        () => {
            setTimeout(() => {
                if (edit !== '') {
                    fetch(`${process.env.REACT_APP_API}business/api/relevo_adjunto/files/${edit}`, {
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
                }
            })
        },
        [edit, token, tokenCompany],
    )

    React.useEffect(() => {
        if (open) {
            loadInfo()
        }
    }, [open, loadInfo])

    const handleOpenAttached = (IdAdjunto, name) => {
        return () => {
            setLoadingDownload(true)
            fetch(`${process.env.REACT_APP_API}business/api/relevo_adjunto/getFile/${IdAdjunto}`, {
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
                        {title}
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
            </Grid>
        </MainModal>
    )
})

export default AdjuntoTakeoverView