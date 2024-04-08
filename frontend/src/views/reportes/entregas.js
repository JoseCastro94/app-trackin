import {
    Autocomplete, Checkbox,
    Container,
    Grid, IconButton, MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, TextField,
    Typography
} from "@mui/material";
import * as React from "react";
import {useTheme} from "@mui/material/styles";
import DetalleRowsPage from "./detalle-rows";
import {gridSpacing} from "../../store/constant";
import Select from "@mui/material/Select";
import {IconFileDownload, IconSearch} from "@tabler/icons";
import moment from "moment";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {MobileDatePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {obtenerAlmacenes} from "../../services/Usuario";
import {listarParametros} from "../../services/Parametro";
import {listarNegocios} from "../../services/TipoNegocio";
import {listarResponsables} from "../../services/UsuarioAlmacen";
import {exportExcelEntregas, reporteEntregas} from "../../services/Reportes";
import {downloadExcel} from "../utilities/Util";
import ModalArchivos from "../shared/ModalArchivos";
import {modeContext} from "../../context/modeContext";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ReporteEntregaPage = () => {
    const theme = useTheme()
    const now = moment()
    const dateNow = now.format("YYYY-MM-DD HH:mm")
    const [rows, setRows] = React.useState({ count: 0, rows: [] })
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [almacenes, setAlmacenes] = React.useState([]);
    const [estados, setEstados] = React.useState([]);
    const [negocios, setNegocios] = React.useState([]);
    const [responsables, setResponsables] = React.useState([]);
    const [filtroPorAlmacen, setFiltroPorAlmacen] = React.useState([]);
    const [filtroPorResponsableAlmacen, setFiltroPorResponsableAlmacen] = React.useState([]);
    const [filtroPorCodigoSolicitud, setFiltroPorCodigoSolicitud] = React.useState('');
    const [filtroPorPersonaAsignada, setFiltroPorPersonaAsignada] = React.useState('');
    const [filtroPorDniPersonaAsignada, setFiltroPorDniPersonaAsignada] = React.useState('');
    const [filtroPorNegocio, setFiltroPorNegocio] = React.useState([]);
    const [filtroPorEstados, setFiltroPorEstados] = React.useState(' ');
    const [fechaIni, setFechaIni] = React.useState(dateNow);
    const [fechaFin, setFechaFin] = React.useState(dateNow);
    const [filtroPorFechaIni, setFiltroPorFechaIni] = React.useState(dateNow);
    const [filtroPorFechaFin, setFiltroPorFechaFin] = React.useState(dateNow);
    const [rowId, setRowId] = React.useState('')
    const [openModalArchivos, setOpenModalArchivos] = React.useState(false)
    const { token, tokenCompany } = React.useContext(modeContext)

    const handleOpenModalArchivos = (id) => {
        setRowId(id)
        setOpenModalArchivos(true)
    }

    const handleChangeDate = (isIni, date) => {
        // const fecha = moment(date).format(moment.HTML5_FMT.DATE);
        isIni ? setFechaIni(date) : setFechaFin(date)
        isIni ? setFiltroPorFechaIni(date) : setFiltroPorFechaFin(date)
    }

    const loadPage = React.useCallback(async () => {
        const almacenes = await obtenerAlmacenes({}, token, tokenCompany)
        const estados = await listarParametros(process.env.REACT_APP_ID_GRUPO_PARAMETRO_ESTADOS_DESPACHO, token, tokenCompany);
        const negocios = await listarNegocios({}, token, tokenCompany);
        const resposables = await listarResponsables(token, tokenCompany);
        setAlmacenes(almacenes)
        setEstados(estados)
        setNegocios(negocios)
        setResponsables(resposables)
    }, [token, tokenCompany])

    const search = async (pageInit = page, limit = rowsPerPage) => {
        const filtros = {
            fecha_ini: moment(filtroPorFechaIni).format(moment.HTML5_FMT.DATE),
            fecha_fin: moment(filtroPorFechaFin).format(moment.HTML5_FMT.DATE),
            almacen: filtroPorAlmacen.map(item => item.id),
            responsables: filtroPorResponsableAlmacen.map(item => item.id),
            negocios: filtroPorNegocio.map(item => item.id),
            estado: filtroPorEstados,
            asignada: filtroPorPersonaAsignada,
            dni_asignada: filtroPorDniPersonaAsignada,
            codigo: filtroPorCodigoSolicitud,
            page: pageInit,
            rows: rowsPerPage,
            limit
        }

        const response = await reporteEntregas(filtros, token, tokenCompany)
        console.log(response)
        setRows(response)
    }

    const handleExportExcel = async () => {
        const filtros = {
            fecha_ini: moment(filtroPorFechaIni).format(moment.HTML5_FMT.DATE),
            fecha_fin: moment(filtroPorFechaFin).format(moment.HTML5_FMT.DATE),
            almacen: filtroPorAlmacen.map(item => item.id),
            responsables: filtroPorResponsableAlmacen.map(item => item.id),
            negocios: filtroPorNegocio.map(item => item.id),
            estado: filtroPorEstados,
            asignada: filtroPorPersonaAsignada,
            dni_asignada: filtroPorDniPersonaAsignada,
            codigo: filtroPorCodigoSolicitud
        }
        console.log('exportar excel', filtros)
        const data = await exportExcelEntregas(filtros, token, tokenCompany)
        await downloadExcel(data, 'reporte entregas')
    }

    const handleChangePage = async (event, newPage) => {
        await search(newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        await search(0, event.target.value)
    };

    React.useEffect(() => {
        loadPage()
    }, [loadPage, token, tokenCompany])

    return <Container fixed>
        <Grid container>
            <Grid item xs={12} sm={12}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Reporte de Entregas
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} sx={{mt: 2, mb: 2}}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={6} sm={6}>
                        <Autocomplete
                            multiple
                            id="checkboxes-responsable-almacen"
                            options={responsables}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.nombre}
                            onChange={(event, value) => {
                                console.log('setFiltroPorResponsableAlmacen', value)
                                setFiltroPorResponsableAlmacen(value)
                            }}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.nombre}
                                </li>
                            )}
                            fullWidth
                            size={"small"}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Responsable almacen" fullWidth size={"small"}/>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Autocomplete
                            multiple
                            id="checkboxes-negocios"
                            options={negocios}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.nombre}
                            onChange={(event, value) => {
                                console.log(value)
                                setFiltroPorNegocio(value)
                            }}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.nombre}
                                </li>
                            )}
                            fullWidth
                            size={"small"}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Negocios" fullWidth size={"small"}/>
                            )}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDatePicker
                                inputFormat="dd/MM/yyyy"
                                value={fechaIni}
                                disableFuture
                                onChange={(date) => handleChangeDate(true, date)}
                                renderInput={(params) => <TextField {...params} fullWidth size={"small"} sx={{textAlign: "center"}}/>}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDatePicker
                                inputFormat="dd/MM/yyyy"
                                minDate={fechaIni}
                                maxDate={dateNow}
                                value={fechaFin}
                                onChange={(date) => handleChangeDate(false, date)}
                                renderInput={(params) => <TextField {...params} fullWidth size={"small"} sx={{textAlign: "center"}}/>}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <Autocomplete
                            multiple
                            id="checkboxes-negocios"
                            options={almacenes}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.nombre || ""}
                            onChange={(event, value) => {
                                // console.log(value)
                                setFiltroPorAlmacen(value)
                            }}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.nombre}
                                </li>
                            )}
                            fullWidth
                            size={"small"}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Almacenes" fullWidth size={"small"}/>
                            )}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <TextField type={"text"}
                                   value={filtroPorCodigoSolicitud}
                                   size={"small"}
                                   onChange={(event) => {
                                       setFiltroPorCodigoSolicitud(event.target.value)
                                   }}
                                   fullWidth
                                   placeholder="Código solicitud"/>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <TextField type={"text"}
                                   value={filtroPorPersonaAsignada}
                                   size={"small"}
                                   onChange={(event) => {
                                       setFiltroPorPersonaAsignada(event.target.value)
                                   }}
                                   fullWidth
                                   placeholder="Persona asignada"/>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <TextField type={"text"}
                                   value={filtroPorDniPersonaAsignada}
                                   size={"small"}
                                   fullWidth
                                   onChange={(event) => {
                                       setFiltroPorDniPersonaAsignada(event.target.value)
                                   }}
                                   placeholder="DNI persona asignada"/>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <Select
                            value={filtroPorEstados}
                            size={"small"}
                            fullWidth
                            onChange={(event) => {
                                setFiltroPorEstados(event.target.value)
                            }}
                        >
                            <MenuItem value=" ">-- Seleccione estado --</MenuItem>
                            {estados.map((estado, index) => (
                                <MenuItem key={index} value={estado.id}>{estado.nombre}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <IconButton size={"small"}
                                    onClick={ async () => {
                                        setPage(0)
                                        await search(0)
                                    }}>
                            <IconSearch/>
                        </IconButton>
                        <IconButton size={"small"}
                                    onClick={handleExportExcel}>
                            <IconFileDownload/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
                <TableContainer component={Paper}>
                    {rows.rows.map((row) => {
                        return <Table aria-label="collapsible table" key={row.id}>
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell sx={{ width: 5 }}/>
                                    <TableCell align="center"># Despacho</TableCell>
                                    <TableCell align="center"># Solicitud</TableCell>
                                    <TableCell align="center">Almacén</TableCell>
                                    <TableCell align="center">Responsable de Almacen</TableCell>
                                    <TableCell align="center">Responsable Despacho</TableCell>
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">P. Asignada</TableCell>
                                    <TableCell align="center">DNI. Asignada</TableCell>
                                    <TableCell align="center" sx={{width: 130}}>Estado</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>F. Entrega</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>Horario</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Cargo</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}>Doc.</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <DetalleRowsPage row={row}
                                                 openModalArchivos={handleOpenModalArchivos}
                                                 module={'entrega'}
                                                 token={token}
                                                 tokenCompany={tokenCompany}/>
                            </TableBody>
                        </Table>
                    })}
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20]}
                    component="div"
                    count={parseInt(rows.count)}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
        <ModalArchivos upload={false}
                       remove={false}
                       idModulo={rowId}
                       modulo='entrega'
                       open={openModalArchivos}
                       handleClose={() => setOpenModalArchivos(false)} />
    </Container>
}

export default ReporteEntregaPage
