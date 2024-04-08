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
import {gridSpacing} from "../../store/constant";
import Select from "@mui/material/Select";
import {IconFileDownload, IconSearch} from "@tabler/icons";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import {listarAlmacenes} from "../../services/Almacen";
import {listarNegociosStock} from "../../services/TipoNegocio";
import {listarResponsables} from "../../services/UsuarioAlmacen";
import {exportExcelStocks, reporteStocks} from "../../services/Reportes";
import {listarGruposArticulo} from "../../services/GrupoArticuloMaestro";
import {downloadExcel} from "../utilities/Util";
import {modeContext} from "../../context/modeContext";
import {listarEstadosStocks} from "../../services/Stock";
import {listarAlmacenes, listarCorreos, listarUsuarios, obtenerAlmacenes} from "../../services/Usuario";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ReporteDevolucionPage = () => {
    const theme = useTheme()
    const [rows, setRows] = React.useState({ count: 0, rows: [] })
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [almacenes, setAlmacenes] = React.useState([]);
    const [grupos, setGrupos] = React.useState([]);
    const [negocios, setNegocios] = React.useState([]);
    const [responsables, setResponsables] = React.useState([]);
    const [estados, setEstados] = React.useState([]);
    const [filtroPorAlmacen, setFiltroPorAlmacen] = React.useState(' ');
    const [filtroPorArticulo, setFiltroPorArticulo] = React.useState('');
    const [filtroPorResponsableAlmacen, setFiltroPorResponsableAlmacen] = React.useState([]);
    const [filtroPorNegocio, setFiltroPorNegocio] = React.useState([]);
    const [filtroPorEstados, setFiltroPorEstados] = React.useState(' ');
    const [filtroPorGrupo, setFiltroPorGrupo] = React.useState(' ')
    // const [selectedAlmacenes, setSelectedAlmacenes] = React.useState([]);
    const { token, tokenCompany } = React.useContext(modeContext)

    const loadPage = React.useCallback(async () => {
        const almacenes = await obtenerAlmacenes({},token, tokenCompany)
        const negocios = await listarNegociosStock({}, token, tokenCompany);
        const resposables = await listarResponsables(token, tokenCompany);
        const grupos = await listarGruposArticulo(token, tokenCompany);
        const estados = await listarEstadosStocks(token, tokenCompany); 
        setAlmacenes(almacenes)
        setNegocios(negocios)
        setResponsables(resposables)
        setGrupos(grupos)
        setEstados(estados)
        console.log(grupos)
        console.log(negocios)
    }, [token, tokenCompany])

    const search = async (pageInit = page, limit = rowsPerPage) => {
        
         const filtroAlmacen = filtroPorAlmacen === ' ' ? almacenes.map(almacen => almacen.id).join(',') : filtroPorAlmacen;

        const filtros = {
            articulo: filtroPorArticulo,
            almacen: filtroAlmacen,
            grupo: filtroPorGrupo,
            responsables: filtroPorResponsableAlmacen.map(item => item.id),
            negocios: filtroPorNegocio.map(item => item.id),
            estado: filtroPorEstados,
            page: pageInit,
            rows: rowsPerPage,
            limit   

        }

        console.log(filtros)
        const response = await reporteStocks(filtros, token, tokenCompany)
        setRows(response)
        console.log (response)
    }

    const handleExportExcel = async () => {
        const filtroAlmacen = filtroPorAlmacen === ' ' ? almacenes.map(almacen => almacen.id) : [filtroPorAlmacen];


        const filtros = {
            articulo: filtroPorArticulo,
            almacen: filtroAlmacen,
            grupo: filtroPorGrupo,
            responsables: filtroPorResponsableAlmacen.map(item => item.id),
            negocios: filtroPorNegocio.map(item => item.id),
            estado: filtroPorEstados
        }
        const data = await exportExcelStocks(filtros, token, tokenCompany)
        await downloadExcel(data, 'reporte stocks')
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
                    Reporte de Stocks
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
                        <TextField type={"text"}
                                   value={filtroPorArticulo}
                                   size={"small"}
                                   fullWidth
                                   onChange={(event) => {
                                       setFiltroPorArticulo(event.target.value)
                                   }}
                                   placeholder="Artículo (código/nombre)"/>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <Select
                            value={filtroPorAlmacen}
                            size={"small"}
                            fullWidth
                            onChange={(event) => {
                                setFiltroPorAlmacen(event.target.value)
                            }}
                        >
                            <MenuItem value=" ">-- Seleccione Almacén --</MenuItem>
                            {almacenes.map((almacen, index) => (
                                <MenuItem key={index} value={almacen.id}>{almacen.nombre}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <Select
                            value={filtroPorGrupo}
                            size={"small"}
                            fullWidth
                            onChange={(event) => {
                                setFiltroPorGrupo(event.target.value)
                            }}
                        > 
                        
                            <MenuItem value=" ">-- Seleccione grupo --</MenuItem>
                            {grupos.map((grupo, index) => (
                                <MenuItem key={index} value={grupo.id}>{grupo.nombre}</MenuItem>
                            ))}
                        </Select>
                        
                    </Grid>
                    <Grid item xs={2} sm={2}>
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
                                <MenuItem key={index} value={estado.nombre}>{estado.nombre}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1} sm={1}>
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
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                <TableCell sx={{ width: 5 }}/>
                                <TableCell align="center">Almacén</TableCell>
                                <TableCell align="center">Negocio</TableCell>
                                <TableCell align="center">Grupo Artículo</TableCell>
                                <TableCell align="center">Nombre Artículo</TableCell>
                                <TableCell align="center">Código Artículo</TableCell>
                                <TableCell align="center" sx={{width: 100}}>Cantidad</TableCell>
                                <TableCell align="center" sx={{width: 130}}>Estado</TableCell>
                                <TableCell align="center">Responsable Almacén</TableCell>
                                <TableCell align="center">DNI Responsable</TableCell>
                                <TableCell align="center" sx={{ width: 100 }}>Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.rows.map((row, index) => {
                                return <TableRow key={index} sx={{
                                    'td > p': {p: 0, m: 0},
                                    'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
                                }}>
                                    <TableCell width={15} sx={{bgcolor: '#90caf9 !important'}}></TableCell>
                                    <TableCell align="center"><p>{row.almacen}</p></TableCell>
                                    <TableCell align="center"><p>{row.negocio}</p></TableCell>
                                    <TableCell align="center"><p>{row.grupo}</p></TableCell>
                                    <TableCell align="center"><p>{row.articulo}</p></TableCell>
                                    <TableCell align="center"><p>{row.codigo}</p></TableCell>
                                    <TableCell align="right"><p>{row.cantidad}</p></TableCell>
                                    <TableCell align="center">{row.tipo}</TableCell>
                                    <TableCell align="center"><p>{row.responsable}</p></TableCell>
                                    <TableCell align="center"><p>{row.documento}</p></TableCell>
                                    <TableCell align="center"><p>{row.fecha}</p></TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
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

export default ReporteDevolucionPage
