import * as React from 'react'

import { useTheme, styled } from '@mui/material/styles'

// material-ui
import {
    Grid,
    Typography,
    Container,
} from '@mui/material'

import { GridActionsCellItem } from '@mui/x-data-grid'

import MainCard from '../../ui-component/cards/MainCard.js'
import StatsCard from '../../ui-component/cards/StatsCard.js'
import { useSelector } from 'react-redux'
import { gridSpacing, APP_REQUEST_STATUS } from '../../store/constant'
import LaunchIcon from '@mui/icons-material/Launch'

import {
    useNavigate
} from "react-router-dom"

import clsx from 'clsx'

import DataGridApp from '../../ui-component/grid/DataGridApp.js'

import { modeContext } from '../../context/modeContext'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fafafa'
}))

const baseURL = process.env.PUBLIC_URL

const RequestHistory = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const { token, tokenCompany } = React.useContext(modeContext)
    const customization = useSelector((state) => state.customization)
    const [listActive, setListActive] = React.useState([])
    const [listHistory, setListHistory] = React.useState([])
    const [stats, setStats] = React.useState({
        Proceso: 0,
        Pendiente: 0,
        Cancelado: 0,
        Entregado: 0
    })

    const goDetail = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                let pick = listActive.find((row) => row.id === id)
                if (!pick) {
                    pick = listHistory.find((row) => row.id === id)
                }
                navigate(`${baseURL}/request/detail/${pick.id}`)
            })
        },
        [listActive, listHistory, navigate],
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
                        primary: params.row.IdEstado === APP_REQUEST_STATUS.ENTREGADO,
                        warning: params.row.IdEstado === APP_REQUEST_STATUS.PENDIENTE,
                        success: params.row.IdEstado === APP_REQUEST_STATUS.EN_PROCESO,
                        error: params.row.IdEstado === APP_REQUEST_STATUS.CANCELADO,
                    });
                },
            },
            { field: 'MotivoSolicitud', headerName: 'Motivo', width: 200, headerAlign: 'center', },
            { field: 'FechaSolicitud', headerName: 'F. Registro', width: 110, type: 'date', headerAlign: 'center', },
            { field: 'FechaPropuesta', headerName: 'F. Propuesta', width: 110, type: 'date', headerAlign: 'center', },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    return [
                        <GridActionsCellItem
                            icon={<LaunchIcon />}
                            label="Abrir solicitud"
                            onClick={goDetail(params.id)}
                        />,
                    ]
                },
            },
            { field: 'id', hide: true }
        ],
        [goDetail],
    )

    React.useEffect(() => {
        fetch(process.env.REACT_APP_API + 'business/api/solicitud_articulo/ConteoUsuario', {
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
                let status = {}
                response.forEach(element => {
                    status[element.Nombre] = element.count
                })
                setStats({
                    Proceso: status["En Proceso"],
                    Pendiente: status["Pendiente Programar"],
                    Cancelado: status["Cancelado"],
                    Entregado: status["Entregado"],
                })
            })

        fetch(process.env.REACT_APP_API + 'business/api/solicitud_articulo/SolicitudesArticulosActivo', {
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
                setListActive(response.map(element => {
                    element.Codigo = `SOL-${element.Periodo}-${String(element.Correlativo).padStart(6, 0)}`
                    element.FechaSolicitud = new Date(element.FechaSolicitud)
                    element.FechaPropuesta = new Date(element.FechaPropuesta)
                    return element
                }))
            })

        fetch(process.env.REACT_APP_API + 'business/api/solicitud_articulo/SolicitudesArticulosHistorico', {
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
                setListHistory(response.map(element => {
                    element.Codigo = `SOL-${element.Periodo}-${String(element.Correlativo).padStart(6, 0)}`
                    element.FechaSolicitud = new Date(element.FechaSolicitud)
                    element.FechaPropuesta = new Date(element.FechaPropuesta)
                    return element
                }))
            })
    }, [token, tokenCompany])

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} marginBottom={2}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Historial de Solicitudes</Typography>
            </Grid>
            <Container fixed>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <CardWrapper border={false} content={false}>
                            <StatsCard
                                title="En proceso"
                                color={theme.palette.success.main}
                                number={stats.Proceso}
                                borderRadius={`${customization.borderRadius}px`}
                            ></StatsCard>
                        </CardWrapper>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <CardWrapper border={false} content={false}>
                            <StatsCard
                                title="Pendiente"
                                color={theme.palette.warning.main}
                                number={stats.Pendiente}
                                borderRadius={`${customization.borderRadius}px`}
                            ></StatsCard>
                        </CardWrapper>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <CardWrapper border={false} content={false}>
                            <StatsCard
                                title="Cancelado"
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
                    <Grid item xs={12} sm={12}>
                        <Typography variant='h4' sx={{ color: theme.palette.secondary.main, fontWeight: '100' }}>Requerimientos activos</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <DataGridApp
                            rows={listActive}
                            columns={columns}
                        ></DataGridApp>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant='h4' sx={{ color: theme.palette.secondary.main, fontWeight: '100' }}>Requerimientos históricos</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <DataGridApp
                            rows={listHistory}
                            columns={columns}
                        ></DataGridApp>
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    )
}

export default RequestHistory