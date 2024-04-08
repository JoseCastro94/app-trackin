import * as React from 'react'

import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    TableBody,
    IconButton,
    Collapse,
    Grid,
    Button,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material'

import { GridActionsCellItem } from '@mui/x-data-grid'

import DataGridApp from '../../ui-component/grid/DataGridApp.js'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LaunchIcon from '@mui/icons-material/Launch'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import GradingIcon from '@mui/icons-material/Grading'

import { gridSpacing, APP_EVAL_STATUS } from '../../store/constant.js'

import DialogMain from '../../ui-component/alerts/DialogMain.js'

import Adjunto from './Adjunto.js'

import { modeContext } from '../../context/modeContext'

import clsx from 'clsx'

const DispatchEvaluation = ({
    codigo = '',
    articulo = '',
    codigo_articulo = '',
    nombre = '',
    apellido_paterno = '',
    apellido_materno = '',
    cuenta = '',
    fecha = '',
    cantidad = '',
    serie = 'S/A',
    estado,
    id = '',
    onChange = () => { }
}) => {
    const [open, setOpen] = React.useState(false)
    const [load, setLoad] = React.useState(false)
    const [edit, setEdit] = React.useState('')
    const [rows, setRows] = React.useState([])
    const [openEvaluation, setEvaluation] = React.useState(false)
    const { token, tokenCompany } = React.useContext(modeContext)

    const [proc, setProc] = React.useState({
        id: null
    })

    const deleteDetail = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                setProc({ id })
                setOpenDialogRemove(true)
            })
        },
        [],
    )

    const goDetail = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                setEdit(id)
                setEvaluation(true)
            })
        },
        [setEdit, setEvaluation],
    )

    const columns = React.useMemo(
        () => [
            { field: 'Codigo', headerName: 'Codigo', width: 140, headerAlign: 'center', },
            { field: 'Comentario', headerName: 'Comentario', width: 250, headerAlign: 'center', },
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
                        primary: params.row.IdParametro === APP_EVAL_STATUS.EVALUADO,
                        warning: params.row.IdParametro === APP_EVAL_STATUS.PENDIENTE,
                    });
                },
            },
            { field: 'Veredicto', headerName: 'Conclusión', width: 100, headerAlign: 'center', },
            { field: 'Cantidad', headerName: 'Cantidad', width: 80, type: 'number', headerAlign: 'center', },
            { field: 'FechaEvaluacion', headerName: 'Fecha', width: 110, type: 'date', headerAlign: 'center', },
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
                    if (!estado) {
                        a.push(
                            <GridActionsCellItem
                                icon={<DeleteOutlineIcon />}
                                label="Eliminar evluación técnica"
                                onClick={deleteDetail(params.id)}
                            />
                        )
                    }
                    return a
                },
            },
            { field: 'id', hide: true },
        ],
        [deleteDetail, goDetail, estado],
    )

    const findDetail = (force) => {
        if (load === false || force) {
            fetch(`${process.env.REACT_APP_API}business/api/evaluacion_articulo/Detalle/${id}`, {
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
                    setRows(response.map(element => {
                        element.FechaEvaluacion = new Date(element.FechaEvaluacion)
                        element.Codigo = `REV-${element.Periodo}-${String(element.Correlativo).padStart(6, 0)}`
                        return element
                    }))
                    setLoad(true)
                })
        }
    }

    const handleProcess = () => {
        handleCloseDialog()
        fetch(`${process.env.REACT_APP_API}business/api/evaluacion_articulo/procEvaluacion`, {
            method: 'POST',
            body: JSON.stringify({
                IdDetalleDespacho: id
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
                if (response.status === 'Ok') {
                    setOpenAlert(true)
                    setAlert({
                        message: response.message,
                        severity: 'success'
                    })
                    onChange()
                } else {
                    setOpenAlert(true)
                    setAlert({
                        message: response.message,
                        severity: 'info'
                    })
                }
            })
    }

    const [loading, setLoading] = React.useState(false)

    const [openAlert, setOpenAlert] = React.useState(false)
    const [alert, setAlert] = React.useState({
        message: '',
        severity: 'info'
    })
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    const adjuntoRef = React.createRef()
    const clearAdjunto = () => adjuntoRef.current.clear()

    const handleRegisterEvaluation = (status) => {
        setEdit('')
        setEvaluation(status)
        clearAdjunto()
    }

    const handleRemove = () => {
        setLoading(true)
        let id = proc.id
        const pick = rows.find((row) => row.id === id)
        fetch(`${process.env.REACT_APP_API}business/api/evaluacion_articulo/Remove/${pick.id}`, {
            method: 'DELETE',
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
                setOpenDialogRemove(false)
                setOpenAlert(true)
                setAlert({
                    message: 'Se eliminó el registro correctamente',
                    severity: 'info'
                })
                findDetail(true)
            })
    }

    const [openDialogRemove, setOpenDialogRemove] = React.useState(false)

    const handleCloseDialogRemove = () => {
        setOpenDialogRemove(false)
    }

    const [openDialog, setOpenDialog] = React.useState(false)
    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const handleOpenDialog = () => {
        setOpenDialog(true)
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="lista de articulos" size='small'>
                <TableHead>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell># devolución</TableCell>
                        <TableCell align="center">Articulo</TableCell>
                        <TableCell align="center">Cód. producto</TableCell>
                        <TableCell align="center">P. asignada</TableCell>
                        <TableCell align="center">Cuenta/área</TableCell>
                        <TableCell align="center">Fecha registro</TableCell>
                        <TableCell align="center">Cant. eval.</TableCell>
                        <TableCell align="center">Serie</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0, marginTop: 0, marginBottom: 0 } }}
                    >
                        <TableCell component="th" scope="row" align="left">
                            {codigo}
                        </TableCell>
                        <TableCell align="center">{articulo}</TableCell>
                        <TableCell align="center">{codigo_articulo}</TableCell>
                        <TableCell align="center">{apellido_paterno} {apellido_materno} {nombre}</TableCell>
                        <TableCell align="center">{cuenta}</TableCell>
                        <TableCell align="center">{fecha}</TableCell>
                        <TableCell align="center">{cantidad}</TableCell>
                        <TableCell align="center">{serie}</TableCell>
                        <TableCell align="center">
                            {
                                !estado &&
                                <IconButton
                                    aria-label="close evaluation"
                                    size="small"
                                    onClick={handleOpenDialog}
                                >
                                    <GradingIcon></GradingIcon>
                                </IconButton>
                            }
                        </TableCell>
                        <TableCell align="center">
                            {
                                !estado &&
                                <IconButton
                                    aria-label="add evaluation"
                                    size="small"
                                    onClick={() => {
                                        handleRegisterEvaluation(true)
                                    }}
                                >
                                    <AddIcon></AddIcon>
                                </IconButton>
                            }
                        </TableCell>
                        <TableCell align="center">
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => {
                                    setOpen(!open)
                                    findDetail()
                                }}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0, marginTop: 0, marginBottom: 0 } }}
                    >
                        <TableCell component="th" scope="row" align="center" colSpan={10}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <DataGridApp
                                            rows={rows}
                                            columns={columns}
                                        />
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <DialogMain
                open={openDialogRemove}
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                body='¿Desea eliminar la elavuación técnica seleccionada?'
                actions={
                    <div>
                        <Button
                            onClick={handleCloseDialogRemove}
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
            <DialogMain
                open={openDialog}
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                body='¿Desea concluir con la evaluación del despacho?'
                buttons={[
                    {
                        text: 'Cancelar',
                        onClick: handleCloseDialog,
                        color: 'secondary',
                        variant: 'outlined'
                    },
                    {
                        text: 'Registrar',
                        onClick: handleProcess,
                        color: 'primary',
                        variant: 'contained',
                    }
                ]}
            >
            </DialogMain>
            <Adjunto
                ref={adjuntoRef}
                open={openEvaluation}
                handleClose={() => { handleRegisterEvaluation(false) }}
                handleFinishFetch={() => { findDetail(true) }}
                id={id}
                edit={edit}
                disabled={!estado}
            >
            </Adjunto>
        </TableContainer>
    )
}

export default DispatchEvaluation