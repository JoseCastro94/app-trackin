import {Avatar, Button, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material'
import {
    descargarArchivoAdjunto,
    eliminarArchivoAdjunto,
    listarArchivosAdjuntos,
    subirArchivoAdjunto
} from "../../services/ArchivoAdjunto";
import MainModal from '../../ui-component/modals/MainModal.js'
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import {gridSpacing} from "../../store/constant";
import {useTheme} from "@mui/material/styles";
import PropTypes from 'prop-types'
import * as React from 'react'
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {saveFileAs, validarFile} from "../utilities/Util";
import {useRef} from "react";
import {Download} from "@mui/icons-material";
import { modeContext } from '../../context/modeContext'

const ModalArchivos = ({
    open = false,
    handleClose = () => { },
    onError = () => { },
    idModulo = '',
    modulo = '',
    title = 'Archivos Adjuntos',
    upload= true,
    remove = true,
    download = !remove
}) => {
    const theme = useTheme()
    const inputFile = useRef(null)
    const [uploading, setUploading] = React.useState(false)
    const [list, setList] = React.useState([])
    const { token, tokenCompany } = React.useContext(modeContext)

    const loadModal = React.useCallback(async () => {
        setList([])
        const data = await listarArchivosAdjuntos(modulo, idModulo, token, tokenCompany)
        setList(data)
    }, [modulo, idModulo, token, tokenCompany])

    React.useEffect(() => {
        if (open) {
            loadModal()
        }
    }, [open, loadModal, token, tokenCompany])

    const handleRemoveFile = async (id) => {
        const response = await eliminarArchivoAdjunto(id, token, tokenCompany)
        if (response.success) {
            const newList = list.filter(item => item.IdArchivo !== id)
            setList(newList)
        }
    }

    const handleDownloadFile = async (id, name) => {
        const blob = await descargarArchivoAdjunto(id, token, tokenCompany)
        saveFileAs(blob, name)
    }

    const handleSaveFile = async (event) => {
        setUploading(true)
        const file = validarFile(event)
        if (!file.status) {
            onError(file)
        } else {
            let formData = file.data
            formData.append('modulo', modulo)
            formData.append('idModulo', idModulo)
            const response = await subirArchivoAdjunto(formData, token, tokenCompany)
            if (response.success) {
                const data = [...list, response.data]
                setList(data)
            } else {
                onError(response)
            }
        }

        setUploading(false)
        inputFile.current.value = ''
    }

    return (
        <MainModal
            open={open}
            onClose={handleClose}
            aria_labelledby="modal-upload-files"
            aria_describedby="modal-upload-files-by-module"
        >
            <Typography id="modal-find-article" variant="h3" component="span">
                {title}
            </Typography>
            {upload ? <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ marginRight: "1rem", right: "0px", position: "absolute" }}
                disabled={uploading}
            >
                { uploading ? "Cargando..." : "Seleccionar archivo" }
                <input
                    type="file"
                    onChange={handleSaveFile}
                    hidden
                    ref={inputFile}
                />
            </Button> : ''}
            <Grid container spacing={gridSpacing} sx={{height: 400, overflowY: "auto", marginTop: "15px"}}>
                <Grid item xs={12} md={12}>
                    <List dense={true}>
                        {
                            list.map((element) => (
                                <ListItem
                                    key={element.IdArchivo}
                                    secondaryAction={
                                        download ?
                                            <IconButton
                                                edge="end"
                                                aria-label="download"
                                                onClick={() => handleDownloadFile(element.IdArchivo, element.Nombre)}
                                            >
                                                <Download />
                                            </IconButton>
                                            :
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveFile(element.IdArchivo)}
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
            </Grid>
        </MainModal>
    )
}

ModalArchivos.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func
}

export default ModalArchivos
