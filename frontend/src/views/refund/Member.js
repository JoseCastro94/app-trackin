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
    Typography,
    Collapse,
    Grid,
    TextField,
    Button,
    Snackbar,
    Alert,
} from '@mui/material'

import DataGridApp from '../../ui-component/grid/DataGridApp.js'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import { gridSpacing } from '../../store/constant.js'

import DialogMain from '../../ui-component/alerts/DialogMain.js'

import { modeContext } from '../../context/modeContext'

const columns = [
    { field: 'CodArticulo', headerName: 'Cod. producto', width: 200 },
    { field: 'Articulo', headerName: 'Des. producto', width: 300 },
    { field: 'SerialNumber', headerName: 'Serie', width: 150 },
    { field: 'Cantidad', headerName: 'Cant. entreg', width: 100, type: 'number', },
    { field: 'FechaCreacion', headerName: 'F. de entrega', width: 100, type: 'date' },
    { field: 'Devolucion', headerName: 'Devolución', width: 100 },
    { field: 'CantidadDevuelto', headerName: 'Cant. Dev.', width: 100, type: 'number', editable: true },
    { field: 'Almacen', headerName: 'Almacen', width: 150 },
    { field: 'id', hide: true },
]

const MemberRefund = ({
    nombre = '',
    dni = '',
    razon_social = '',
    estado = true,
    id = ''
}) => {
    const [open, setOpen] = React.useState(false)
    const [load, setLoad] = React.useState(false)
    const { token, tokenCompany } = React.useContext(modeContext)

    const [rows, setRows] = React.useState([])
    const [selectionModel, setSelectionModel] = React.useState([]);

    const findArticles = (force) => {
        if (load === false || force) {
            fetch(`${process.env.REACT_APP_API}business/api/detalle_despacho/getEntregado/${id}`, {
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
                    setRows(response.map(element => {
                        element.FechaCreacion = new Date(element.FechaCreacion)
                        element.Devolucion = element.U_Devolucion === 'Y' ? 'Si' : 'No'
                        element.SerialNumber = element.SerialNumber === null ? 'S/A' : element.SerialNumber
                        return element
                    }))
                    setLoad(true)
                })
        }
    }

    const [update, setUpdate] = React.useState([])

    const [comentario, setComentario] = React.useState('')

    const handleChangeComentario = (event) => {
        setComentario(event.target.value)
    }

    const [select, setSelect] = React.useState([])

    const [loading, setLoading] = React.useState(false)

    const handleOpenDialog = () => {
        setLoading(true)
        setOpenDialog(true)
    }

    const [openDialog, setOpenDialog] = React.useState(false)

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

    const handleSave = () => {
        setOpenDialog(false)
        let listSave = select.map(element => {
            let findChange = update.find(f => f.id === element.id)
            if (findChange) {
                element[findChange.key] = findChange.value
            }
            return element
        })
        if (listSave.length > 0) {
            fetch(process.env.REACT_APP_API + 'business/api/solicitud_articulo/Devolucion', {
                method: 'POST',
                body: JSON.stringify({
                    motivo: comentario,
                    detalle: listSave,
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
                .then(response => {
                    setAlert({
                        message: 'Se insertó la devolución correctamente',
                        severity: 'info'
                    })
                    setOpenAlert(true)
                    setLoading(false)
                    findArticles(true)
                    setComentario('')
                    setSelectionModel([])
                })
        } else {
            setAlert({
                message: 'Debe de seleccionar un item',
                severity: 'warning'
            })
            setOpenAlert(true)
            setLoading(false)
        }
    }

    const handleCloseDialog = () => {
        setLoading(false)
        setOpenDialog(false)
    }

    const handleRowEditCommit = React.useCallback(
        (params) => {
            const id = params.id
            const key = params.field
            const value = params.value
            const number = parseInt(value)

            const back = () => {
                setRows(previews => {
                    return previews.map(element => {
                        let findChange = update.find(f => f.id === element.id)
                        if (findChange) {
                            element[findChange.key] = findChange.value
                        }
                        return element
                    })
                })
            }

            const row = rows.find(f => f.id === id)
            if (row) {
                let msg = []
                if (row.Cantidad < number) {
                    msg.push('La cantidad devuleta no puede ser menor a la cantidad entregada')
                }
                if (number <= 0) {
                    msg.push('La cantidad no puede ser menor o igual a cero')
                }

                if (msg.length > 0) {
                    setAlert({
                        message: msg[0],
                        severity: 'error'
                    })
                    setOpenAlert(true)
                    back()
                } else {
                    setUpdate(previews => {
                        let preview = previews.find(f => f.id === id)
                        if (preview) {
                            preview.value = number
                        } else {
                            previews.push({
                                id,
                                key,
                                value: number
                            })
                        }
                        return previews
                    })
                }
            }
        },
        [rows, update]
    )

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="lista de articulos" size='small'>
                <TableHead>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell></TableCell>
                        <TableCell align="center">DNI</TableCell>
                        <TableCell align="center">Razon Social</TableCell>
                        <TableCell align="center">Estado</TableCell>
                        <TableCell align="center">
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0, marginTop: 0, marginBottom: 0 } }}
                    >
                        <TableCell component="th" scope="row" align="left">
                            {nombre}
                        </TableCell>
                        <TableCell align="center">{dni}</TableCell>
                        <TableCell align="center">{razon_social}</TableCell>
                        <TableCell align="center">{estado ? 'Activo' : 'Cesado'}</TableCell>
                        <TableCell align="center">
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => {
                                    setOpen(!open)
                                    findArticles()
                                }}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0, marginTop: 0, marginBottom: 0 } }}
                    >
                        <TableCell component="th" scope="row" align="center" colSpan={5}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <DataGridApp
                                            rows={rows}
                                            columns={columns}
                                            checkboxSelection
                                            disableSelectionOnClick
                                            onSelectionModelChange={(ids) => {
                                                const selectedIDs = new Set(ids)
                                                const selectedRowData = rows.filter((row) =>
                                                    selectedIDs.has(row.id.toString())
                                                )
                                                setSelect(selectedRowData)
                                                setSelectionModel(ids)
                                            }}
                                            onCellEditCommit={handleRowEditCommit}
                                            selectionModel={selectionModel}
                                        />
                                    </Grid>
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
                                    <Grid item xs={4} alignSelf="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={handleOpenDialog}
                                            disabled={loading}
                                        >
                                            Registrar devolución
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <DialogMain
                open={openDialog}
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
                body='¿Desea registrar la devolución en el sistema?'
                actions={
                    <div>
                        <Button onClick={handleCloseDialog}>No</Button>
                        <Button onClick={handleSave}>Si</Button>
                    </div>
                }
            ></DialogMain>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openAlert}
                key="top_left"
                autoHideDuration={6000}
                onClose={handleCloseAlert}
            >
                <Alert severity={alert.severity} onClose={handleCloseAlert} sx={{ width: '100%' }}>{alert.message}</Alert>
            </Snackbar>
        </TableContainer>
    )
}

export default MemberRefund