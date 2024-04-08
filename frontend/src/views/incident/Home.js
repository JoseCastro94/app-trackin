import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import { gridSpacing } from '../../store/constant'

import {
    useNavigate
} from "react-router-dom"

import {
    Grid,
    Typography,
    Container,
    Button,
    useMediaQuery,
    List,
    ListItem,
    IconButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    CircularProgress,
} from '@mui/material'

import FilePresentIcon from '@mui/icons-material/FilePresent'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DownloadIcon from '@mui/icons-material/Download'

import { GridActionsCellItem } from '@mui/x-data-grid'

import MainModal from '../../ui-component/modals/MainModal.js'

import DataGridApp from '../../ui-component/grid/DataGridApp.js'

import { modeContext } from '../../context/modeContext'

const baseURL = process.env.PUBLIC_URL

const IncidentHome = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)

    const viewAttached = React.useCallback(
        (id) => () => {
            setTimeout(() => {

                fetch(`${process.env.REACT_APP_API}business/api/incidente_adjunto/files/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token,
                        'empresa': tokenCompany
                    }
                })
                    .then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => {
                        setOpenPick(true)
                        setListFile(response)
                    })
            })
        },
        [token, tokenCompany],
    )

    const columns = React.useMemo(
        () => [
            { field: 'Codigo', headerName: '# Incidente', width: 150, headerAlign: 'center', },
            { field: 'NomArticulo', headerName: 'Articulo', width: 400, headerAlign: 'center', },
            { field: 'CodArticulo', headerName: 'Cod. articulo', width: 200, headerAlign: 'center', },
            { field: 'Categoria', headerName: 'Categoria', width: 150, headerAlign: 'center', },
            { field: 'Negocio', headerName: 'Cuenta', width: 150, headerAlign: 'center', },
            { field: 'Almacen', headerName: 'Almacen', width: 150, headerAlign: 'center', },
            { field: 'Cantidad', headerName: 'Cant.', width: 80, editable: true, headerAlign: 'center', },
            { field: 'FechaCreacion', headerName: 'Fecha', width: 100, type: 'date', headerAlign: 'center', },
            { field: 'Incidente', headerName: 'Incidente', width: 200, headerAlign: 'center', },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    return [
                        <GridActionsCellItem
                            icon={<FilePresentIcon />}
                            label="Ver adjuntos"
                            onClick={viewAttached(params.id)}
                        />
                    ]
                },
            },
            { field: 'id', hide: true },
        ],
        [viewAttached],
    )

    const handleAddIncident = () => {
        navigate(`${baseURL}/incident/register`)
    }

    const [list, setList] = React.useState([])

    React.useEffect(() => {
        fetch(process.env.REACT_APP_API + 'business/api/incidencias/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'empresa': tokenCompany
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                response.forEach(element => {
                    element.FechaCreacion = new Date(element.FechaCreacion)
                    element.Codigo = `INC-${element.Periodo}-${String(element.Correlativo).padStart(6, 0)}`
                })
                setList(response)
            })
    }, [token, tokenCompany])

    const [openPick, setOpenPick] = React.useState(false)
    const handleClosePick = () => setOpenPick(false)

    const [listFile, setListFile] = React.useState([])

    const handleOpenAttached = (IdAdjunto, name) => {
        return () => {
            setLoadingDownload(true)
            fetch(`${process.env.REACT_APP_API}business/api/incidente_adjunto/getFile/${IdAdjunto}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'empresa': tokenCompany
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
        <Container fixed>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={8} sm={10}>
                    <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Incidencias en almacén</Typography>
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
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleAddIncident}
                            >
                                Nuevo incidente
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Historia</Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <DataGridApp
                        rows={list}
                        columns={columns}
                    />
                </Grid>
                <MainModal
                    open={openPick}
                    onClose={handleClosePick}
                    aria_labelledby="modal-find-article"
                    aria_describedby="modal-find-pick-article"
                >
                    <Typography id="modal-find-article" variant="h3" component="h2">
                        Listado de adjuntos
                    </Typography>
                    <List dense={true}>
                        {
                            listFile.map((element) => (
                                <ListItem
                                    key={element.IdAdjunto}
                                    secondaryAction={
                                        <>
                                            {
                                                loadingDownload &&
                                                <CircularProgress
                                                    size={49}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -3,
                                                        left: -4,
                                                        zIndex: 1,
                                                    }}
                                                />
                                            }
                                            <IconButton
                                                edge="end"
                                                aria-label="download"
                                                onDoubleClick={handleOpenAttached(element.IdAdjunto, element.Nombre)}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </>
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
                </MainModal>
            </Grid>
        </Container>
    )
}

export default IncidentHome