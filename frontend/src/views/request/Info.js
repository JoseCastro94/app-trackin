import * as React from 'react'
 
import { useTheme, styled } from '@mui/material/styles'
 
import { gridSpacing, APP_REQUEST_STATUS } from '../../store/constant'
 
import MainCard from '../../ui-component/cards/MainCard.js'
 
import {
    useNavigate
} from "react-router-dom"
 
// material-ui
import {
    Grid,
    Typography,
    Container,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Button,
    Snackbar,
    Alert,
} from '@mui/material'
 
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
 
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
 
import { GridActionsCellItem } from '@mui/x-data-grid'
 
 
import LaunchIcon from '@mui/icons-material/Launch'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
 
import DialogMain from '../../ui-component/alerts/DialogMain.js'
 
import DataGridApp from '../../ui-component/grid/DataGridApp.js'
 
import { modeContext } from '../../context/modeContext'
 
import clsx from 'clsx'
 
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fafafa'
}))
 
const baseURL = process.env.PUBLIC_URL
 
 
const RequestInfo = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const [listRequest, setListRequest] = React.useState([])
    const { token, tokenCompany } = React.useContext(modeContext)
 
    const goDetail = React.useCallback(
        (id) => () => {
            console.dir(id);
            setTimeout(() => {
                const pick = listRequest.find((row) => row.id === id)
                navigate(`${baseURL}/request/detail/${pick.id}`)
            })
        },
        [listRequest, navigate],
    )
 
    const listDetail = React.useCallback(() => {
        fetch(process.env.REACT_APP_API + 'business/api/solicitud_articulo/SolicitudesArticulosInfo', {
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
                console.log('Datos recibidos de la API:', response);
                const processedRequests = [];
   
                if (response.solicitudesArticulo) {
                    response.solicitudesArticulo.forEach(element => {
                        element.FechaPropuesta = new Date(element.FechaPropuesta);
                        element.FechaSolicitud = new Date(element.FechaSolicitud);
                        element.Codigo = `SOL-${element.Periodo}-${String(element.Correlativo).padStart(6, 0)}`;
                        element.TipoSolicitud = "Articulo";
                        processedRequests.push(element);
                    });
                }
   
                if (response.solicitudesTransferencia) {
                    response.solicitudesTransferencia.forEach(element => {
                        element.FechaPropuesta = new Date(element.FechaPropuesta);
                        element.FechaSolicitud = new Date(element.FechaSolicitud);
                        element.Codigo = `SOL-${element.Periodo}-${String(element.Correlativo).padStart(6, 0)}`;
                        element.TipoSolicitud = "Transferencia"; // Nueva propiedad
                        processedRequests.push(element);
                    });
                }
               
                setListRequest(processedRequests);
            })
    }, [token, tokenCompany]);
   
 
    const [proc, setProc] = React.useState({
        id: null
    })
 
    const deleteDetail = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                setProc({ id })
                setOpenDialog(true)
            })
        },
        [],
    )
 
    const columns = React.useMemo(
        () => [
            { field: 'Codigo', headerName: '# Solicitud', width: 150, headerAlign: 'center', },
            {
                field: 'Estado',
                headerName: 'Estado',
                width: 150,
                headerAlign: 'center',
                cellClassName: (params) => {
                    if (params.value == null) {
                        return '';
                    }
 
                    if (params.row == null) {
                        return '';
                    }
 
                    return clsx('super-app-grid', {
                        primary: params.row.IdParametro === APP_REQUEST_STATUS.ENTREGADO,
                        warning: params.row.IdParametro === APP_REQUEST_STATUS.PENDIENTE,
                        success: params.row.IdParametro === APP_REQUEST_STATUS.EN_PROCESO || params.row.IdParametro === APP_REQUEST_STATUS.PENDIENTE_APROBACION,
                        error: params.row.IdParametro === APP_REQUEST_STATUS.CANCELADO,
                    });
                },
            },
            { field: 'MotivoSolicitud', headerName: 'Motivo', width: 200, headerAlign: 'center', },
            { field: 'FechaSolicitud', headerName: 'F. Registro', width: 100, type: 'date', headerAlign: 'center', },
            { field: 'FechaPropuesta', headerName: 'F. Propuesta', width: 100, type: 'date', headerAlign: 'center', },
            { field: 'TipoSolicitud', headerName: 'Tipo de Solicitud', width: 100, headerAlign: 'center', },
 
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    let a = []
                    a.push(
                        <GridActionsCellItem
                            icon={<LaunchIcon />}
                            label="Abrir solicitud"
                            onClick={goDetail(params.id)}
                        />
                    )
                    if (params.row.IdParametro === "1ba55dc8-3d0a-4c09-933e-7b5aabc70d60" || "4dabb637-f9f3-43d9-bfc8-f95f17450e17" ) {
                        a.push(
                            <GridActionsCellItem
                                icon={<DeleteOutlineIcon />}
                                label="Eliminar solicitud"
                                onClick={deleteDetail(params.id)}
                            />
                        )
                    }
                    return a
                },
            },
            { field: 'id', hide: true },
            { field: 'IdParametro', hide: true },
        ],
        [goDetail, deleteDetail],
    )
 
    const handleAddRequest = () => {
        navigate(`${baseURL}/request/register`)
    }
 
    const handleHistoryRequest = () => {
        navigate(`${baseURL}/request/history`)
    }
 
    React.useEffect(() => {
        listDetail()
    }, [listDetail])
 
    const [openDialog, setOpenDialog] = React.useState(false)
 
    const handleCloseDialog = () => {
        setOpenDialog(false)
    }
 
    const handleRemove = () => {
        setLoading(true)
        let id = proc.id
        const pick = listRequest.find((row) => row.id === id)
        fetch(`${process.env.REACT_APP_API}business/api/solicitud_articulo/SolicitudArticulo/${pick.id}`, {
            method: 'PATCH',
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
                setLoading(false)
                setOpenDialog(false)
                setOpenAlert(true)
                setAlert({
                    message: 'Se eliminó el registro correctamente',
                    severity: 'info'
                })
                listDetail()
            })
    }
 
    const [openAlert, setOpenAlert] = React.useState(false)
 
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }
 
    const [loading, setLoading] = React.useState(false)
 
    const [alert, setAlert] = React.useState({
        message: '',
        severity: 'info'
    })
    return (
        <Container fixed>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Accesos directos</Typography>
                </Grid>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                    <CardWrapper border={false} content={false}>
                        <Box sx={{ p: 2 }}>
                            <List sx={{ py: 0 }}>
                                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                    <ListItemAvatar
                                        onClick={handleAddRequest}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: 'inherit',
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            <AddBoxOutlinedIcon fontSize="large" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            py: 0,
                                            mt: 0.45,
                                            mb: 0.45
                                        }}
                                        primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Nueva solicitud</Typography>}
                                        secondary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                Crear una nueva solicitud
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </CardWrapper>
                </Grid>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                    <CardWrapper border={false} content={false}>
                        <Box sx={{ p: 2 }}>
                            <List sx={{ py: 0 }}>
                                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar
                                            onClick={handleHistoryRequest}
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: 'inherit',
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            <PlaylistAddCheckIcon fontSize="large" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            py: 0,
                                            mt: 0.45,
                                            mb: 0.45
                                        }}
                                        primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Historial de solicitudes</Typography>}
                                        secondary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                Revisa todas tus solicitudes
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </CardWrapper>
                </Grid>
                <Grid item xs={12} sm={12} marginTop="10px">
                    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Requerimientos activos</Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <DataGridApp
                        rows={listRequest}
                        columns={columns}
                    ></DataGridApp>
                </Grid>
            </Grid>
            <DialogMain
                open={openDialog}
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                body='¿Desea eliminar la solicitud seleccionada?'
                actions={
                    <div>
                        <Button
                            onClick={handleCloseDialog}
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : 'No'}
                        </Button>
                        <Button
                            onClick={handleRemove}
                            disabled={loading}
                           
                        >
                            {loading ? 'Cargando...' : 'Si'}
                        </Button>
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
        </Container>
    )
}
 
export default RequestInfo