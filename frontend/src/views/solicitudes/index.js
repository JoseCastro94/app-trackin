import {
    Autocomplete, Avatar,
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    Grid,
    IconButton, List, ListItem, ListItemAvatar, ListItemText,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography,
} from "@mui/material";
import * as React from "react";
import {styled, useTheme} from "@mui/material/styles";
import {list, listarCantidadEstados} from "../../services/Solicitud";
import {Link} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"
import {listarParametros} from "../../services/Parametro";
import ModalShowDetail from "../shared/ModaShowDetail";
import {modeContext} from "../../context/modeContext";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import {gridSpacing} from "../../store/constant";
import MainCard from "../../ui-component/cards/MainCard";
import {IconCalendar, IconList} from "@tabler/icons";

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

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fafafa'
}))

const baseURL = process.env.PUBLIC_URL

const SolicitudesPage = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const [rows, setRows] = React.useState([])
    const [estados, setEstados] = React.useState([])
    const [cantidadEstados, setCantiddaEstados] = React.useState([])
    const [estado, setEstado] = React.useState(null)
    const [openFind, setOpenFind] = React.useState(false)
    const [idSolicitud, setIdSolicitud] = React.useState('')
    const { token, tokenCompany } = React.useContext(modeContext)
    const handleOpenFind = (action, id_solicitud) => {
        setIdSolicitud(id_solicitud)
        setOpenFind(action)
    }
    const columnsModalShowDetail = [
        { field: 'item', headerName: 'Descripción', width: 400 },
        { field: 'codigo', headerName: 'Codigo', width: 180 },
        { field: 'documento', headerName: 'Asignado' },
        { field: 'cuenta', headerName: 'Negocio', width: 200 },
        { field: 'cantidad', headerName: 'Solicitado' },
        { field: 'cantidad_entrega', headerName: 'Entregado' },
        { field: 'stock', headerName: 'Stock' },
        { field: 'almacen', headerName: 'Almacen', width: 400 },
        { field: 'estado', headerName: 'Estado', width: 200 },
    ]

    const load = React.useCallback(async () => {
        let data = await list({token, tokenCompany});
      
        let estados = await listarParametros(process.env.REACT_APP_ID_GRUPO_PARAMETRO_ESTADOS_SOLICITUD, token, tokenCompany);
        
        let cantidda_estados = await listarCantidadEstados({token, tokenCompany});
        data = data.map(item => {
            item.checked = !!item.packing
            return item
        })
        
        setCantiddaEstados(cantidda_estados)
        setRows(data)
        setEstado("Todos")
        setEstados(estados)
    }, [token, tokenCompany])

    const handleChangeEstado = async (value) => {
        setEstado(value)
        let data = await list({estado: value.id, token, tokenCompany});
        setRows(data)
    }

    React.useEffect(() => {
        load()
    }, [load, token, tokenCompany])

    return <Container fixed>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12}>
                <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Accesos directos</Typography>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        onClick={() => navigate(`${baseURL}/entrega/solicitudes`)}
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: 'inherit',
                                            color: theme.palette.primary.main
                                        }}
                                    >
                                        <IconCalendar fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Entrega</Typography>}
                                    secondary={
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.palette.grey[500],
                                                mt: 0.5
                                            }}
                                        >
                                            Lista de Entregas
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        onClick={() => navigate(`${baseURL}/ingreso-mercaderia`)}
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: 'inherit',
                                            color: theme.palette.primary.main
                                        }}
                                    >
                                        <AddBoxOutlinedIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Ingreso de mercadería</Typography>}
                                    secondary={
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.palette.grey[500],
                                                mt: 0.5
                                            }}
                                        >
                                            Crear un Ingreso de mercadería
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        onClick={() => navigate(`${baseURL}/devoluciones`)}
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: 'inherit',
                                            color: theme.palette.primary.main
                                        }}
                                    >
                                        <IconList fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={<Typography variant="h3" sx={{ color: theme.palette.primary.main }}>Lista Devoluciones</Typography>}
                                    secondary={
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.palette.grey[500],
                                                mt: 0.5
                                            }}
                                        >
                                            Lista Devoluciones
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Grid item xs={12} sm={12}>
                    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>Historial de solicitudes</Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Stack direction="row" spacing={2}>
                    {cantidadEstados.map((item, index) => (
                        <ShadowBox key={index} texto={item.estado} cantidad={item.cantidad} color={item.color}/>
                    ))}
                </Stack>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Autocomplete
                    sx={{width: 200, float: "right", marginBottom: 3}}
                    options={["Todos",...estados]}
                    getOptionLabel={(option) => option?.nombre || "Todos"}
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
            {/*<Grid item xs={12} sm={12}>*/}
            {/*    <Typography variant='body1' sx={{ color: theme.palette.secondary.main }}>*/}
            {/*        Pendiente de programación*/}
            {/*    </Typography>*/}
            {/*</Grid>*/}
            <Grid item xs={12} sm={12}>
                <TableContainer component={Paper} sx={{ borderRadius: "0px" }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                        <TableHead>
                            <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"># Solicitud</TableCell>
                                <TableCell align="center">Cuenta</TableCell>
                                <TableCell align="center">P. Asignada</TableCell>
                                <TableCell align="center" sx={{width: "140px"}}>Estado</TableCell>
                                <TableCell align="center">Fecha Solicitud</TableCell>
                                <TableCell align="center" sx={{width: "50px"}}>Seleccionar</TableCell>
                                <TableCell align="center" sx={{width: "50px"}}>Detalle</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => {
                                // const isItemSelected = isSelected(row.name);
                                const setChecked = (id_detalle, value) => {
                                    const newRows = rows.map((item) => {
                                        if (item.id_detalle === id_detalle) item.checked = !value
                                        return item
                                    })
                                    setRows(newRows)
                                }

                                return <TableRow
                                    key={row.id_detalle}
                                    sx={{
                                        'td > p': {p: 0, m: 0},
                                        'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
                                    }}
                                >
                                    <TableCell width={15} sx={{bgcolor: `${row.color} !important`}}></TableCell>
                                    <TableCell align="left">
                                        <div>{row.motivo_solicitud}</div>
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
                                        <div>{row.fecha_solicitud}</div>
                                    </TableCell>
                                    <TableCell align="center" padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            disabled={row.estado === 'Entregado'}
                                            checked={row.checked}
                                            onChange={(event) => setChecked(row.id_detalle, row.checked)}
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
                <Button variant="contained"
                        onClick={() => {
                            const filterSelected = rows.filter(item => item.checked).map(item => item.id)
                            console.log('PROBANDO: ', filterSelected)
                            localStorage.setItem('SOL_SEL', JSON.stringify(filterSelected))
                            if (filterSelected.length > 0) {
                                navigate(`${process.env.PUBLIC_URL}/despacho/solicitudes`)
                            }
                        }}>Preparar Pedido</Button>
            </Grid>
        </Grid>
        <ModalShowDetail
            open={openFind}
            handleClose={() => { handleOpenFind(false) }}
            title='Detalle Solicitud'
            url={`${process.env.REACT_APP_API}business/api/solicitud_articulo/${idSolicitud}/detalle-solicitud`}
            columns={columnsModalShowDetail}
            param={{}}/>
    </Container>
}

export default SolicitudesPage
