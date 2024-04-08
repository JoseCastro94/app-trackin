import {useTheme} from "@mui/material/styles";
import * as React from "react";
import {
    Alert, AlertTitle,
    Box,
    Button, ButtonGroup, ClickAwayListener, Collapse,
    Container,
    Grid, Grow, IconButton, MenuItem, MenuList,
    Paper, Popper, Snackbar, Stack, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {MobileDatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {ArrowDropDown, CheckBox, Print, Search} from "@mui/icons-material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useNavigate} from "react-router-dom";
import {importarMercaderia, listarMovimientoMercancia} from "../../services/MovimientoMercancia";
import {generarPdfIngresoMercaderia} from "../../services/MovimientoMercancia";
import {useRef} from "react";
import {validarFile} from "../utilities/Util";
import MainModal from "../../ui-component/modals/MainModal";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {modeContext} from "../../context/modeContext";

const Row = (props) => {
    const { row, token, tokenCompany, index } = props;
    const [open, setOpen] = React.useState(false);
    const [detalle, setDetalle] = React.useState([]);

    const print = async (row) => {
        const pdf = await generarPdfIngresoMercaderia(row, token, tokenCompany)
        window.open(URL.createObjectURL(pdf))
    }

    React.useEffect(() => {
        setDetalle(row.DetalleMovimientoMercancia)
    }, [row.DetalleMovimientoMercancia])

    return <React.Fragment>
        <TableRow key={`DETALLE-${index}`} sx={{
                'td > p': {p: 0, m: 0},
                'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
            }}>
            <TableCell width={15} sx={{bgcolor: "#000064 !important"}}></TableCell>
            <TableCell align="center"><p>{row.codigo}</p></TableCell>
            <TableCell align="center"><p>{row.documento}</p></TableCell>
            <TableCell align="center"><p>{row.num_doc}</p></TableCell>
            <TableCell align="center"><p>{row.almacen}</p></TableCell>
            <TableCell align="center"><p>{row.fecha}</p></TableCell>
            <TableCell align="center"><p>{row.hora}</p></TableCell>
            <TableCell align="center"><p>{row.usuario}</p></TableCell>
            <TableCell align="center">
                <IconButton color="primary" aria-label="Cargo" onClick={() => {
                    console.log('Deo ps')
                }}>
                    <CheckBox/>
                </IconButton>
            </TableCell>
            <TableCell align="center">
                <IconButton color="primary" aria-label="Imprimir" onClick={() => print(row)}>
                    <Print/>
                </IconButton>
            </TableCell>
            <TableCell align="center">
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell align="center">Cod. Prod.</TableCell>
                                    <TableCell align="center">Serie</TableCell>
                                    <TableCell align="center">Categoría</TableCell>
                                    <TableCell align="center">Cuenta</TableCell>
                                    <TableCell align="center">Cant.</TableCell>
                                    {/* <TableCell align="center">Stock</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalle.map((item, index) => (
                                    <TableRow key={`${index}-${item.id}`} sx={{
                                        'td > p': {px: 1, fontSize: "12px", margin: "0px"},
                                        'td, th': {bgcolor: "grey.200", px: 0, py: 0.5, border: 2, borderRadius: "10px", borderColor: "white"}
                                    }}>
                                        <TableCell width={15} sx={{bgcolor: "#606060 !important"}}></TableCell>
                                        <TableCell><p>{item.descripcion}</p></TableCell>
                                        <TableCell><p>{item.Articulo.codigo}</p></TableCell>
                                        <TableCell><p>{item.serie ? item.serie : 'N/A'}</p></TableCell>
                                        <TableCell><p>{item.categoria}</p></TableCell>
                                        <TableCell><p>{item.TipoNegocio.cuenta}</p></TableCell>
                                        <TableCell align="right"><p>{item.cantidad}</p></TableCell>
                                        {/* <TableCell align="right"><p>{item.stock}</p></TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </React.Fragment>
}
const now = moment()
const IngresoMercaderiaPage = () => {
    const navigate = useNavigate()
    const dateNow = now.format("YYYY-MM-DD HH:mm")
    const theme = useTheme()
    const inputFile = useRef(null)
    const downloadFile = useRef(null)
    const anchorRef = useRef(null)
    const [open, setOpen] = React.useState(false);
    const [uploading, setUploading] = React.useState(false)
    const [dateIni, setDateIni] = React.useState(dateNow);
    const [dateFin, setDateFin] = React.useState(dateNow);
    const [rows, setRows] = React.useState([])
    const [openAlert, setOpenAlert] = React.useState(false)
    const [alert, setAlert] = React.useState({ message: '', severity: 'success' })
    const [erroresImportacionData, setErroresImportacionData] = React.useState({
        cabeceraSuccess: 0,
        cabeceraErrors: [],
        detalleSuccess: 0,
        detalleErrors: []
    })
    const [openModalErroresImportacionData, setOpenModalErroresImportacionData] = React.useState(false)
    const { token, tokenCompany } = React.useContext(modeContext)

    const handleChangeDate = (isIni, date) => {
        if (isIni) {
            setDateIni(date)
        } else {
            setDateFin(date)
        }
    }

    const load = React.useCallback(async (fechaIni = now.format("YYYY-MM-DD"), fechaFin = now.format("YYYY-MM-DD")) => {
        const data = await listarMovimientoMercancia(fechaIni, fechaFin, token, tokenCompany)
        setRows(data)
    }, [token, tokenCompany])

    const handleImportData = async (e) => {
        setUploading(true)
        const file = validarFile(e)

        if (!file.status) {
            setUploading(false)
            //setAlert2(file)
            //setOpenAlert(true)
            return
        }

        const response = await importarMercaderia(file.data, token, tokenCompany)
        setUploading(false)
        // setPage(0);
        await load()

        if (response.severity === 'info' && !response.success) {
            setErroresImportacionData(response.data)
            setOpenModalErroresImportacionData(true)
        }

        setAlert(response)
        setOpenAlert(true)
        inputFile.current.value = ''
    }

    const handleClose = (event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target)
        ) {
            return;
        }

        setOpen(false);
    }

    const [valueTab, setValueTab] = React.useState('cabecera');
    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    React.useEffect(() => {
        load()
    }, [load, token, tokenCompany])

    return <Container fixed>

        <Grid container>
            <Grid item xs={6} sm={8}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Ingreso Mercadería
                </Typography>
            </Grid>
            <Grid item xs={6} sm={4} style={{textAlign: "right"}}>
                <React.Fragment>
                    <ButtonGroup variant="outlined"
                                 ref={anchorRef}
                                 sx={{ marginRight: "1rem" }}
                                 size={"small"}
                                 aria-label="split button">
                        <Button onClick={() => {
                        }}>{ uploading ? "Cargando..." : "Carga masiva" }</Button>
                        <Button
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={() => {
                                setOpen((prevState) => !prevState)
                            }}
                        >
                            <ArrowDropDown />
                        </Button>
                    </ButtonGroup>
                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                        sx={{zIndex: 1}}
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            <MenuItem
                                                key={"123"}
                                                onClick={() => inputFile.current.click()}
                                            >Importar Plantilla</MenuItem>
                                            <MenuItem
                                                key={"213"}
                                                onClick={() => downloadFile.current.click()}
                                            >Descargar Plantilla</MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </React.Fragment>
                <Button variant="contained" size="small" onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/ingreso-mercaderia/registrar`)}
                >Ingresar</Button>
            </Grid>
        </Grid>
        <br/>
        <Grid container>
            <Grid item xs={6} sm={6}>
                <Typography variant='h6'
                            sx={{ color: theme.palette.secondary.main}}>
                    Historial
                </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={1}
                           direction="row"
                           sx={{"input": {p: 0.5, textAlign: 'center', fontSize: "12px"}}}
                           justifyContent={"flex-end"}
                           alignItems={"center"}>
                        <MobileDatePicker
                            inputFormat="dd/MM/yyyy"
                            value={dateIni}
                            disableFuture
                            onChange={(date) => handleChangeDate(true, date)}
                            renderInput={(params) => <TextField {...params} sx={{width: '20%'}}/>}
                        />
                        <MobileDatePicker
                            inputFormat="dd/MM/yyyy"
                            minDate={dateIni}
                            maxDate={dateNow}
                            value={dateFin}
                            onChange={(date) => handleChangeDate(false, date)}
                            renderInput={(params) => <TextField {...params} sx={{width: '20%'}}/>}
                        />
                        <IconButton color="primary"
                                    aria-label="Buscar"
                                    onClick={() => {
                            load(moment(dateIni).format("YYYY-MM-DD"), moment(dateFin).format("YYYY-MM-DD"))
                        }}>
                            <Search/>
                        </IconButton>
                    </Stack>
                </LocalizationProvider>
            </Grid>
        </Grid>
        <br/>
        <Grid item xs={12} sm={12}>
            <TableContainer component={Paper} style={{borderRadius: "0px"}}>
                {rows.map((row, index) => {
                    return <Table aria-label="collapsible table" key={`TABLE-${index}`}>
                        <TableHead>
                            <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                <TableCell sx={{ width: 5 }}/>
                                <TableCell align="center"># Ingreso</TableCell>
                                <TableCell align="center">Guia/Solped</TableCell>
                                <TableCell align="center"># Doc.</TableCell>
                                <TableCell align="center">Almacén</TableCell>
                                <TableCell align="center" sx={{ width: 100 }}>Fecha</TableCell>
                                <TableCell align="center" sx={{ width: 100 }}>Hora</TableCell>
                                <TableCell align="center">P. Encargada</TableCell>
                                <TableCell align="center" sx={{ width: 50 }}>Doc.</TableCell>
                                <TableCell align="center" sx={{ width: 50 }}>Imp.</TableCell>
                                <TableCell align="center" sx={{ width: 50 }}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <Row row={row}
                                 token={token}
                                 tokenCompany={tokenCompany}
                                 index={index} />
                        </TableBody>
                    </Table>
                })}
            </TableContainer>
        </Grid>
        <MainModal
            open={openModalErroresImportacionData}
            onClose={() => setOpenModalErroresImportacionData(false)}
            aria_labelledby="modal-find-worker"
            aria_describedby="modal-find-pick-worker"
            styleBody={{
                maxHeight: '95%',
                overflowY: 'auto',
                width: '90%'
            }}
        >
            <Typography id="modal-find-worker" variant="h3" component="h2">
                <p>Errores al importar datos</p>
            </Typography>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={valueTab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                            <Tab label="Cabecera" value="cabecera" />
                            <Tab label="Detalle" value="detalle" />
                        </TabList>
                    </Box>
                    <TabPanel value="cabecera">
                        <p>Datos correctos {erroresImportacionData.cabeceraSuccess}</p>
                        <p>Datos con errores {erroresImportacionData.cabeceraErrors.length}</p>
                        <br/>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell/>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">Tipo Ingreso</TableCell>
                                    <TableCell align="center">Tipo Documento</TableCell>
                                    <TableCell align="center">Número</TableCell>
                                    <TableCell align="center">Ruc</TableCell>
                                    <TableCell align="center">Razón Social</TableCell>
                                    <TableCell align="center">Almacen</TableCell>
                                    <TableCell align="center">Correo</TableCell>
                                    <TableCell align="center">LinkDocumento</TableCell>
                                    <TableCell align="center">Observaciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {erroresImportacionData.cabeceraErrors.map((item, index) => (
                                    <TableRow key={`Errores-${index}`} sx={{
                                        'td > p': {p: 0, m: 0},
                                        'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
                                    }}>
                                        <TableCell width={15} sx={{bgcolor: '#FF455C !important'}}></TableCell>
                                        <TableCell align={"center"}>
                                            <p>{item.N}</p>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <p>{item.TipoIngreso}</p>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <p>{item.TipoDocumento}</p>
                                        </TableCell>
                                        <TableCell align={"left"}>
                                            <p>{item.NumeroDocumento}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.Ruc}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.RazonSocial}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.Almacen}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.Correo}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.LinkDocumento}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.errores.map((error, i) => (<label key={`CABECERA-${i}`} style={{display: "block"}}>{error}</label>))}</p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabPanel>
                    <TabPanel value="detalle">
                        <p>Datos correctos {erroresImportacionData.detalleSuccess}</p>
                        <p>Datos con errores {erroresImportacionData.detalleErrors.length}</p>
                        <br/>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell/>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">Articulo</TableCell>
                                    <TableCell align="center">Categoria</TableCell>
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                    <TableCell align="center">Serie</TableCell>
                                    <TableCell align="center">Comentario</TableCell>
                                    <TableCell align="center">Observaciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {erroresImportacionData.detalleErrors.map((item, index) => (
                                    <TableRow key={`TABLA-ERRORES-${index}`} sx={{
                                        'td > p': {p: 0, m: 0},
                                        'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
                                    }}>
                                        <TableCell width={15} sx={{bgcolor: '#FF455C !important'}}></TableCell>
                                        <TableCell align={"center"}>
                                            <p>{item.N}</p>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <p>{item.Articulo || ''}</p>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <p>{item.Categoria || ''}</p>
                                        </TableCell>
                                        <TableCell align={"left"}>
                                            <p>{item.Negocio || ''}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.Cantidad || ''}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.Serie || ''}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.Comentario || ''}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p>{item.errores.map((error, i) => (<label key={`DETALLE-${i}`} style={{display: "block"}}>{error}</label>))}</p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabPanel>
                </TabContext>
            </Box>
        </MainModal>
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
        <input
            accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
            type="file"
            onChange={handleImportData}
            hidden
            ref={inputFile}
        />
        <a ref={downloadFile} href="./bucket/MERCADERIA_CARGA_INICIAL.xlsx" target={"_blank"} download hidden/>
    </Container>
}

export default IngresoMercaderiaPage
