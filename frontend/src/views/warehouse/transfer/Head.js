import * as React from 'react'

import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    TableBody,
    Typography,
    IconButton,
    Collapse,
    Grid,
    Snackbar,
    Alert,
    TextField,
    Button,
} from '@mui/material'

import DialogMain from '../../../ui-component/alerts/DialogMain.js'

import { GridActionsCellItem } from '@mui/x-data-grid'

import FilePresentIcon from '@mui/icons-material/FilePresent'

import DataGridApp from '../../../ui-component/grid/DataGridApp.js'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { gridSpacing, STATUS_TRANSFER_WAREHOUSE } from '../../../store/constant.js'

import Adjunto from './Adjunto.js'

import { modeContext } from '../../../context/modeContext'

import { IconPaperclip } from "@tabler/icons"

import {
    useNavigate
} from "react-router-dom"

const baseURL = process.env.PUBLIC_URL

const HeadTransfer = ({
    codigo = '',
    almacen_origen = '',
    almacen_destino = '',
    fecha_registro = '',
    fecha_transferencia = '',
    estado = '',
    codigo_estado = '',
    id = '',
    onChange = () => { },
    isAdmin,
    IdGuia
}) => {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false)
    const [load, setLoad] = React.useState(false)
    const [edit, setEdit] = React.useState({
        id: '',
        codigo: '--sin asignar--'
    })
    const [rows, setRows] = React.useState([])
    const { token, tokenCompany } = React.useContext(modeContext)
    const [openEvaluation, setEvaluation] = React.useState(false)

    const goDetail = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                let row = rows.find(f => f.id === id)
                console.log(row)
                setEdit({
                    id: id,
                    codigo: `${row.ItemName} - ${row.ItemCode}`
                })
                setEvaluation(true)
            })
        },
        [setEdit, setEvaluation, rows],
    )

    const columns = React.useMemo(
        () => [
            { field: 'ItemName', headerName: 'Producto', width: 250, headerAlign: 'center', },
            { field: 'ItemCode', headerName: 'Cod. producto', width: 150, headerAlign: 'center', },
            { field: 'Grupo', headerName: 'Grupo', width: 100, headerAlign: 'center', },
            { field: 'SerialNumber', headerName: 'SerialNumber', width: 150, headerAlign: 'center', },
            { field: 'CantidadEnviada', headerName: 'Cantidad Solicitada', width: 120, type: 'number', headerAlign: 'center', },
            {
                field: 'CantidadRecibida',
                headerName: 'Cantidad Recibida',
                type: 'number',
                width: 120,
                editable: true,
                headerAlign: 'center',
            },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => {
                    let a = []
                    a.push(
                        <GridActionsCellItem
                            icon={<FilePresentIcon />}
                            label="Archivos adjuntos"
                            onClick={goDetail(params.id)}
                        />
                    )
                    return a
                },
            },
            { field: 'id', hide: true },
            { field: 'FechaTranslado', hide: true },
            { field: 'FechaRecepcion', hide: true },
            { field: 'id', hide: true },
        ],
        [goDetail],
    )

    const findDetail = (force) => {
        if (load === false || force) {
            fetch(`${process.env.REACT_APP_API}business/api/detalle_translado_almacen/List/${id}`, {
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
                    setRows(response.map(element => {
                        element.SerialNumber = element.SerialNumber === null ? 'N/A' : element.SerialNumber
                        return element
                    }))
                    setLoad(true)
                })
        }
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
        setEdit({
            id: '',
            codigo: '--sin asignar--'
        })
        setEvaluation(status)
        clearAdjunto()
    }

    const [comentario, setComentario] = React.useState('')

    const handleChangeComentario = (event) => {
        setComentario(event.target.value)
    }

    const handleEditCantidad = (
        params,
    ) => {
        const id = params.id
        const key = params.field
        const value = params.value
        const number = parseInt(value)

        const back = () => {
            setRows(previews => {
                return previews.map(element => element)
            })
        }

        const row = rows.find(f => f.id === id)

        if (row) {
            let msg = []
            if (number) {
                if (number > row.CantidadEnviada) {
                    msg.push('La cantidad ingresada supera a la cantidad enviada')
                }
                if (number < 0) {
                    msg.push('La cantidad ingresada no puede ser menor a 0')
                }
            }

            if (msg.length > 0) {
                setAlert({
                    message: msg[0],
                    severity: 'error'
                })
                setOpenAlert(true)
                back()
            } else {
                setRows(previews => {
                    let preview = previews.find(f => f.id === id)
                    if (preview) {
                        preview[key] = number
                    }
                    return previews
                })
            }
        }
    }

    const [openDialog, setOpenDialog] = React.useState(false)

    const handleOpenDialog = () => {
        setLoading(true)
        setOpenDialog(true)
    }

    const handleSave = () => {
        setOpenDialog(false)
        fetch(`${process.env.REACT_APP_API}business/api/translado_almacen/upd/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                comentario: comentario,
                detalle: rows
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
            .catch(error => console.error('Error:', error))
            .then(res => res.json())
            .then(response => {
                if (response.status === 'Ok') {
                    setOpenAlert(true)
                    setAlert({
                        message: 'Se actualizó el translado correctamente',
                        severity: 'info'
                    })
                    onChange()
                } else {
                    setOpenAlert(true)
                    setAlert({
                        message: response.message,
                        severity: 'error'
                    })
                    setLoading(false)
                }
            })
    }

    const handleCloseDialog = () => {
        setLoading(false)
        setOpenDialog(false)
    }

    const handleGuide = () => {
        if (IdGuia) {
            navigate(`${baseURL}/guide/register/${IdGuia}`)
        } else {
            navigate(`${baseURL}/guide/register?IdTransferencia=${id}`)
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="lista de articulos" size='small'>
                <TableHead>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell># transferencia</TableCell>
                        <TableCell align="center">Almacen origen</TableCell>
                        <TableCell align="center">Almacen destino</TableCell>
                        <TableCell align="center">Fecha registro</TableCell>
                        <TableCell align="center">Fecha de transf.</TableCell>
                        <TableCell align="center">Estado</TableCell>
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
                        <TableCell align="center">{almacen_origen}</TableCell>
                        <TableCell align="center">{almacen_destino}</TableCell>
                        <TableCell align="center">{fecha_registro}</TableCell>
                        <TableCell align="center">{fecha_transferencia}</TableCell>
                        <TableCell align="center">{estado}</TableCell>
                        <TableCell align="center">
                            <IconButton
                                aria-label="Guide"
                                color="primary"
                                size="small"
                                onClick={() => handleGuide()}
                            >
                                <IconPaperclip />
                            </IconButton>
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
                        <TableCell component="th" scope="row" align="center" colSpan={9}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <DataGridApp
                                            rows={rows}
                                            columns={columns}
                                            onCellEditCommit={handleEditCantidad}
                                        />
                                    </Grid>
                                    {
                                        codigo_estado === STATUS_TRANSFER_WAREHOUSE.EN_TRANSITO && isAdmin &&
                                        <Grid item xs={8}>
                                            <TextField
                                                fullWidth
                                                label="Comentario"
                                                margin="normal"
                                                name="comentario_member"
                                                type="text"
                                                size='small'
                                                placeholder='Escribe aquí tu comentario'
                                                value={comentario}
                                                onChange={handleChangeComentario}
                                            />
                                        </Grid>
                                    }
                                    {
                                        codigo_estado === STATUS_TRANSFER_WAREHOUSE.EN_TRANSITO && isAdmin &&
                                        <Grid item xs={4} alignSelf="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                disabled={loading}
                                                onClick={handleOpenDialog}
                                            >
                                                Registrar Transferencia
                                            </Button>
                                        </Grid>
                                    }
                                </Grid>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openAlert}
                key="top_left"
                autoHideDuration={6000}
                onClose={handleCloseAlert}
            >
                <Alert severity={alert.severity} onClose={handleCloseAlert} sx={{ width: '100%' }}>{alert.message}</Alert>
            </Snackbar>
            <Adjunto
                ref={adjuntoRef}
                open={openEvaluation}
                handleClose={() => { handleRegisterEvaluation(false) }}
                handleFinishFetch={() => { findDetail(true) }}
                id={id}
                edit={edit.id}
                codigo={edit.codigo}
            >
            </Adjunto>
            <DialogMain
                open={openDialog}
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                body='¿Desea registrar la transferencia?'
                buttons={[
                    {
                        text: 'Cancelar',
                        onClick: handleCloseDialog,
                        color: 'secondary',
                        variant: 'outlined'
                    },
                    {
                        text: 'Registrar',
                        onClick: handleSave,
                        color: 'primary',
                        variant: 'contained',
                    }
                ]}
            >
            </DialogMain>
        </TableContainer>
    )
}

export default HeadTransfer