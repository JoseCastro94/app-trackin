import * as React from 'react'
import MainCard from '../../../ui-component/cards/MainCard'
import StatsCard from '../../../ui-component/cards/StatsCard'

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


import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import SpeakerNotesOffOutlinedIcon from '@mui/icons-material/SpeakerNotesOffOutlined';


import {useNavigate} from 'react-router-dom'

import { useSelector } from 'react-redux'
// project imports
import { gridSpacing } from '../../../store/constant';

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'

import Logo from '../../../ui-component/Logo'

import { useTheme, styled } from '@mui/material/styles';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fafafa'
}))




const baseURL = process.env.PUBLIC_URL

// ==============================|| DEFAULT DASHBOARD ||============================== //



const Home = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const customization = useSelector((state) => state.customization)
    const [stats, setStats] = React.useState({
        Proceso: 0,
        Pendiente: 0,
        Cancelado: 0,
        Entregado: 0
    })

    const handleAddRequest = () => {
        navigate(`${baseURL}/pickingpage`)
    }
    return (
        <Container fixed >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Accesos directos</Typography>
                </Grid>
                <Grid item lg={3} md={6} sm={6} xs={12}>
                    <CardWrapper border={false} content={false} spacing={2}>
                        <Box sx={{ p: 2 }}>
                            <List sx={{ py: 0 }}>
                                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                    <ListItemAvatar>
                                        {/* { onClick = handleAddRequest } */}
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: 'inherit',
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            <CalendarMonthOutlinedIcon fontSize="large" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            py: 0,
                                            mt: 0.45,
                                            mb: 0.45
                                        }}
                                        primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Picking y Entrega</Typography>}
                                        secondary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                Asignar Fecha y hora de recojo
                                            </Typography>
                                        }
                                    />
                                    </ListItem>
                                    
                                </List>
                        </Box>
                    </CardWrapper>
                </Grid>
                <Grid item lg={3} md={6} sm={6} xs={12} spacing={2}>
                    <CardWrapper border={false} content={false}>
                        <Box sx={{ p: 2 }}>
                            <List sx={{ py: 0 }}>
                                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                    <ListItemAvatar
                                    // onClick={handleAddRequest}
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
                                            <PlaylistAddCheckIcon fontSize="large" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            py: 0,
                                            mt: 0.45,
                                            mb: 0.45
                                        }}
                                        primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Lista de Entregas</Typography>}
                                        secondary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                Entregas Programadas
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </CardWrapper>
                </Grid>
                <Grid item lg={3} md={6} sm={6} xs={12} spacing={2}>
                    <CardWrapper border={false} content={false} >
                        <Box sx={{ p: 2.5 }}>
                            <List sx={{ py: 0 }}>
                                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                    <ListItemAvatar>
                                        {/* //onClick={handleAddRequest} */}

                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: 'inherit',
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            <SpeakerNotesOutlinedIcon fontSize="large" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            py: 0,
                                            mt: 0.45,
                                            mb: 0.45
                                        }}
                                        primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Ingreso de mercaderia</Typography>}
                                        secondary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                Registro de  ingresos
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </CardWrapper>
                </Grid>
                <Grid item lg={3} md={6} sm={6} xs={12}>
                    <CardWrapper border={false} content={false} >
                        <Box sx={{ p: 2 }}>
                            <List sx={{ py: 0 }}>
                                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                    <ListItemAvatar>
                                        {/* //onClick={handleAddRequest} */}

                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: 'inherit',
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            <SpeakerNotesOffOutlinedIcon fontSize="large" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            py: 0,
                                            mt: 0.45,
                                            mb: 0.45
                                        }}
                                        primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Lista de devolución</Typography>}
                                        secondary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                Devoluciones Programadas
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </CardWrapper>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Resumen de Solicitudes</Typography>
            </Grid>
            <Grid item xs={12} marginBottom={4}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} alignItems='center'>
                        <Typography variant='h2' sx={{
                            color: theme.palette.primary.main
                        }}>Bienvenido a Trackin</Typography>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <CardWrapper border={false} content={false}>
                            <StatsCard
                                title="Entrega Parcial"
                                color={theme.palette.error.main}
                                number={stats.Cancelado}
                                borderRadius={`${customization.borderRadius}px`}
                            ></StatsCard>
                        </CardWrapper>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <CardWrapper border={false} content={false}>
                            <StatsCard
                                title="Entregado"
                                color={theme.palette.primary.main}
                                number={stats.Entregado}
                                borderRadius={`${customization.borderRadius}px`}
                            ></StatsCard>
                        </CardWrapper>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Ordenar por:</Typography>
            </Grid>
        </Container>
    )
};

// TABLA PARA PRODUCTO
// const columns = React.useMemo(
//     () => [
//         { field: 'Producto', headerName: '', width: 200, headerAlign: 'center', },
//         { field: 'Solicitud', headerName: '#Solicitud', width: 200, headerAlign: 'center', },
//         { field: 'Cuenta', headerName: 'Cuenta', width: 150, headerAlign: 'center', },
//         {
//             field: 'PAsignada',
//             headerName: 'P. Asignada',
//             width: 150,
//             headerAlign: 'center'
//         },
//         { field: 'Estado', headerName: 'Estado', width: 200, headerAlign: 'center', },
//         { field: 'FechaSolicitud', headerName: 'F. Solicitud', width: 110, type: 'date', headerAlign: 'center', },
//         { field: 'Picking', headerName: 'Picking', width: 110, headerAlign: 'center', },
//         {
//             field: 'Detalle',
//             headerName: 'Detalle',
//             type: 'actions',
//             width: 80
//         }
//     ],
//     [goDetail],
// )

export default Home;