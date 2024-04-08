import {useTheme} from "@mui/material/styles";
import * as React from "react";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Collapse,
    Container,
    Grid,
    IconButton, MenuItem,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {generarPdf, listarDespachos} from "../../services/Despacho";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {CheckBox, Clear, Delete, Print, Upload} from "@mui/icons-material";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import {IconPaperclip, IconSearch} from "@tabler/icons";
import MainModal from "../../ui-component/modals/MainModal";
import {eliminarEntrega, guardarEntrega, notificarEntrega} from "../../services/Entrega";
import ModalSelectItem from "../shared/ModalSelectItem";
import DialogMain from "../../ui-component/alerts/DialogMain";
import ModalArchivos from "../shared/ModalArchivos";

import {useNavigate} from "react-router-dom"
import {modeContext} from "../../context/modeContext";
import {gridSpacing} from "../../store/constant";
import Select from "@mui/material/Select";
import {MobileDatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {listarParametros} from "../../services/Parametro";

const baseURL = process.env.PUBLIC_URL

const Row = (props) => {
    const navigate = useNavigate()
    const { row, openModal, openModalSelectItem, openConfirm, openModalArchivos, token, tokenCompany } = props;
    const [open, setOpen] = React.useState(false);
    const [detalle, setDetalle] = React.useState([]);
    const [comentario, setComentario] = React.useState(row.comentario);

    const handleChangeCantidadEntrega = (item, value) => {
        if (value > item.cantidad_picking || value < 0) return
        const newDetalle = detalle.map(el => {
            if (item.id_detalle_despacho === el.id_detalle_despacho) el.entrega = value
            return el
        })
        setDetalle(newDetalle)
    }

    const handleClearSerie = (item) => {
        const newDetalle = detalle.map(el => {
            if (item.id_detalle_despacho === el.id_detalle_despacho) {
                el.serie = ''
                el.entrega = 0
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
        const blob = await generarPdf(row, token, tokenCompany)
        window.open(URL.createObjectURL(blob))
    }

    React.useEffect(() => {
        setDetalle(row.detalle)
    }, [row.detalle])
    

    const handleGuide = (row) => {
        if (row.IdGuia) {
            navigate(`${baseURL}/guide/register/${row.IdGuia}`)
        } else {
            navigate(`${baseURL}/guide/register?IdDespacho=${row.id}`)
        }
    }

    return <React.Fragment>
        <TableRow sx={{
            'td > p': { p: 0, m: 0 },
            'td, th': { bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white" }
        }}>
            <TableCell width={15} sx={{ bgcolor: `${row.color} !important` }}></TableCell>
            <TableCell align="center"><p>{row.codigo_despacho}</p></TableCell>
            <TableCell align="center"><p>{row.codigo_solicitud}</p></TableCell>
            <TableCell align="center"><p>{row.cuenta}</p></TableCell>
            <TableCell align="center"><p>{row.documento} - {row.asignado}</p></TableCell>
            <TableCell align="center" sx={{
                bgcolor: `${row.color}!important`,
                color: "white",
                fontSize: "12px"
            }}>{row.estado}</TableCell>
            <TableCell align="center"><p>{row.almacen}</p></TableCell>
            <TableCell align="center"><p>{row.fecha}</p></TableCell>
            <TableCell align="center"><p>{row.hora}</p></TableCell>
            <TableCell>
                <IconButton color="primary"
                    aria-label="Cargo"
                    onClick={() => openModal(row)}
                    disabled={row.estado !== 'Entregado'}>
                    <CheckBox />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton color="primary"
                    aria-label="Imprimir"
                    onClick={() => print(row)}
                    disabled={row.estado !== 'Entregado'}>
                    <Print />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton color="primary"
                    aria-label="Guia"
                    disabled={row.estado === 'Cancelado'}
                    onClick={() => handleGuide(row)}
                >
                    <IconPaperclip />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton color="primary"
                    disabled={row.estado !== 'Entregado'}
                    aria-label="Subir"
                    onClick={() => openModalArchivos(row.id, true)}>
                    <Upload />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton color="primary"
                    aria-label="Eliminar"
                    disabled={row.estado === 'Entregado' || row.estado === 'Cancelado'}
                    onClick={() => openConfirm(row, 'DELETE')}>
                    <Delete />
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
                                    <TableCell align="center" width={120}>Serie</TableCell>
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">Picking</TableCell>
                                    <TableCell align="center">Entregado</TableCell>
                                    <TableCell align="center">Almacén</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalle.map((item, index) => (
                                    <TableRow key={item.id_detalle_despacho} sx={{
                                        'td > p': { px: 1, fontSize: "12px", margin: "0px" },
                                        'td, th': { bgcolor: "grey.200", px: 0, py: 0.5, border: 2, borderRadius: "10px", borderColor: "white" }
                                    }}>
                                        <TableCell width={15} sx={{ bgcolor: "#000064 !important" }} />
                                        <TableCell>
                                            <p>{item.nombre_producto}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.codigo_producto}</p>
                                        </TableCell>
                                        <TableCell sx={{ "input": { padding: "4px 8px", textAlign: "right" }, textAlign: "center" }}>
                                            {
                                                item.has_serie ?
                                                    <div>
                                                        <TextField
                                                            disabled={false}
                                                            type="text"
                                                            id="serie"
                                                            sx={{ width: 80 }}
                                                            onClick={() => {
                                                                if (row.estado === 'Entregado') return
                                                                openModalSelectItem(row.id, index, true)
                                                            }}
                                                            value={item.serie} />
                                                        {
                                                            row.estado !== 'Entregado' ?
                                                                <IconButton color="error"
                                                                    size={"small"}
                                                                    aria-label="Eliminar"
                                                                    sx={{ padding: '2px' }}
                                                                    onClick={() => handleClearSerie(item)}>
                                                                    <Clear />
                                                                </IconButton>
                                                                : null
                                                        }
                                                    </div>
                                                    : 'S/N'
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.cuenta}</p>
                                        </TableCell>
                                        <TableCell align="center">
                                            <p>{item.cantidad_picking}</p>
                                        </TableCell>
                                        {row.estado === 'Entregado' || row.estado === 'Cancelado' ?
                                            <TableCell align="right">
                                                <p>{item.cantidad_entregada > 0 ? item.cantidad_entregada : item.entrega}</p>
                                            </TableCell> :
                                            <TableCell sx={{ "input": { padding: "4px 8px", textAlign: "right" }, textAlign: "center" }}>
                                                <TextField
                                                    type="number"
                                                    disabled={detalle.estado === 'Entregado' || !!item.has_serie}
                                                    id="outlined-basic"
                                                    sx={{ width: 60 }}
                                                    onChange={(event) => {
                                                        return handleChangeCantidadEntrega(item, event.target.value)
                                                    }}
                                                    value={item.entrega} />
                                            </TableCell>
                                        }
                                        <TableCell><p>{item.almacen}</p></TableCell>
                                        <TableCell align="center"><p>{item.estado}</p></TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ 'div > fieldset': { borderRadius: "10px" } }}>
                                    <TableCell colSpan={row.estado !== 'Entregado' ? 8 : 7} sx={{ "input": { px: 1, py: 1 } }}>
                                        <TextField
                                            onChange={(event) => handleChangeComentario(event.target.value)}
                                            value={comentario}
                                            id="outlined-basic"
                                            sx={{ width: "100%" }}
                                            disabled={row.estado === 'Entregado' || row.estado === 'Cancelado'}
                                            placeholder="Escribe aquí tus comentarios" />
                                    </TableCell>
                                    <TableCell colSpan={2} align="right">
                                            <Button size="small" variant="contained"
                                                disabled={row.estado === 'Entregado' || row.estado === 'Cancelado' || detalle.every(item => Number(item.entrega) === 0)}
                                                onClick={() => {
                                                    row.comentario = comentario
                                                    row.detalle = detalle
                                                    openConfirm(row)
                                                }}>Registrar Entrega</Button>
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
const now = moment()
const EntregaSolicitudPage = () => {
    const theme = useTheme()
    const dateNow = now.format("YYYY-MM-DD HH:mm")
    const [rows, setRows] = React.useState([])
    const [rowSave, setRowSave] = React.useState(rows[0])
    const [openFind, setOpenFind] = React.useState(false)
    const [openModalArchivos, setOpenModalArchivos] = React.useState(false)
    const [openModalSelectItem, setOpenModalSelectItem] = React.useState(false)
    const [rowModal, setRowModal] = React.useState(rows[0])
    const [paramsControlSerie, setParamsControlSerie] = React.useState(rows[0])
    const [rowId, setRowId] = React.useState('')
    const [index, setIndex] = React.useState(0)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [openAlert, setOpenAlert] = React.useState(false)
    const [alert, setAlert] = React.useState({ message: '', severity: 'success' })
    const [action, setAction] = React.useState('SAVE')
    const { token, tokenCompany } = React.useContext(modeContext)
    const [filtro, setFiltro] = React.useState('');
    const [filtroPorEstado, setFiltroPorEstado] = React.useState(' ');
    const [estados, setEstados] = React.useState([])
    const [dateIni, setDateIni] = React.useState(dateNow);
    const [dateFin, setDateFin] = React.useState(dateNow);
    const handleCloseFind = () => setOpenFind(false)
    const handleOpenFind = (row) => {
        console.dir('row');
        console.dir(row);
        setRowModal(row)
        setOpenFind(true)
    }
    const handleOpenModalSelectItem = (row_id, index, value) => {
        setIndex(index)
        setRowId(row_id)
        console.dir('handleOpenModalSelectItem [rows]');
        console.dir(rows);

        console.dir('row_id');
        console.dir(row_id);
        
        console.dir('value');
        console.dir(value);
        const series = rows.reduce((before, actual) => {
            let series = actual.detalle.filter(detalle => detalle.estado === "Programado" && detalle.serie)
                .map(detalle => detalle.serie)
            series = [...new Set(series)]
            return before.concat(series)
        }, [])
        const detalle = rows.find(item => item.id === row_id).detalle[index];
        setParamsControlSerie({
            id_almacen: detalle.id_almacen,
            id_negocio: detalle.id_negocio,
            id_articulo: detalle.id_articulo,
            series
        })
        console.dir('paramsControlSerie');
        console.dir(paramsControlSerie);
        setOpenModalSelectItem(value)
    }

    const handleOpenModalArchivos = (id) => {
        setRowId(id)
        setOpenModalArchivos(true)
    }

    const columnsModalSelectedItem = [
        { field: 'code', headerName: 'Código', width: 200 },
        { field: 'name', headerName: 'Artículo', width: 400 },
        { field: 'serie', headerName: 'Serie', width: 100 }
    ]

    const listarEstados = React.useCallback(async () => {
        let estados = await listarParametros(process.env.REACT_APP_ID_GRUPO_PARAMETRO_ESTADOS_DESPACHO, token, tokenCompany)
        setEstados(estados)
    }, [token, tokenCompany])

    const busquedaConFiltros = async () => {
        let data = await listarDespachos({
            fechaIni: moment(dateIni).format("YYYY-MM-DD"),
            fechaFin: moment(dateFin).format("YYYY-MM-DD"),
            estado: filtroPorEstado.trim(),
            filtro: filtro.trim(),
            token, tokenCompany
        });
        console.dir('busquedaConFiltros (DATA): ' );
        console.dir(data);
        setRows(data)
        setRowModal(data[0])
    }

    const listarDespachoSolicitudes = React.useCallback(async () => {
        let data = await listarDespachos({
            token,
            tokenCompany,
            fechaIni: moment().format("YYYY-MM-DD"),
            fechaFin: moment().format("YYYY-MM-DD")
        });
        console.dir('listarDespachoSolicitudes (DATA): ' );
        console.dir(data);
        setRows(data)
        setRowModal(data[0])
    }, [token, tokenCompany])

    const sendEmail = async () => {
        const response = await notificarEntrega(rowModal, token, tokenCompany)
        setAlert(response)
        setOpenAlert(true)
        handleCloseFind()
    }

    const handleSelectedArticle = async (article) => {
        const despachos = rows.map(despacho => {
            if (despacho.id === rowId) {
                despacho.detalle = despacho.detalle.map((item, index_detalle) => {
                    if (index_detalle === index) {
                        item.serie = article.serie
                        item.entrega = 1
                        item.id_control_serie = article.id
                    }
                    return item
                })
            }
            console.dir('despacho');
            console.dir(despacho);
            return despacho
        })
        console.dir('handleSelectedArticle (despachos): ' );
        console.dir(despachos);
        setRows(despachos)
    }

    const handleOpenConfirm = (row, action = 'SAVE') => {
        setAction(action)
        setRowSave(row)
        setOpenDialog(true)
    }

    const handleEliminarEntrega = async () => {
        setOpenDialog(false)
        const response = await eliminarEntrega(rowSave.id, token, tokenCompany)
        if (response.success) {
            const newRows = rows.filter(row => row.id !== rowSave.id)
            setRows(newRows)
        }
        setAlert(response)
        setOpenAlert(true)
    }

    const handleGuardarEntrega = async () => {
        setOpenDialog(false);
    
        const response = await guardarEntrega(rowSave, token, tokenCompany);
        if (response.success) {
            const updatedRows = rows.map((row) => {
                if (row.id === rowSave.id) {
                    const updatedDetalle = row.detalle.map((detalle) => ({
                        ...detalle,
                        estado: 'Entregado',
                    }));
                    return { ...row, estado: 'Entregado', detalle: updatedDetalle };
                }
                return row;
            });
            setRows(updatedRows);
        }
        setAlert(response);
        setOpenAlert(true);
    };

    const handleChangeDate = (isIni, date) => {
        if (isIni) {
            setDateIni(date)
        } else {
            setDateFin(date)
        }
    }

    React.useEffect(() => {
        listarDespachoSolicitudes()
        listarEstados()
    }, [listarDespachoSolicitudes, listarEstados, token, tokenCompany])

    return <Container fixed>
        <Grid container>
            <Grid item xs={12} sm={12}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Lista de Entrega
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} sx={{mt: 2, mb: 2}}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={4} sm={4}>
                        <TextField type={"text"}
                                   value={filtro}
                                   size={"small"}
                                   onChange={(event) => {
                                       setFiltro(event.target.value)
                                   }}
                                   fullWidth
                                   placeholder='Buscar por "Palabra Clave", "Nombre", "Código", etc.'/>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDatePicker
                                inputFormat="dd/MM/yyyy"
                                closeOnSelect={true}
                                value={dateIni}
                                disableFuture
                                onChange={(date) => handleChangeDate(true, date)}
                                renderInput={(params) => <TextField {...params} fullWidth size={"small"} sx={{textAlign: "center"}}/>}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDatePicker
                                inputFormat="dd/MM/yyyy"
                                minDate={dateIni}
                                value={dateFin}
                                onChange={(date) => handleChangeDate(false, date)}
                                renderInput={(params) => <TextField {...params} fullWidth size={"small"} sx={{textAlign: "center"}}/>}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <Select
                            value={filtroPorEstado}
                            size={"small"}
                            fullWidth
                            onChange={(event) => {
                                setFiltroPorEstado(event.target.value)
                            }}
                        >
                            <MenuItem value=" ">Todos los estados</MenuItem>
                            {estados.map((estado, index) => (
                                <MenuItem key={index} value={estado.id}>{estado.nombre}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1} sm={1}>
                        <IconButton size={"small"}
                                    onClick={ async () => {
                                        await busquedaConFiltros()
                                    }}>
                            <IconSearch/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <br/>
            <Grid item xs={12} sm={12}>
                <TableContainer component={Paper}>
                    {rows.map((row) => {
                        return <Table aria-label="collapsible table" key={row.id}>
                            <TableHead>
                                <TableRow sx={{ 'td, th': { py: 0.2, px: 0.2, border: 0 } }}>
                                    <TableCell sx={{ width: 5 }} />
                                    <TableCell align="center"># Despacho</TableCell>
                                    <TableCell align="center"># Solicitud</TableCell>
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">P. Asignada</TableCell>
                                    <TableCell align="center" sx={{ width: 130 }}>Estado</TableCell>
                                    <TableCell align="center" sx={{ width: 200 }}>Almacén</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>F. Entrega</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>Horario</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Cargo</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Imp.</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Guia</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Subir</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Elim.</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Row row={row}
                                     openModal={handleOpenFind}
                                     openModalSelectItem={handleOpenModalSelectItem}
                                     openModalArchivos={handleOpenModalArchivos}
                                     openConfirm={handleOpenConfirm}
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
                    <p><strong>DNI:</strong> </p>
                    <p><strong>Lugar:</strong> </p>
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
                                    <TableCell align="center">Serie</TableCell>
                                    <TableCell align="center">Descipción</TableCell>
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">Can. Entregada</TableCell>
                                    <TableCell align="center">Agignada</TableCell>
                                    <TableCell align="center">Devolución</TableCell>
                                    <TableCell align="center">Tiemp. Devol.</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rowModal?.detalle.map((item) => (
                                    <TableRow key={item.id_detalle_despacho} sx={{
                                        'td > p': { bgcolor: "grey.200", borderRadius: "5px", py: 0.5, px: 0.5, fontSize: "10px", margin: "0px" },
                                        'td, th': { py: 0.2, px: 0.2, border: 0 }
                                    }}>
                                        <TableCell>
                                            <p style={{ backgroundColor: "#000064" }}>&nbsp;</p>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <p>{item.codigo_producto}</p>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <p>{item.serie ? item.serie : 'S/N'}</p>
                                        </TableCell>
                                        <TableCell align={"left"}>
                                            <p>{item.nombre_producto}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.cuenta}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.cantidad_entregada}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.cuenta}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.cuenta}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.cuenta}</p>
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
        <ModalSelectItem
            open={openModalSelectItem}
            handleClose={() => { handleOpenModalSelectItem(rows[0].id, 0, false) }}
            handleSelectedArticle={handleSelectedArticle}
            url={process.env.REACT_APP_API + 'business/api/control-series'}
            method={'POST'}
            title={'Lista de series'}
            columns={columnsModalSelectedItem}
            param={paramsControlSerie}
        />
        <DialogMain
            open={openDialog}
            title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
            }
            body={action === 'SAVE' ? '¿Deseas registrar la entrega en el sistema?' :
                `¿Deseas eliminar el despacho ${rowSave.codigo_despacho} del sistema?`
            }
            actions={
                <div>
                    <Button onClick={() => setOpenDialog(false)}>No</Button>
                    <Button onClick={() => {
                        if (action === 'SAVE') {
                            handleGuardarEntrega()
                        } else {
                            handleEliminarEntrega()
                        }
                    }}>Si</Button>
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

        <ModalArchivos idModulo={rowId} modulo='entrega' open={openModalArchivos} handleClose={() => setOpenModalArchivos(false)} />
    </Container>
}

export default EntregaSolicitudPage;
