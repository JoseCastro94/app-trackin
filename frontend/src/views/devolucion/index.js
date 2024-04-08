import {
    Autocomplete,
    Button,
    Checkbox,
    Container,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography,
} from "@mui/material";
import * as React from "react";
import {useTheme} from "@mui/material/styles";
import {listDevoluciones} from "../../services/Solicitud";
import {Link} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"
import {listarParametros} from "../../services/Parametro";
import ModalShowDetail from "../shared/ModaShowDetail";
import {modeContext} from "../../context/modeContext";
/*
const ShadowBox = (props) => {
    const {texto, cantidad, color} = props
    return <Card sx={{ mb: 3, borderRadius: "0px" }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 1,
                px: 1,
                bgcolor: "grey.200",
                color: 'grey.800',
                cursor: 'pointer',
                borderRadius: "10px"
            }}
        >
            <Stack direction="row" spacing={2}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 1,
                        px: 1,
                        bgcolor: `${color}`,
                        borderRadius: "10px"
                    }}
                >
                    <Typography variant="h1" component="h1" sx={{color: 'white'}}>{cantidad}</Typography>
                </Box>
                <Typography variant="h4" component="h4" paddingY={1}>{texto}</Typography>
            </Stack>
        </Box>
    </Card>
};
*/
const DevolucionesPage = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const [rows, setRows] = React.useState([])
    const [estados, setEstados] = React.useState([])
    // const [cantidadEstados, setCantiddaEstados] = React.useState([])
    const [estado, setEstado] = React.useState(null)
    const [openFind, setOpenFind] = React.useState(false)
    const [idSolicitud, setIdSolicitud] = React.useState('')
    const { token, tokenCompany } = React.useContext(modeContext)
    const handleOpenFind = (action, id_solicitud) => {
        setIdSolicitud(id_solicitud)
        setOpenFind(action)
    }
    const columnsModalShowDetail = [
        { field: 'descripcion', headerName: 'Descripción', width: 400 },
        { field: 'codigo', headerName: 'Codigo', width: 180 },
        { field: 'num_doc', headerName: 'Asignado' },
        { field: 'cuenta', headerName: 'Negocio', width: 200 },
        { field: 'cantidad', headerName: 'Solicitado' },
        { field: 'cantidad_devolucion', headerName: 'Entregado' },
        { field: 'almacen', headerName: 'Almacen', width: 200 },
        { field: 'estado', headerName: 'Estado', width: 200 },
    ]

    const load = React.useCallback(async () => {
        let data = await listDevoluciones({token, tokenCompany});
        let estados = await listarParametros(process.env.REACT_APP_ID_GRUPO_PARAMETRO_ESTADOS_SOLICITUD_DEVOLUCION, token, tokenCompany);
        // let cantidda_estados = await listarCantidadEstados({tipo: 'DEVOLUCION', token, tokenCompany});
        data = data.map(item => {
            item.checked = false
            return item
        })
        // setCantiddaEstados(cantidda_estados)
        estados = estados.filter(estado => estado.id !== 'ff7535f6-3274-4ab8-9974-5a45109048db')
        setRows(data)
        setEstado(estados[0])
        setEstados(estados)
    }, [token, tokenCompany])

    const handleChangeEstado = async (value) => {
        console.log(value);
        setEstado(value)
        let data = await listDevoluciones({estado: value.id, token, tokenCompany});
        setRows(data)
    }

    React.useEffect(() => {
        load()
    }, [load, token, tokenCompany])

    return <Container fixed>
        <Grid container>
            <Grid item xs={12} sm={12}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Historial de devoluciones
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Autocomplete
                    sx={{width: 200, float: "right", marginBottom: 3}}
                    options={estados}
                    getOptionLabel={(option) => option?.nombre}
                    autoComplete
                    disableClearable
                    value={estado}
                    openText=""
                    size="small"
                    id="autocomplete"
                    isOptionEqualToValue={(option, value) => option?.nombre === value?.nombre}
                    onChange={(event, value) => handleChangeEstado(value)}
                    renderInput={(params) => <TextField {...params} placeholder="Seleccione"/>}
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TableContainer component={Paper} sx={{ borderRadius: "0px" }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                <TableCell sx={{ width: "5px" }}/>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"># Solicitud</TableCell>
                                <TableCell align="center">Cuenta</TableCell>
                                <TableCell align="center">P. Asignada</TableCell>
                                <TableCell align="center" sx={{width: "140px"}}>Estado</TableCell>
                                <TableCell align="center">Fecha Solicitud</TableCell>
                                <TableCell align="center" sx={{width: "50px"}}>Devolucion</TableCell>
                                <TableCell align="center" sx={{width: "50px"}}>Detalle</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => {
                                // const isItemSelected = isSelected(row.name);
                                const setChecked = (id, value) => {
                                    const newRows = rows.map((item) => {
                                        if (item.id === id) item.checked = !value
                                        return item
                                    })
                                    setRows(newRows)
                                }

                                return <TableRow
                                    key={index}
                                    sx={{
                                        'td > p': {p: 0, m: 0},
                                        'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
                                    }}
                                >
                                    <TableCell width={15} sx={{bgcolor: `${row.color} !important`}}></TableCell>
                                    <TableCell align="left">
                                        <div>{row.motivo}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div>{row.codigo}</div>
                                    </TableCell>
                                    <TableCell align="left">
                                        <div>{row.cuenta}</div>
                                    </TableCell>
                                    <TableCell align="left">
                                        <div>{row.asignado}</div>
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        bgcolor: `${row.color}!important`,
                                        color: "white",
                                        fontSize: "12px"
                                    }}>{row.estado}
                                    </TableCell>
                                    <TableCell align="center">
                                        <div>{row.fecha}</div>
                                    </TableCell>
                                    <TableCell align="center" padding="checkbox">
                                        <Checkbox
                                            disabled={row.estado === 'Entregado'}
                                            color="primary"
                                            checked={row.checked}
                                            onChange={(event) => setChecked(row.id, row.checked)}
                                            inputProps={{
                                                'aria-labelledby': `enhanced-table-checkbox-${index}`,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" aria-label="Detalle" onClick={() => {handleOpenFind(true, row.id)}}>
                                            <Link/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} sm={12} textAlign={"right"} paddingTop={1}>
                <Button variant="contained" onClick={() => {
                    const filterSelected = rows.filter(item => item.checked).map(item => item.id)
                    localStorage.setItem('SOL_DEV_SEL', JSON.stringify(filterSelected))
                    if (filterSelected.length > 0) {
                        navigate(`${process.env.PUBLIC_URL}/devolucion`)
                    }
                }}>Iniciar Devolución</Button>
            </Grid>
        </Grid>
        <ModalShowDetail
            open={openFind}
            handleClose={() => { handleOpenFind(false) }}
            title='Detalle Devolución'
            url={`${process.env.REACT_APP_API}business/api/solicitud_articulo/${idSolicitud}/detalle-devolucion`}
            columns={columnsModalShowDetail}
            param={{}}/>
    </Container>
}

export default DevolucionesPage
