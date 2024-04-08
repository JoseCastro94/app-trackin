import { useTheme } from "@mui/material/styles";
import * as React from "react";
import {
    Alert, AlertTitle,
    Box,
    Button, ButtonGroup,
    Collapse,
    Container,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import { generarPdfDevolucion } from "../../services/Despacho";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {CheckBox, Print, Upload} from "@mui/icons-material";
import {IconPaperclip} from "@tabler/icons";
import MainModal from "../../ui-component/modals/MainModal";
import { guardarDevolucion, notificarDevolucion } from "../../services/Devolucion";
import { listarPorCodigoDeSolicitudesDevolucion } from "../../services/Solicitud";
import { listarParametros } from "../../services/Parametro";
import DialogMain from "../../ui-component/alerts/DialogMain";
import ModalArchivos from "../shared/ModalArchivos";
import {modeContext} from "../../context/modeContext";

const Row = (props) => {
    const { row, openModal, openModalMotivo, openConfirm, openModalArchivos, token, tokenCompany } = props;
    const almacenes = row.detalle.reduce((previousValue, item) => {
        if (!previousValue.find(almacen => almacen.id === item.id_almacen))
            previousValue.push({ id: item.id_almacen, nombre: item.almacen })
        return previousValue
    }, [])
    const [selectedAlmacen, setSelectedAlmacen] = React.useState('todos');
    const [open, setOpen] = React.useState(false);
    const [detalle, setDetalle] = React.useState([]);
    const [comentario, setComentario] = React.useState(row.comentario);

    const handleChangeCantidadDevolucion = (item, value) => {
        if (Number(value) > Number(item.cantidad) || Number(value) < 0) return
        const newDetalle = detalle.map(el => {
            if (item.id === el.id) {
                el.checked_commentartario = (Number(value) < Number(item.cantidad))
                el.cantidad_devolucion = value
            }
            return el
        })
        setDetalle(newDetalle)
    }

    const handleChangeComentario = (value) => {
        row.comentario = value
        setComentario(value)
    }

    const print = async (row) => {
        const pdf = await generarPdfDevolucion(row, token, tokenCompany)
        window.open(URL.createObjectURL(pdf))
    }

    React.useEffect(() => {
        setDetalle(row.detalle)
    }, [row.detalle])

    return <React.Fragment>
        <TableRow sx={{
            'td > p': { p: 0, m: 0 },
            'td, th': { bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white" }
        }}>
            <TableCell width={15} sx={{ bgcolor: `${row.color} !important` }}></TableCell>
            <TableCell align="center"><p>{row.codigo}</p></TableCell>
            <TableCell align="center"><p>{row.cuenta}</p></TableCell>
            <TableCell align="center"><p>{row.asignado}</p></TableCell>
            <TableCell align="center"><p>{row.num_doc}</p></TableCell>
            <TableCell align="center" sx={{
                bgcolor: `${row.color}!important`,
                color: "white",
                fontSize: "12px"
            }}>{row.estado}</TableCell>
            <TableCell align="center">
                {almacenes.length > 1 ?
                    <Select
                        value={selectedAlmacen}
                        size={"small"}
                        fullWidth
                        onChange={(event) => {
                            setSelectedAlmacen(event.target.value)
                        }}
                    >
                        <MenuItem value="todos">-- Todos --</MenuItem>
                        {almacenes.map((almacen, index) => (
                            <MenuItem key={index} value={almacen.id}>{almacen.nombre}</MenuItem>
                        ))}
                    </Select> : <p>{row.almacen}</p>}
            </TableCell>
            <TableCell align="center"><p>{row.fecha}</p></TableCell>
            <TableCell>
                <IconButton color="primary" aria-label="Cargo" onClick={() => openModal(row)}>
                    <CheckBox />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton color="primary" aria-label="Imprimir" onClick={() => print(row)}>
                    <Print />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton color="primary" aria-label="Guia">
                    <IconPaperclip />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton color="primary"
                            aria-label="Subir"
                            onClick={() => openModalArchivos(row.id, true)}>
                    <Upload/>
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={15}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow sx={{ 'td, th': { py: 0.2, px: 0.2, border: 0 } }}>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell align="center">Cod. Prod.</TableCell>
                                    <TableCell align="center">Serie</TableCell>
                                    <TableCell align="center">P. Asignada</TableCell>
                                    <TableCell align="center">Devolución</TableCell>
                                    <TableCell align="center">Plazo Dev.</TableCell>
                                    <TableCell align="center">Evaluación</TableCell>
                                    <TableCell align="center">Cant. Entreg.</TableCell>
                                    <TableCell align="center">Cant. Dev</TableCell>
                                    <TableCell align="center">Almacén</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalle.filter(item => selectedAlmacen !== 'todos' ? item.id_almacen === selectedAlmacen : item).map((item) => (
                                    <TableRow key={item.id} sx={{
                                        'td > p': { px: 1, fontSize: "12px", margin: "0px" },
                                        'td, th': { bgcolor: "grey.200", px: 0, py: 0.5, border: 2, borderRadius: "10px", borderColor: "white" }
                                    }}>
                                        <TableCell width={15} sx={{ bgcolor: "#000064 !important" }} />
                                        <TableCell>
                                            <p>{item.descripcion}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.codigo}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.serie}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.num_doc}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.devolucion}</p>
                                        </TableCell>
                                        <TableCell align="center">
                                            <p>INDEFINIDO</p>
                                        </TableCell>
                                        <TableCell align="center">
                                            <p>{item.evaluacion}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.cantidad}</p>
                                        </TableCell>
                                        <TableCell sx={{ "input": { padding: "4px 8px", textAlign: "right" }, textAlign: "center" }}>
                                            {row.estado === 'Entregado' ?
                                                <p>{item.cantidad_devolucion}</p> :
                                                <ButtonGroup aria-label="outlined primary button group" fullWidth>
                                                    <TextField
                                                        type="number"
                                                        id="outlined-basic"
                                                        sx={{ width: 60 }}
                                                        onChange={(event) => {
                                                            return handleChangeCantidadDevolucion(item, event.target.value)
                                                        }}
                                                        value={item.cantidad_devolucion} />
                                                    <IconButton color="primary"
                                                                aria-label="Cargo"
                                                                size={"small"}
                                                                disabled={item.cantidad <= item.cantidad_devolucion && item.cantidad_devolucion !== 0}
                                                                onClick={() => openModalMotivo(row.id, item.id)}>
                                                        <CheckBox/>
                                                    </IconButton>
                                                </ButtonGroup>
                                            }
                                        </TableCell>
                                        <TableCell><p>{item.almacen}</p></TableCell>
                                        <TableCell align="center"><p>{item.estado}</p></TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ 'div > fieldset': { borderRadius: "10px" } }}>
                                    <TableCell colSpan={9} sx={{ "input": { px: 1, py: 1 } }}>
                                        <TextField
                                            onChange={(event) => handleChangeComentario(event.target.value)}
                                            value={comentario}
                                            id="outlined-basic"
                                            sx={{ width: "100%" }}
                                            disabled={row.estado === 'Entregado'}
                                            placeholder="Escribe aquí tus comentarios" />
                                    </TableCell>
                                    <TableCell colSpan={2} align="right">
                                        <Button size="small" variant="contained"
                                            disabled={row.estado === 'Entregado' || !row.detalle.some(item => item.cantidad_devolucion) || (selectedAlmacen === 'todos' && almacenes.length > 1)}
                                            onClick={() => {
                                                row.comentario = comentario
                                                openConfirm(row)
                                            }}>Registrar Recepción</Button>
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

const DevolucionSolicitudPage = () => {
    const theme = useTheme()
    const [rows, setRows] = React.useState([])
    const [rowSave, setRowSave] = React.useState(rows[0])
    const [motivos, setMotivos] = React.useState([])
    const [openFind, setOpenFind] = React.useState(false)
    const [openModalMotivo, setOpenModalMotivo] = React.useState(false)
    const [rowModal, setRowModal] = React.useState(rows[0])
    const [idMotivo, setIdMotivo] = React.useState('')
    const [comentarioMotivo, setComentarioMotivo] = React.useState('')
    const [openDialog, setOpenDialog] = React.useState(false)
    const [openAlert, setOpenAlert] = React.useState(false)
    const [alert, setAlert] = React.useState({ message: '', severity: 'success' })
    const [openModalArchivos, setOpenModalArchivos] = React.useState(false)
    const [rowId, setRowId] = React.useState('')
    const { token, tokenCompany } = React.useContext(modeContext)
    const handleCloseFind = () => setOpenFind(false)
    const handleCloseModalMotivo = () => setOpenModalMotivo(false)
    const handleOpenFind = (row) => {
        setRowModal(row)
        setOpenFind(true)
    }

    const load = React.useCallback(async () => {
        const ids_solicitudes = JSON.parse(localStorage.getItem('SOL_DEV_SEL'))
        let data = await listarPorCodigoDeSolicitudesDevolucion(ids_solicitudes, token, tokenCompany);
        let motivos = await listarParametros(process.env.REACT_APP_ID_GRUPO_PARAMETRO_MOTIVOS_DEVOLUCION_INCOMPLETA, token, tokenCompany);
        setMotivos(motivos)
        setRows(data)
        setRowModal(data[0])
    }, [token, tokenCompany])

    const [rowModalDetalle, setRowModalDetalle] = React.useState(rows[0])
    const handleOpenModalMotivo = (id_row, id_detalle) => {
        const detalle = rows.find(row => row.id === id_row)?.detalle.find(item => item.id === id_detalle)
        setIdMotivo(detalle.id_motivo || '')
        setComentarioMotivo(detalle.comentario_motivo || '')
        setRowModalDetalle({
            id_row,
            id_detalle
        })
        setOpenModalMotivo(true)
    }

    const sendEmail = async () => {
        console.log('data-notificar', rowModal)
        const response = await notificarDevolucion(rowModal, token, tokenCompany)
        setAlert(response)
        setOpenAlert(true)
        handleCloseFind()
    }

    const guardarComentario = () => {
        const newRows = rows.map(row => {
            if (row.id === rowModalDetalle.id_row) {
                row.detalle = row.detalle.map(detalle => {
                    if (detalle.id === rowModalDetalle.id_detalle) {
                        detalle.id_motivo = idMotivo
                        detalle.comentario_motivo = comentarioMotivo
                    }
                    return detalle
                })
            }
            return row
        })
        setRows(newRows)
        setOpenModalMotivo(false)
    }

    const handleOpenConfirm = (row, index) => {
        setRowSave(row)
        setOpenDialog(true)
    }

    const handleOpenModalArchivos = (id) => {
        setRowId(id)
        setOpenModalArchivos(true)
    }

    const handleGuardar = async () => {
        setOpenDialog(false)
        const response = await guardarDevolucion(rowSave, token, tokenCompany)
        if (response.success) {
            const index = rows.findIndex(row => row.id === rowSave.id)
            const newRows = [...rows]
            newRows[index].estado = 'Entregado';
            setRows(newRows)
        }
        setAlert(response)
        setOpenAlert(true)
    }

    React.useEffect(() => {
        load()
    }, [load, token, tokenCompany])

    return <Container fixed>
        <Grid container>
            <Grid item xs={12} sm={12}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Lista de Devoluciones
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <TableContainer component={Paper}>
                    {rows.map((row) => {
                        return <Table aria-label="collapsible table" key={row.id}>
                            <TableHead>
                                <TableRow sx={{ 'td, th': { py: 0.2, px: 0.2, border: 0 } }}>
                                    <TableCell sx={{ width: 5 }} />
                                    <TableCell align="center"># Devolución</TableCell>
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">P. Asignada</TableCell>
                                    <TableCell align="center">Codigo</TableCell>
                                    <TableCell align="center" sx={{ width: 130 }}>Estado</TableCell>
                                    <TableCell align="center" sx={{ width: 200 }}>Almacén</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>F. Dev.</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Cargo</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Imp.</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Guia</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Subir</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Row row={row}
                                     openModal={handleOpenFind}
                                     openModalMotivo={handleOpenModalMotivo}
                                     openConfirm={handleOpenConfirm}
                                     openModalArchivos={handleOpenModalArchivos}
                                     token={token}
                                     tokenCompany={tokenCompany}/>
                            </TableBody>
                        </Table>
                    })}
                </TableContainer>
            </Grid>
        </Grid>
        <MainModal
            open={openFind}
            onClose={handleCloseFind}
            aria_labelledby="modal-find-worker"
            aria_describedby="modal-find-pick-worker"
            style={{ width: 1000, margin: "0px auto" }}
        >
            <div>Despacho #{rowModal?.codigo_despacho}</div>
            <Typography id="modal-find-worker" variant="h3" component="h2">
                Cargo de Entrega
            </Typography>
            <Grid container>
                <Grid item xs={4} sm={4}>
                    <p><strong>Fecha:</strong> {rowModal?.fecha}</p>
                    <p><strong>Hora:</strong> {rowModal?.hora}</p>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <p><strong>DNI:</strong> {rowModal?.num_doc}</p>
                    <p><strong>Lugar:</strong> {rowModal?.almacen}</p>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <p><strong>Persona asignada:</strong> {rowModal?.asignado}</p>
                    <p><strong>Encargado entrega:</strong> </p>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <div style={{ minHeight: 200, width: '100%' }}>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow sx={{ 'td, th': { py: 0.2, px: 0.2, border: 0 } }}>
                                    <TableCell />
                                    <TableCell align="center">Cod. Prod.</TableCell>
                                    <TableCell align="center">Descipción</TableCell>
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">Can. Entregada</TableCell>
                                    <TableCell align="center">Agignada</TableCell>
                                    <TableCell align="center">Devolución</TableCell>
                                    <TableCell align="center">Tiemp. Devol.</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rowModal?.detalle.map((item, index) => (
                                    <TableRow key={index} sx={{
                                        'td > p': { bgcolor: "grey.200", borderRadius: "5px", py: 0.5, px: 0.5, fontSize: "10px", margin: "0px" },
                                        'td, th': { py: 0.2, px: 0.2, border: 0 }
                                    }}>
                                        <TableCell>
                                            <p style={{ backgroundColor: "#000064" }}>&nbsp;</p>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <p>{item?.codigo}</p>
                                        </TableCell>
                                        <TableCell align={"left"}>
                                            <p>{item?.descripcion}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item?.cuenta}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item?.cantidad}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item?.num_doc}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item?.cantidad === item?.devuelto ? 'SI' : 'NO'}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>100 Días</p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <p>Al marcar "Acepto", usted da confirmación que está recibiendo todos los productos y las cantidades especificados lineas arriba y la transferencia de los artículos a su almacén propio.</p>
                </Grid>
                <Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
                    <Button variant="contained" onClick={() => handleCloseFind()} color={"secondary"}>Cancelar</Button>&nbsp;
                    <Button variant="contained" onClick={() => sendEmail()}>Acepto</Button>
                </Grid>
            </Grid>
        </MainModal>

        <MainModal
            open={openModalMotivo}
            onClose={handleCloseModalMotivo}
            aria_labelledby="modal-find-worker-1"
            aria_describedby="modal-find-pick-worker-1"
            style={{ width: '400 !important', margin: "0px auto" }}
        >
            <Typography id="modal-find-worker-1" variant="h3" component="h2">
                Comentario
            </Typography>
            <br />
            <FormControl fullWidth>
                <Select
                    id="select-motivo"
                    displayEmpty
                    value={idMotivo}
                    label="Comentario"
                    onChange={(event) => setIdMotivo(event.target.value)}
                >
                    <MenuItem value="">-- Seleccione --</MenuItem>
                    {motivos.map(motivo => (
                        <MenuItem key={motivo.id} value={motivo.id}>{motivo.nombre}</MenuItem>
                    ))}
                </Select>
                <br />
                <br />
                <TextField
                    id="comentario"
                    value={comentarioMotivo}
                    focused={true}
                    label="Comentario"
                    placeholder="Escriba aquí el motivo"
                    onChange={(event) => setComentarioMotivo(event.target.value)}
                    rows={4}
                    multiline
                />
                <br />
                <Button variant="contained" onClick={() => guardarComentario()}>Guardar</Button>
            </FormControl>
        </MainModal>
        <DialogMain
            open={openDialog}
            title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
            body='¿Deseas registrar la devolución en el sistema?'
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

        <ModalArchivos idModulo={rowId}
                       modulo='devolucion'
                       open={openModalArchivos}
                       handleClose={() => setOpenModalArchivos(false)}
                       onError={(error) => {
                           setAlert(error)
                           setOpenAlert(true)
                       }}/>
    </Container>

}

export default DevolucionSolicitudPage;
