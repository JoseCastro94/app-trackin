import * as React from 'react'

import { useTheme, styled } from '@mui/material/styles'

import {
    Grid,
    Typography,
    Container,
    Button,
    useMediaQuery,
    TextField,
} from '@mui/material'

import {
    useNavigate
} from "react-router-dom"

import { useSelector } from 'react-redux'

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Stack from '@mui/material/Stack'
import esLocale from 'date-fns/locale/es'

import { gridSpacing, STATUS_TRANSFER_WAREHOUSE } from '../../../store/constant'

import StatsCard from '../../../ui-component/cards/StatsCard.js'
import MainCard from '../../../ui-component/cards/MainCard.js'

import Head from './Head.js'

import { format } from 'date-fns'

import { modeContext } from '../../../context/modeContext'

const localeMap = {
    es: esLocale
}

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fafafa'
}))

///iniciar variable del app
const baseURL = process.env.PUBLIC_URL

const WarehouseTransferHome = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const { token, tokenCompany } = React.useContext(modeContext)
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))

    const [dateFin, setDateFin] = React.useState(new Date())

    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    const [dateInit, setDateInit] = React.useState(d)

    const navigate = useNavigate()

    const handleNewTransferRequest = () => {
        navigate(`${baseURL}/warehouse/transfer/register`)
    }

    const [heades, setHeades] = React.useState([])

    const [stats, setStats] = React.useState({
        [STATUS_TRANSFER_WAREHOUSE.EN_TRANSITO]: 0,
        [STATUS_TRANSFER_WAREHOUSE.FINALIZADO]: 0,
    })

    const [listIsAdmin, setListIsAdmin] = React.useState([])

    const find = React.useCallback(() => {
        fetch(process.env.REACT_APP_API + 'business/api/translado_almacen/List', {
            method: 'POST',
            body: JSON.stringify({
                fecha_inicio: dateInit,
                fecha_fin: dateFin
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
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                setHeades(response.solicitudes)
                setListIsAdmin(response.isAdmin)
            })
        fetch(process.env.REACT_APP_API + 'business/api/translado_almacen/Stats', {
            method: 'POST',
            body: JSON.stringify({
                fecha_inicio: dateInit,
                fecha_fin: dateFin
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
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                let rst = {}
                response.forEach(element => {
                    rst[element.Estado] = element.Stat
                })
                setStats(rst)
            })
    }, [dateInit, dateFin, token, tokenCompany])

    React.useEffect(() => {
        find()
    }, [find])

    return (
        <Container fixed>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={4}>
                    <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Transferencias entre almacenes</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Grid
                        container
                        spacing={matchDownSM ? 0 : 2}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                        <Grid item xs={4}>
                            <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                                adapterLocale={localeMap["es"]}
                            >
                                <Stack spacing={0}>
                                    <DesktopDatePicker
                                        label="Fecha inicio"
                                        size='small'
                                        value={dateInit}
                                        minDate={new Date('2017-01-01')}
                                        onChange={(newValue) => {
                                            setDateInit(newValue)
                                        }}
                                        renderInput={
                                            (params) => {
                                                params.fullWidth = true
                                                params.margin = "none"
                                                params.size = 'small'
                                                return (
                                                    <TextField {...params} />
                                                )
                                            }
                                        }
                                    />
                                </Stack>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                            <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                                adapterLocale={localeMap["es"]}
                            >
                                <Stack spacing={0}>
                                    <DesktopDatePicker
                                        label="Fecha fin"
                                        size='small'
                                        value={dateFin}
                                        minDate={new Date('2017-01-01')}
                                        onChange={(newValue) => {
                                            setDateFin(newValue)
                                        }}
                                        renderInput={
                                            (params) => {
                                                params.fullWidth = true
                                                params.margin = "none"
                                                params.size = 'small'
                                                return (
                                                    <TextField {...params} />
                                                )
                                            }
                                        }
                                    />
                                </Stack>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                size='medium'
                                fullWidth
                                onClick={handleNewTransferRequest}
                            >
                                Nueva transferencia
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} marginBottom={2}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={3} md={3} sm={6} xs={6}>
                            <CardWrapper border={false} content={false}>
                                <StatsCard
                                    title="En transito"
                                    color={theme.palette.warning.main}
                                    number={stats[STATUS_TRANSFER_WAREHOUSE.EN_TRANSITO]}
                                    borderRadius={`${customization.borderRadius}px`}
                                ></StatsCard>
                            </CardWrapper>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={6}>
                            <CardWrapper border={false} content={false}>
                                <StatsCard
                                    title="Finalizado"
                                    color={theme.palette.primary.main}
                                    number={stats[STATUS_TRANSFER_WAREHOUSE.FINALIZADO]}
                                    borderRadius={`${customization.borderRadius}px`}
                                ></StatsCard>
                            </CardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                {
                    heades.map(head => {
                        const findIsAdmin = listIsAdmin.find(f => f.IdAlmacen === head.IdAlmacenDestino)
                        return (
                            <Head
                                key={head.id}
                                codigo={`TRA-${head.Periodo}-${head.Correlativo}`}
                                almacen_origen={head.OrigenAlmacen}
                                almacen_destino={head.DestinoAlmacen}
                                fecha_registro={format(new Date(head.FechaRecepcion), "dd/LL/yyyy")}
                                fecha_transferencia={head.FechaTranslado !== null ? format(new Date(head.FechaTranslado), "dd/LL/yyyy") : ''}
                                estado={head.Estado}
                                codigo_estado={head.IdEstado}
                                id={head.id}
                                isAdmin={findIsAdmin}
                                onChange={find}
                            >
                            </Head>
                        )
                    })
                }
            </Grid>
        </Container >
    )
}

export default WarehouseTransferHome