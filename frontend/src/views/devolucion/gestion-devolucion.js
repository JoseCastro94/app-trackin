import {useTheme} from "@mui/material/styles";
import * as React from "react";
import {
    Box, Button, Collapse,
    Container,
    Grid, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {MobileDatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {listarPorCodigoDeSolicitudesDevolucion} from "../../services/Solicitud";
import {guardarDevolucion} from "../../services/Despacho";

const Row = (props) => {
    const format = "YYYY-MM-DD HH:mm"
    const { row, deleteRow } = props;
    const [open, setOpen] = React.useState(false);
    const [detalle, setDetalle] = React.useState([]);
    const [comentario, setComentario] = React.useState(row.comentario);

    row.fecha_despacho = row.fecha_despacho || moment().format(format)
    const [fecDes, setFecDes] = React.useState(row.fecha_despacho);

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
        if (value > total || value > item.stock || value < 0) return
        const newDetalle = detalle.map(el => {
            if (item.id === el.id) el.picking = value
            return el
        })
        setDetalle(newDetalle)
    }

    const handleChangeComentario = (value) => {
        console.log('handleChangeComentario', row)
        row.comentario = value
        setComentario(value)
    }

    const handleSaveDevolucion = async (row) => {
        row.comentario = comentario
        row.fecha_despacho = moment(row.fecha_despacho).format()
        // eslint-disable-next-line no-restricted-globals
        if (confirm('¿Deseas registrar devolución en el sistema?')) {
            const response = await guardarDevolucion(row)
            if (!response.success) {
                let articulos = detalle
                response.data.map(item => {
                    articulos = articulos.map(articulo => {
                        if (articulo.id === item.id)
                            articulo.stock_error = true
                        return articulo
                    })
                })
                setDetalle(articulos)
            } else {
                deleteRow(row.id)
            }
            alert(response.message)
        }
    }

    React.useEffect(() => {
        setDetalle(row.detalle)
    }, [row.detalle])

    return <React.Fragment>
        <TableRow sx={{
            'td > p': {p: 0, m: 0},
            'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
        }}>
            <TableCell width={15} sx={{bgcolor: `${row.color} !important`}}></TableCell>
            <TableCell align="center"><p>{row.codigo}</p></TableCell>
            <TableCell align="center"><p>{row.cuenta}</p></TableCell>
            <TableCell align="center">
                {row.asignado}
            </TableCell>
            <TableCell align="center" sx={{
                bgcolor: `${row.color}!important`,
                color: "white",
                fontSize: "12px"
            }}>{row.estado}</TableCell>
            <TableCell align="center"><p>{row.fecha}</p></TableCell>
            <TableCell align="center">
                {row.almacen}
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
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell align="center">Codigo</TableCell>
                                    <TableCell align="center">Asignado</TableCell>
                                    <TableCell align="center">Cuenta</TableCell>
                                    <TableCell align="center">C. Sol</TableCell>
                                    <TableCell align="center">C. Dev</TableCell>
                                    <TableCell align="center">Cant</TableCell>
                                    <TableCell align="center">Stock</TableCell>
                                    <TableCell align="center">Almacén</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalle.map((item) => (
                                    <TableRow key={item.id} sx={{
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
                                        <TableCell align="right">
                                            <p>{item.documento}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.cuenta}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.cantidad}</p>
                                        </TableCell>
                                        <TableCell align="center">
                                            <p>{item.cantidad_entrega}</p>
                                        </TableCell>
                                        <TableCell sx={{"input": {padding: "4px 8px", textAlign: "right"}, textAlign: "center"}}>
                                            {item.cantidad === item.cantidad_entrega ?
                                                <p style={{textAlign: "center"}}>--</p> :
                                                <TextField
                                                    type="number"
                                                    id="outlined-basic"
                                                    sx={{ width: 60 }}
                                                    onChange={(event) => {
                                                        return handleChangePicking(item, event.target.value)
                                                    }}
                                                    value={item.picking}/>
                                            }
                                        </TableCell>
                                        <TableCell align="right"><p>{item.stock}</p></TableCell>
                                        <TableCell><p>{item.almacen}</p></TableCell>
                                        <TableCell align="center"><p>{item.estado}</p></TableCell>
                                    </TableRow>
                                ))}
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
                                                disabled={ !row.almacen }
                                                onClick={() => handleSaveDevolucion(row)}>Programar Devolución</Button>
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

const GestionarDevolucionPage = () => {
    const theme = useTheme()
    const [rows, setRows] = React.useState([])
    const ids_solicitudes = JSON.parse(localStorage.getItem('SOL_DEV_SEL'))
    const id_usuario = JSON.parse(localStorage.getItem('USER_ID'))

    const load = async () => {
        let data = await listarPorCodigoDeSolicitudesDevolucion(ids_solicitudes);
        setRows(data)
    }

    const deleteRow = (id) => {
        const newRows = rows.filter(row => row.id !== id)
        const ids = ids_solicitudes.filter(idSol => idSol !== id)
        localStorage.setItem('SOL_SEL', JSON.stringify(ids))
        setRows(newRows)
    }

    React.useEffect(() => {
        load()
    }, [])

    return <Container fixed>
        <Grid container>
            <Grid item xs={12} sm={12}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Gestinar Devoluciones
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <TableContainer component={Paper}>
                    {rows.map((row, index) => {
                        return <Table aria-label="collapsible table" key={row.codigo}>
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell sx={{ width: 5 }}/>
                                    <TableCell align="center"># Devolución</TableCell>
                                    <TableCell align="center">Cuenta</TableCell>
                                    <TableCell align="center">Solicitante</TableCell>
                                    <TableCell align="center" sx={{width: 140}}>Estado</TableCell>
                                    <TableCell align="center">F. Solicitud</TableCell>
                                    <TableCell align="center" sx={{ width: 200 }}>Almacén</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>F. Entrega</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>Horario</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Row row={row} deleteRow={deleteRow} />
                            </TableBody>
                        </Table>
                    })}
                </TableContainer>
            </Grid>
        </Grid>
    </Container>
}

export default GestionarDevolucionPage