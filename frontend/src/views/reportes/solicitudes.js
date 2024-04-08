import {
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
import {gridSpacing} from "../../store/constant";
import Select from "@mui/material/Select";
import {IconFileDownload, IconSearch} from "@tabler/icons";
import moment from "moment";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {MobileDatePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {listarParametros} from "../../services/Parametro";
import {
    exportExcelSolicitudes,
    reporteSolicitudes
} from "../../services/Reportes";
import {downloadExcel} from "../utilities/Util";
import DetalleSolicitudRowsPage from "./detalle-solicitud-rows";
import {modeContext} from "../../context/modeContext";

const ReporteSolicitudesPage = () => {
    const theme = useTheme()
    const now = moment()
    const dateNow = now.format("YYYY-MM-DD HH:mm")
    const [rows, setRows] = React.useState({ count: 0, rows: [] })
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [estados, setEstados] = React.useState([]);
    const [filtroPorCodigoSolicitud, setFiltroPorCodigoSolicitud] = React.useState('');
    const [filtroPorSolicitante, setFiltroPorSolicitante] = React.useState('');
    const [filtroPorDniSolicitante, setFiltroPorDniSolicitante] = React.useState('');
    const [filtroPorEstado, setFiltroPorEstado] = React.useState(' ');
    const [fechaIni, setFechaIni] = React.useState(dateNow);
    const [fechaFin, setFechaFin] = React.useState(dateNow);
    const [filtroPorFechaIni, setFiltroPorFechaIni] = React.useState(dateNow);
    const [filtroPorFechaFin, setFiltroPorFechaFin] = React.useState(dateNow);
    const { token, tokenCompany } = React.useContext(modeContext)

    const handleChangeDate = (isIni, date) => {
        const fecha = moment(date).format(moment.HTML5_FMT.DATE);
        isIni ? setFechaIni(date) : setFechaFin(date)
        isIni ? setFiltroPorFechaIni(fecha) : setFiltroPorFechaFin(fecha)
    }

    const loadPage = React.useCallback(async () => {
        const estados = await listarParametros(process.env.REACT_APP_ID_GRUPO_PARAMETRO_ESTADOS_SOLICITUD, token, tokenCompany);
        setEstados(estados)
    }, [token, tokenCompany])

    const search = async (pageInit = page, limit = rowsPerPage) => {
        const filtros = {
            solicitante: filtroPorSolicitante,
            dniSolicitante: filtroPorDniSolicitante,
            fecha_ini: filtroPorFechaIni,
            fecha_fin: filtroPorFechaFin,
            estado: filtroPorEstado,
            codigo: filtroPorCodigoSolicitud,
            page: pageInit,
            rows: rowsPerPage,
            limit
        }

        const response = await reporteSolicitudes(filtros, token, tokenCompany)
        setRows(response)
    }

    const handleExportExcel = async () => {
        const filtros = {
            solicitante: filtroPorSolicitante,
            dniSolicitante: filtroPorDniSolicitante,
            fecha_ini: filtroPorFechaIni,
            fecha_fin: filtroPorFechaFin,
            estado: filtroPorEstado,
            codigo: filtroPorCodigoSolicitud
        }
        const data = await exportExcelSolicitudes(filtros, token, tokenCompany)
        await downloadExcel(data, 'reporte solicitudes')
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
                    Reporte de Solicitudes
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} sx={{mt: 2, mb: 2}}>
                <Grid container spacing={gridSpacing}>
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
                                   value={filtroPorSolicitante}
                                   size={"small"}
                                   onChange={(event) => {
                                       setFiltroPorSolicitante(event.target.value)
                                   }}
                                   fullWidth
                                   placeholder="Persona asignada"/>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <TextField type={"text"}
                                   value={filtroPorDniSolicitante}
                                   size={"small"}
                                   fullWidth
                                   onChange={(event) => {
                                       setFiltroPorDniSolicitante(event.target.value)
                                   }}
                                   placeholder="DNI persona asignada"/>
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
                                    <TableCell align="center"># Solicitud</TableCell>
                                    <TableCell align="center" sx={{width: 130}}>Estado</TableCell>
                                    <TableCell align="center">Motivo Solicitud</TableCell>
                                    <TableCell align="center">Solicitante</TableCell>
                                    <TableCell align="center">DNI Solicitante</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>Fecha Sol.</TableCell>
                                    <TableCell align="center" sx={{ width: 100 }}>Fecha Pro.</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <DetalleSolicitudRowsPage row={row} />
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
    </Container>
}

export default ReporteSolicitudesPage
