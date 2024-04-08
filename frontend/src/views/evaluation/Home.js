import * as React from 'react'

import { useTheme, styled } from '@mui/material/styles'

// material-ui
import {
    Grid,
    Typography,
    Container,
} from '@mui/material'

import MainCard from '../../ui-component/cards/MainCard.js'
import StatsCard from '../../ui-component/cards/StatsCard.js'
import { useSelector } from 'react-redux'
import { gridSpacing } from '../../store/constant'

import Dispatch from './Dispatch.js'

import { format } from 'date-fns'

import { modeContext } from '../../context/modeContext'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fafafa'
}))

const EvaluationHistory = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const { token, tokenCompany } = React.useContext(modeContext)
    const [stats, setStats] = React.useState({
        Proceso: 0,
        Pendiente: 0,
        Cancelado: 0,
        Entregado: 0
    })

    const [dispatches, setDispatches] = React.useState([])

    const listDespacho = React.useCallback(() => {
        fetch(process.env.REACT_APP_API + 'business/api/detalle_despacho/DetalleDespachoEntregado', {
            method: 'GET',
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
                setDispatches(response)
            })
    }, [token, tokenCompany])

    React.useEffect(() => {
        fetch(process.env.REACT_APP_API + 'business/api/solicitud_articulo/ConteoDevolucionUsuario', {
            method: 'GET',
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
                let status = {}
                response.forEach(element => {
                    status[element.Nombre] = element.count
                })
                console.log(status)
                setStats({
                    Proceso: status["En Proceso"],
                    Pendiente: status["Pendiente Programar"],
                    Cancelado: status["Cancelado"],
                    Entregado: status["Entregado"],
                })
            })
    }, [token, tokenCompany])

    React.useEffect(() => {
        listDespacho()
    }, [listDespacho])

    return (
        <Grid container spacing={gridSpacing}>
            <Container fixed>
                <Grid item xs={12} sm={12} marginTop={2}>
                    <Typography variant='h4' sx={{ color: theme.palette.secondary.main, fontWeight: '100' }}>Resumen de evaluaciones</Typography>
                </Grid>
                <Grid container spacing={2}>
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
                                title="Evaluado"
                                color={theme.palette.primary.main}
                                number={stats.Entregado}
                                borderRadius={`${customization.borderRadius}px`}
                            ></StatsCard>
                        </CardWrapper>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant='h4' sx={{ color: theme.palette.secondary.main, fontWeight: '100' }}>Listado</Typography>
                    </Grid>
                    {
                        dispatches.map(dispatch => {
                            return (
                                <Dispatch
                                    key={dispatch.IdDetalleDespacho}
                                    id={dispatch.IdDetalleDespacho}
                                    codigo={String(dispatch.IdDetalleDespacho).substring(0, 4)}
                                    articulo={dispatch.ItemName}
                                    codigo_articulo={dispatch.ItemCode}
                                    nombre={dispatch.Nombres}
                                    apellido_paterno={dispatch.ApellidoPaterno}
                                    apellido_materno={dispatch.ApellidoMaterno}
                                    cuenta={dispatch.Negocio}
                                    fecha={format(new Date(dispatch.FechaCreacion), "dd/LL/yyyy")}
                                    cantidad={dispatch.Cantidad}
                                    estado={dispatch.EstadoEvaluado}
                                    serie={dispatch.SerialNumber === "" ? undefined : dispatch.SerialNumber}
                                    onChange={() => {
                                        listDespacho()
                                    }}
                                >
                                </Dispatch>
                            )
                        })
                    }
                </Grid>
            </Container >
        </Grid >
    )
}

export default EvaluationHistory