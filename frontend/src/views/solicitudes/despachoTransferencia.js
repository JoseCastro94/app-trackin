import {useTheme} from "@mui/material/styles";
import * as React from "react";
import {
    Alert, AlertTitle,
    Autocomplete,
    Box, Button, Collapse,
    Container,
    Grid, IconButton,
    Paper, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";

import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {MobileDatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {listarPorCodigoDeSolicitud} from "../../services/Solicitud";
import { listarPorCodigoDeSolicitudTransferencia } from "../../services/SolicitudTransferencia";
import {obtenerAlmacenes} from "../../services/Usuario";
import {guardarDespacho} from "../../services/Despacho";
import DialogMain from "../../ui-component/alerts/DialogMain";
import {modeContext} from "../../context/modeContext";

const Row = (props) => {
    console.dir('Row = (props)');
    console.dir(props);
    const format = "YYYY-MM-DD HH:mm"
    const { row, almacenes, openConfirm } = props;
    const [open, setOpen] = React.useState(false);
    const [almacen, setAlmacen] = React.useState(null);
    const [detalle, setDetalle] = React.useState([]);
    const [asignado, setAsignado] = React.useState(null);
    const [comentario, setComentario] = React.useState(row.comentario);

    row.fecha_despacho = row.fecha_despacho || moment().format(format)
    const [fecDes, setFecDes] = React.useState(row.fecha_despacho);

    const load = () => {
        console.dir('ASIGANDOS::::::::');
        console.dir(row.asignados);
        setAsignado(row.asignados[0])
        setAlmacen(almacenes[0])
        setDetalle(row.detalle)
    }

    const handleChangeAsignado = (value) => {
        row.id_asignado = value.id
        setAsignado(value)
        const rows = detalle.map(item => { return {...item, picking: 0} })
        setDetalle(rows)
    }

    const handleChangeAlmacen = (value) => {
        row.almacen = value
        setAlmacen(value)
        const rows = detalle.map(item => { return {...item, picking: 0} })
        setDetalle(rows)
    }

    const handleChange = (row, date) => {
        row.fecha_despacho = moment(date).format(format)
        setFecDes(date);
    }

    const handleChangeTime = (row, time) => {
        row.fecha_despacho = moment(time).format(format)
        setFecDes(time);
    }

    const handleChangePicking = (item, value) => {
        const total = item.cantidad - item.cantidad_entrega
        const disponible_programar = item.cantidad - item.cantidad_programada
        if (value > total || value > item.stock || value < 0 || value > disponible_programar) return
        const newDetalle = detalle.map(el => {
            if (item.id === el.id) el.picking = value
            return el
        })
        row.detalle = newDetalle
        setDetalle(newDetalle)
    }

    const handleChangeComentario = (value) => {
        row.comentario = value
        setComentario(value)
    }

    React.useEffect(() => {
        load()
    }, [])

    return <React.Fragment>
        <TableRow sx={{
            'td > p': {p: 0, m: 0},
            'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
        }}>
            <TableCell width={15} sx={{bgcolor: `${row.color} !important`}}></TableCell>
            <TableCell align="center"><p>{row.codigo}</p></TableCell>
            <TableCell align="center"><p>{row.almacen_solicitante}</p></TableCell>
            <TableCell align="center"><p>{row.asignado}</p></TableCell>
            {/*
            <TableCell align="center" width={200}>
                {row.count_asignados === 1 ?
                    <p>{row.asignado}</p> :
                    <Autocomplete
                    options={row.asignados}
                    getOptionLabel={(option) => option.nombre}
                    autoComplete
                    disableClearable
                    value={asignado}
                    openText=""
                    size="small"
                    id="autocomplete"
                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                    onChange={(event, value) => handleChangeAsignado(value)}
                    renderInput={(params) => <TextField {...params} placeholder="Seleccione"/>}
                    />
                }
            </TableCell>
            
            */}
            <TableCell align="center" sx={{
                bgcolor: `${row.color}!important`,
                color: "white",
                fontSize: "12px"
            }}>{row.estado}</TableCell>
            <TableCell align="center"><p>{row.fecha_solicitud}</p></TableCell>
            <TableCell align="center">
                <Autocomplete
                    options={almacenes}
                    getOptionLabel={(option) => option.nombre}
                    autoComplete
                    disableClearable
                    value={almacen}
                    openText=""
                    size="small"
                    id="autocomplete"
                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                    onChange={(event, value) => handleChangeAlmacen(value)}
                    renderInput={(params) => <TextField {...params} placeholder="Seleccione"/>}
                />
            </TableCell>
            <TableCell align="center" sx={{"input": {py: 1, px: 1, textAlign: "center"}}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                        inputFormat="dd/MM/yyyy"
                        disablePast
                        value={fecDes}
                        onChange={(date) => handleChange(row, date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </TableCell>
            <TableCell align="center" sx={{"input": {py: 1, px: 1, textAlign: "center"}}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileTimePicker
                        value={fecDes}
                        onChange={(time) => handleChangeTime(row, time)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </TableCell>
            <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            {/* TABLA DE LISTADO DE ARTICULOS CON DETALLE */}
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell align="center">Codigo</TableCell>
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">C. Sol</TableCell>
                                    <TableCell align="center">Prox. Entrega</TableCell>
                                    <TableCell align="center">Stock</TableCell>
                                    <TableCell align="center">Almacén</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalle
                                        .map((item) => {
                                    return <TableRow key={item.id} sx={{
                                        'td > p': {px: 1, fontSize: "12px", margin: "0px"},
                                        'td, th': {px: 0, py: 0.5, border: 2, borderRadius: "10px", borderColor: "white"},
                                        'td': {bgcolor: item.stock_error ? "error.light" : "grey.200"}
                                    }}>
                                        <TableCell component={"th"} width={15} sx={{bgcolor: item.stock_error ? "error.dark" : "#000064"}}/>
                                        <TableCell>
                                            <p>{item.item}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.codigo}</p>
                                        </TableCell>
                                  
                                        <TableCell>
                                            <p>{item.negocio}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.cantidad}</p>
                                        </TableCell>
                             
                                        
                                        <TableCell sx={{"input": {padding: "4px 8px", textAlign: "right"}, textAlign: "center"}}>
                                            {item.cantidad === item.cantidad ?
                                                <p style={{textAlign: "center"}}>--</p> :
                                                <TextField
                                                    type="number"
                                                    id="outlined-basic"
                                                    sx={{ width: 60 }}
                                                    onChange={(event) => {
                                                        return handleChangePicking(item, event.target.value)
                                                    }}
                                                    disabled={row.id_asignado === 'TODOS' || row.id_asignado === 'VARIOS'}
                                                    value={item.picking}/>
                                            }
                                        </TableCell>
                                        <TableCell align="right"><p>{item.stock}</p></TableCell>
                                        <TableCell><p>{item.id}</p></TableCell>
                                        <TableCell align="center"><p>{1}</p></TableCell>
                                    </TableRow>
                                })}
                                <TableRow sx={{'div > fieldset': { borderRadius: "10px" }}}>
                                    <TableCell colSpan={7} sx={{"input": {px: 1, py: 1}}}>
                                        <TextField
                                            onChange={(event) => handleChangeComentario(event.target.value)}
                                            value={comentario}
                                            id="outlined-basic"
                                            sx={{ width: "100%" }}
                                            placeholder="Escribe aquí tus comentarios"/>
                                    </TableCell>
                                    <TableCell colSpan={4} align="right">
                                        <Button size="small" variant="contained" onClick={() => handleChangeComentario('')}>Limpiar</Button>&nbsp;
                                        <Button size="small" variant="contained"
                                                disabled={ (row.almacen && row.almacen.id === 'TODOS') || row.id_asignado === 'TODOS' || row.id_asignado === 'VARIOS' }
                                                onClick={() => {
                                    
                                                    row.comentario = comentario
                                                    row.almacen = almacen
                                                    row.fecha_despacho = moment(row.fecha_despacho).format()
                                                    row.detalle = detalle
                                                    openConfirm(row)
                                                }}>Programar Entrega</Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </React.Fragment>
}

const DespachoSolicitudTransferenciaPage = () => {
    const theme = useTheme()
    const [rows, setRows] = React.useState([])
    const [rowSave, setRowSave] = React.useState(rows[0])
    const [almacenes, setAlmacenes] = React.useState([])
    const [openDialog, setOpenDialog] = React.useState(false)
    const [openAlert, setOpenAlert] = React.useState(false)
    const [alert, setAlert] = React.useState({ message: '', severity: 'success' })
    const { token, tokenCompany } = React.useContext(modeContext)

    const loadPage = React.useCallback(async () => {
        const ids_solicitudes = JSON.parse(localStorage.getItem('SOL_SEL'))
        const almacenes = await obtenerAlmacenes({}, token, tokenCompany)
        let data = await listarPorCodigoDeSolicitudTransferencia(ids_solicitudes, token, tokenCompany);
       console.dir('loadPage');
        console.log('DATA DE DESPACHO: ')
        console.dir(data);
        if (almacenes.length > 1)
            almacenes.unshift({ id: 'TODOS', nombre: 'Todos' })

        setAlmacenes(almacenes)
        setRows(data)
    }, [token, tokenCompany])

    const deleteRow = (id) => {
        const ids_solicitudes = JSON.parse(localStorage.getItem('SOL_SEL'))
        const newRows = rows.filter(row => row.id !== id)
        const ids = ids_solicitudes.filter(idSol => idSol !== id)
        localStorage.setItem('SOL_SEL', JSON.stringify(ids))
        setRows(newRows)
    }

    const handleOpenConfirm = (row) => {
        setRowSave(row)
        setOpenDialog(true)
    }

    const handleGuardar = async () => {
        setOpenDialog(false)
        const detalle = [...rowSave.detalle]
        const articulos = []
        delete rowSave.detalle
        detalle.forEach(item => {
            if (item.has_serie) {
                for (let i = 0; i < item.picking; i++) {
                    const articulo = {...item}
                    articulo.picking = 1
                    articulos.push(articulo)
                }
            } else {
                articulos.push(item)
            }
        })
        rowSave.detalle = articulos
        const response = await guardarDespacho(rowSave, token, tokenCompany)
        if (!response.success) {
            let articulos = detalle
            response.data.forEach(item => {
                articulos = articulos.map(articulo => {
                    if (articulo.id === item.id)
                        articulo.stock_error = true
                    return articulo
                })
            })

            const index = rows.findIndex(row => row.id === rowSave.id)
            const newRows = [...rows]
            newRows[index].detalle = articulos;
            setRows(newRows)
        } else {
            deleteRow(rowSave.id)
        }
        setAlert(response)
        setOpenAlert(true)
    }

    React.useEffect(() => {
        loadPage()
    }, [loadPage, token, tokenCompany])

    return <Container fixed>
        <Grid container>
            <Grid item xs={12} sm={12}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Preparar pedido
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <TableContainer component={Paper}>
                    {rows.map((row, index) => {
                        return <Table aria-label="collapsible table" key={row.codigo}>
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell sx={{ width: 5 }}/>
                                    <TableCell align="center"># Solicitud</TableCell>
                                    <TableCell align="center">Almacen Solicitante</TableCell>
                                    <TableCell align="center">R. de Almacen</TableCell>
                                    <TableCell align="center" sx={{width: 140}}>Estado</TableCell>
                                    <TableCell align="center">F. Solicitud</TableCell>
                                    <TableCell align="center" sx={{ width: 200 }}>Almacén Solicitado</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>F. Entrega</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>Horario</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Row row={row}
                                     almacenes={almacenes}
                                     openConfirm={handleOpenConfirm}/>
                            </TableBody>
                        </Table>
                    })}
                </TableContainer>
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
            body='¿Deseas preparar pedido?'
            actions={
                <div>
                    <Button onClick={() => setOpenDialog(false)}>No</Button>
                    <Button onClick={handleGuardar}>Si</Button>
                </div>
            }
        />
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openAlert}
            key="top_left"
            autoHideDuration={6000}
            onClose={() => setOpenAlert(false)}
        >
            <Alert severity={alert.severity}
                   onClose={() => setOpenAlert(false)}
                   sx={{ width: '100%' }}>
                {alert.title ? <AlertTitle>{alert.title}</AlertTitle> : ''}
                {alert.message}
            </Alert>
        </Snackbar>
    </Container>
}

export default DespachoSolicitudTransferenciaPage
