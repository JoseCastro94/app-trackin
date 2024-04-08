import * as React from 'react'

import { useTheme, styled } from '@mui/material/styles'

import { gridSpacing } from '../../store/constant'

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
    Snackbar,
    Alert,
    useMediaQuery,
    TextField,
    Button,
} from '@mui/material'

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Stack from '@mui/material/Stack'
import esLocale from 'date-fns/locale/es'

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'

import DataGridApp from '../../ui-component/grid/DataGridApp.js'
import { GridActionsCellItem } from '@mui/x-data-grid'
import LaunchIcon from '@mui/icons-material/Launch'

import { modeContext } from '../../context/modeContext'

const localeMap = {
    es: esLocale
}

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fafafa'
}))

const baseURL = process.env.PUBLIC_URL

const GuideInfo = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)

    const [dateFin, setDateFin] = React.useState(new Date())

    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    const [dateInit, setDateInit] = React.useState(d)

    const [listGuide, setListGuide] = React.useState([])

    const goDetail = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                navigate(`${baseURL}/guide/register/${id}`)
            })
        },
        [navigate],
    )

    const columns = React.useMemo(
        () => [
            { field: 'Serie', headerName: '# Serie', width: 150, headerAlign: 'center', },
            { field: 'Correlativo', headerName: 'Correlativo', width: 150, headerAlign: 'center', },
            { field: 'RazonSocialDest', headerName: 'Destinatario', width: 300, headerAlign: 'center', },
            { field: 'DocumentoDest', headerName: 'N° Documento', width: 250, headerAlign: 'center', },
            { field: 'FechaEmision', headerName: 'Fecha de emisión', width: 120, type: 'date', headerAlign: 'center', },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    let a = []
                    a.push(
                        <GridActionsCellItem
                            icon={<LaunchIcon />}
                            label="Abrir detalle"
                            onClick={goDetail(params.id)}
                        />
                    )
                    return a
                },
            },
            { field: 'id', hide: true },
        ],
        [goDetail],
    )

    const handleAddGuide = () => {
        navigate(`${baseURL}/guide/register`)
    }

    const [openAlert, setOpenAlert] = React.useState(false)

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    const [comprobante, setComprobante] = React.useState('')
    const handleComprobante = (event) => {
        let selectValue = event.target.value
        setComprobante(selectValue)
    }

    const [destinatario, setDestinatario] = React.useState('')
    const handleDestinatario = (event) => {
        let selectValue = event.target.value
        setDestinatario(selectValue)
    }

    const handleSearch = () => {
        const clear_date = (d, init) => {
            d.setHours(0)
            d.setMinutes(0)
            d.setSeconds(0)

            if (!init) {
                d.setDate(d.getDate() + 1)
                d.setSeconds(-1)
            }
        }

        clear_date(dateInit, true)
        clear_date(dateFin, false)

        fetch(process.env.REACT_APP_API + 'business/api/guia_remision/list', {
            method: 'POST',
            body: JSON.stringify({
                fecha_inicio: dateInit,
                fecha_fin: dateFin,
                comprobante: comprobante,
                destinatario: destinatario,
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
                response.forEach(element => {
                    element.FechaEmision = new Date(element.FechaEmision)
                });
                setListGuide(response)
            })
    }

    return (
        <Container>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Accesos directos</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container>
                        <Grid item xs={6} md={4} lg={4}>
                            <CardWrapper border={false} content={false}>
                                <Box sx={{ p: 2 }}>
                                    <List sx={{ py: 0 }}>
                                        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    onClick={handleAddGuide}
                                                    variant="rounded"
                                                    sx={{
                                                        ...theme.typography.commonAvatar,
                                                        ...theme.typography.largeAvatar,
                                                        backgroundColor: 'inherit',
                                                        color: theme.palette.primary.main
                                                    }}
                                                >
                                                    <AddBoxOutlinedIcon fontSize="inherit" />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                sx={{
                                                    py: 0,
                                                    mt: 0.45,
                                                    mb: 0.45
                                                }}
                                                primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Guia de Remisión</Typography>}
                                            />
                                        </ListItem>
                                    </List>
                                </Box>
                            </CardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} marginTop="10px">
                    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Histórico</Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Grid
                        container
                        spacing={matchDownSM ? 0 : 2}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                        <Grid item xs={6} sm={4}>
                            <TextField
                                fullWidth
                                label="N° Comprobante"
                                name="comprobante"
                                type="text"
                                size='small'
                                value={comprobante}
                                onChange={handleComprobante}
                            />
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <TextField
                                fullWidth
                                label="Destinatario"
                                name="destinatario"
                                type="text"
                                size='small'
                                value={destinatario}
                                onChange={handleDestinatario}
                            />
                        </Grid>
                        <Grid item xs={6} sm={2}>
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
                        <Grid item xs={6} sm={2}>
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
                        <Grid item xs={4} sm={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size='small'
                                onClick={handleSearch}
                            >
                                Buscar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <DataGridApp
                        rows={listGuide}
                        columns={columns}
                    ></DataGridApp>
                </Grid>
            </Grid>
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

export default GuideInfo