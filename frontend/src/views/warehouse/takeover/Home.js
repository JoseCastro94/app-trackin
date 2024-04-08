import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import { gridSpacing } from '../../../store/constant'

import {
    useNavigate
} from "react-router-dom"

import {
    Grid,
    Typography,
    Container,
    Button,
    useMediaQuery,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'

import DataGridApp from '../../../ui-component/grid/DataGridApp'

import { GridActionsCellItem } from '@mui/x-data-grid'

import EditIcon from '@mui/icons-material/Edit'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

import ViewAdjunto from './ViewAdjunto.js'

import { modeContext } from '../../../context/modeContext'

import clsx from 'clsx'

import { STATUS_RELEVO } from '../../../store/constant'

const baseURL = process.env.PUBLIC_URL

const WarehouseTakeoverHome = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)

    const [listWarehouse, setListWarehouse] = React.useState([])

    React.useEffect(() => {
        fetch(process.env.REACT_APP_API + 'business/api/almacen/OwnJustAlmacen', {
            method: 'POST',
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
                setListWarehouse(response)
            })
    }, [token, tokenCompany])

    const [warehouse, setWarehouse] = React.useState('-')

    const handleChangeWarehouse = (event) => {
        let selectValue = event.target.value
        setWarehouse(selectValue)
        if (selectValue !== '-') {
            listar(selectValue)
        }
    }


    const listar = React.useCallback((IdAlmacen) => {
        fetch(process.env.REACT_APP_API + 'business/api/relevo_almacen/getInfo', {
            method: 'POST',
            body: JSON.stringify({
                IdAlmacen: IdAlmacen
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
                setRows(response.map(element => {
                    element.Codigo = `RELE-${element.Periodo}-${String(element.Correlativo).padStart(6, 0)}`
                    element.FechaInicio = element.FechaInicio ? new Date(element.FechaInicio) : '-'
                    element.FechaFin = element.FechaFin ? new Date(element.FechaFin) : '-'
                    element.Nombres = `${element.ApellidoPaterno} ${element.ApellidoMaterno} ${element.Nombres}`
                    return element
                }))
            })
    }, [token, tokenCompany])

    const remove = React.useMemo((IdRelevoAlmacen) => {
        if (IdRelevoAlmacen) {
            fetch(process.env.REACT_APP_API + 'business/api/relevo_almacen/delRelevo', {
                method: 'POST',
                body: JSON.stringify({
                    IdRelevoAlmacen: IdRelevoAlmacen
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
                    if (warehouse !== '-') listar(warehouse)
                })
        }
    }, [warehouse, listar, token, tokenCompany])

    const columns = React.useMemo(
        () => [
            { field: 'Codigo', headerName: 'Código', width: 200, headerAlign: 'center', },
            { field: 'Nombres', headerName: 'Nombres', width: 250, headerAlign: 'center', },
            { field: 'NroDocumento', headerName: 'Documento', width: 150, headerAlign: 'center', },
            { field: 'FechaInicio', headerName: 'FechaInicio', width: 100, headerAlign: 'center', type: 'date' },
            { field: 'FechaFin', headerName: 'FechaFin', width: 100, headerAlign: 'center', type: 'date' },
            {
                field: 'Estado',
                headerName: 'Estado',
                width: 100,
                headerAlign: 'center',
                cellClassName: (params) => {
                    if (params.value == null) {
                        return '';
                    }

                    if (params.row == null) {
                        return '';
                    }

                    return clsx('super-app-grid', {
                        primary: params.row.IdParametro === STATUS_RELEVO.ACTIVO,
                        warning: params.row.IdParametro === STATUS_RELEVO.PENDIENTE,
                        secondary: params.row.IdParametro === STATUS_RELEVO.INACTIVO
                    });
                },
            },
            { field: 'id', hide: true },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    let a = []
                    a.push(
                        <GridActionsCellItem
                            icon={<TextSnippetOutlinedIcon />}
                            label="Adjuntos"
                            onClick={() => {
                                setIdRelevoAlmacen(params.row.id)
                                setOpenAdjunto(true)
                            }}
                        />
                    )
                    a.push(
                        <GridActionsCellItem
                            icon={<AssignmentTurnedInOutlinedIcon />}
                            label="Cargo"
                            showInMenu
                            onClick={() => {
                                fetch(`${process.env.REACT_APP_API}business/api/relevo_almacen/cargo`, {
                                    body: JSON.stringify({
                                        IdRelevoAlmacen: params.row.id
                                    }),
                                    method: 'POST',
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
                                        a.download = 'cargo_relevo.pdf'
                                        document.body.appendChild(a)
                                        a.click()
                                        a.remove()
                                    })
                            }}
                        />
                    )
                    if (params.row.IdParametro === STATUS_RELEVO.PENDIENTE) {
                        a.push(
                            <GridActionsCellItem
                                icon={<EditIcon />}
                                label="Editar"
                                showInMenu
                                onClick={() => {
                                    navigate(`${baseURL}/warehouse/takeover/register/${params.row.id}`)
                                }}
                            />
                        )
                        a.push(
                            <GridActionsCellItem
                                icon={<DeleteOutlineIcon />}
                                label="Eliminar"
                                onClick={() => {
                                    remove(params.row.id)
                                }}
                                showInMenu
                            />
                        )
                    }
                    return a
                },
            },
        ],
        [navigate, remove, token, tokenCompany],
    )

    const [rows, setRows] = React.useState([])

    const handleGoNew = () => {
        navigate(`${baseURL}/warehouse/takeover/register`)
    }

    const [idRelevoAlmacen, setIdRelevoAlmacen] = React.useState('')
    const [openAdjunto, setOpenAdjunto] = React.useState(false)

    const handleCloseAdjunto = () => {
        setOpenAdjunto(false)
    }

    return (
        <Container fixed>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={8} sm={6}>
                    <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>Relevo de responsable de almacen</Typography>
                </Grid>
                <Grid item xs={4} sm={6}>
                    <Grid
                        container
                        spacing={matchDownSM ? 0 : 2}
                        direction="row"
                        justifyContent='flex-start'
                        alignItems='flex-start'
                    >
                        <Grid item xs={8}>
                            <FormControl fullWidth size='small' margin='none'>
                                <InputLabel id="lblWarehouse">Almacen</InputLabel>
                                <Select
                                    labelId="lblWarehouse"
                                    label="Almacen"
                                    size='small'
                                    margin='none'
                                    value={warehouse}
                                    onChange={handleChangeWarehouse}
                                >
                                    <MenuItem value='-'>--Seleccionar--</MenuItem>
                                    {
                                        listWarehouse.map((option) =>
                                            <MenuItem key={option.IdAlmacen} value={option.IdAlmacen}>{option.Nombre}</MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                size='medium'
                                fullWidth
                                onClick={handleGoNew}
                            >
                                Nueva responsable
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <DataGridApp
                        rows={rows}
                        columns={columns}
                        height={420}
                    ></DataGridApp>
                </Grid>
            </Grid>
            <ViewAdjunto
                open={openAdjunto}
                id={idRelevoAlmacen}
                edit={idRelevoAlmacen}
                title={idRelevoAlmacen}
                handleClose={handleCloseAdjunto}
            >
            </ViewAdjunto>
        </Container>
    )
}

export default WarehouseTakeoverHome