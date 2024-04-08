import * as React from 'react'

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { gridSpacing } from '../../../store/constant'
// import {useNavigate} from 'react-router-dom'
import Divider from '@mui/material/Divider/Divider';

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
import MainModal from '../../../ui-component/modals/MainModal.js'
import DataGridApp from '../../../ui-component/grid/DataGridApp'
// import { modeContext } from '../../../context/modeContext'



const PickingEntrega = () => {
    const theme = useTheme();

    const [list, setList] = React.useState([])
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))


    const columns = React.useMemo(
        () => [
            { field: 'Codigo', headerName: '# Solicitud', width: 150, headerAlign: 'center', },
            { field: 'NomArticulo', headerName: 'Cuenta', width: 400, headerAlign: 'center', },
            { field: 'CodArticulo', headerName: 'P. Asignada', width: 200, headerAlign: 'center', },
            { field: 'Categoria', headerName: 'Estado', width: 150, headerAlign: 'center', },
            { field: 'Negocio', headerName: 'Fecha de solicitud', width: 150, headerAlign: 'center', },
            { field: 'Almacen', headerName: 'Almacen', width: 150, headerAlign: 'center', },
            { field: 'Cantidad', headerName: 'Fecha de entrega', width: 80, editable: true, headerAlign: 'center', },
            { field: 'FechaCreacion', headerName: 'Horario', width: 100, type: 'date', headerAlign: 'center', },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    return [
                        <GridActionsCellItem
                            icon={<FilePresentIcon />}
                            label="Ver adjuntos"
                        // onClick={viewAttached(params.id)}
                        />
                    ]
                },
            },
            { field: 'id', hide: true },
        ],
        // [viewAttached],
    )

    // const handleAddIncident = () => {
    //     navigate(`${baseURL}/incident/register`)
    // }
    const [openPick, setOpenPick] = React.useState(false)
    const handleClosePick = () => setOpenPick(false)
    const [listFile, setListFile] = React.useState([])


    return (
        <Container fixed>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={4} sm={10}>
                    <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Picking y Entrega</Typography>
                </Grid>
                <Grid item xs={12} sm={2} columns={12}>
                    <Grid
                        container
                        spacing={matchDownSM ? 0 : 2}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"

                    >
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                            // onClick={handleAddIncident}
                            >
                                Stock
                            </Button>
                        </Grid>

                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                            // onClick={handleAddIncident}
                            >
                                Solicitud
                            </Button>
                        </Grid>
                    </Grid>
                </Grid><br></br>
                <Divider color="#FFFFFF" sx={{ height: 2, width: '100%' }} />
                <Divider color="#FFFFFF" sx={{ height: 2, width: '100%' }} />

                <Divider color="#FDA228" sx={{ height: 2, width: '100%' }} />
                <Grid item xs={12} sm={12}>
                    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Historial</Typography>
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
                                                // loadingDownload &&
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
                                            // onDoubleClick={handleOpenAttached(element.IdAdjunto, element.Nombre)}
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
            <Divider variant="middle" />
            <Grid container spacing={gridSpacing}>
                <Grid item xs={8} sm={2} alignItems='flex-end'>
                    <Grid
                        container
                        spacing={matchDownSM ? 0 : 2}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"

                    >
                        {/* <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                            // onClick={handleAddIncident}
                            >
                                 Stock
                            </Button>
                        </Grid>

                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                            // onClick={handleAddIncident}
                            >
                                 Solicitud
                            </Button>
                        </Grid> */}
                    </Grid>
                </Grid>
                <Divider color="#FFFFFF" sx={{ height: 2, width: '100%' }} />
                <Divider color="#FFFFFF" sx={{ height: 2, width: '100%' }} />

                <Divider color="#FDA228" sx={{ height: 2, width: '100%' }} />
                <Grid item xs={12} sm={12}>
                    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Historial</Typography>
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
                                                // loadingDownload &&
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
                                            // onDoubleClick={handleOpenAttached(element.IdAdjunto, element.Nombre)}
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
            <Grid item xs={12} sm={12} sx={{ mt: 2, mb: 2 }}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={6} sm={4} columns={12}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '80ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField id="outlined-basic" label="Escriba un comentario aca" variant="outlined" />
                        </Box>
                    </Grid>
                    <Grid
                            container
                            spacing={matchDownSM ? 0 : 2}
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="flex-end"

                        >
                        <Grid item xs={6} >

                            <Button
                                color="primary"
                                disabled={false}
                                size="medium"
                                variant="outlined"
                            > Hola
                            </Button>
                        </Grid>


                        <Grid item xs={6} >
                            <Button
                                color="primary"
                                disabled={false}
                                size="medium"
                                variant="outlined"
                                component="label"
                            > Programar Entrega
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default PickingEntrega;
