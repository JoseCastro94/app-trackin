import {useTheme} from "@mui/material/styles";
import {
    Alert, AlertTitle, Box,
    Button, ButtonGroup, ClickAwayListener,
    Container,
    Grid, Grow, IconButton, MenuItem, MenuList,
    Paper, Popper, Snackbar,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField,
    Typography
} from "@mui/material";

import * as React from "react";
import {gridSpacing} from "../../store/constant";
import MainModal from "../../ui-component/modals/MainModal";
import Select from "@mui/material/Select";
import {getDepartamentos, getDistritos, getProvincias} from "../../services/Ubigeo";
import DialogMain from "../../ui-component/alerts/DialogMain";
import {
    actualizarAlmacen,
    crearAlmacen,
    eliminarAlmacen,
    importarAlmacenes,
    listarAlmacenes
} from "../../services/Almacen";
import {ArrowDropDown, Edit} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {IconCheckbox, IconSearch} from "@tabler/icons";
import {useRef} from "react";
import {validarFile} from "../utilities/Util";
import { modeContext } from '../../context/modeContext'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const AlmacenesPage = () => {
    const theme = useTheme()
    const dataIni = {
        id: '',
        tipo: 'Almacen',
        nombre: '',
        descripcion: '',
        direccion: '',
        departamento_inei: ' ',
        provincia_inei: ' ',
        ubigeo_inei: ' ',
    }
    const inputFile = useRef(null)
    const downloadFile = useRef(null)
    const anchorRef = useRef(null)
    const [open, setOpen] = React.useState(false);
    const [uploading, setUploading] = React.useState(false)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [openDialog, setOpenDialog] = React.useState(false)
    const [openAlert, setOpenAlert] = React.useState(false)
    const [alert, setAlert] = React.useState({ message: '', severity: 'success' })
    const [textConfirm, setTextConfirm] = React.useState('')
    const [action, setAction] = React.useState('SAVE')
    const [openModalRegistrar, setOpenModalRegistrar] = React.useState(false)
    const [almacen, setAlmacen] = React.useState(dataIni)
    const [almacenes, setAlmacenes] = React.useState({ count: 0, rows: [] })
    const [departamentos, setDepartamentos] = React.useState([])
    const [distritos, setDistritos] = React.useState([])
    const [provincias, setProvincias] = React.useState([])
    const [idAlmacen, setIdAlmacen] = React.useState(0)
    const [filtroPorNombre, setFiltroPorNombre] = React.useState('');
    const [filtroPorTipo, setFiltroPorTipo] = React.useState(' ');
    const [openModalErroresImportacionData, setOpenModalErroresImportacionData] = React.useState(false)
    const [erroresImportacionData, setErroresImportacionData] = React.useState({
        almacenesSuccess: 0,
        almacenesErrors: []
    })
    const { token, tokenCompany } = React.useContext(modeContext)

    const loadProvincias = React.useCallback(async (departamento) => {
        const provincias = await getProvincias(departamento, token, tokenCompany)
        setProvincias(provincias)
    }, [token, tokenCompany])

    const loadDistritos = React.useCallback(async (provincia) => {
        const distritos = await getDistritos(provincia, token, tokenCompany)
        setDistritos(distritos)
    }, [token, tokenCompany])

    const loadAlmacenes = React.useCallback(async (pageInit = page, limit = rowsPerPage) => {
        const filter = []
        if (filtroPorNombre.trim())
            filter.push(`Nombre lk ${filtroPorNombre.trim().replace(' ', '_')}`)

        if (filtroPorTipo.trim())
            filter.push(`Tipo eq ${filtroPorTipo.trim()}`)

        const almacenes = await listarAlmacenes({
            page: pageInit + 1,
            limit,
            filters: filter.join(' and ')
        }, token, tokenCompany)
        setAlmacenes(almacenes)
    }, [page, rowsPerPage, filtroPorNombre, filtroPorTipo, token, tokenCompany])

    const load = React.useCallback(async () => {
        await loadAlmacenes()
        const departamentos = await getDepartamentos(token, tokenCompany)
        setDepartamentos(departamentos)
    }, [loadAlmacenes, token, tokenCompany])

    const handleCloseModalRegistrar = () => setOpenModalRegistrar(false)

    const handleChangePage = async (event, newPage) => {
        await loadAlmacenes(newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        await loadAlmacenes(0, event.target.value)
    };

    const handleGuardar = async () => {
        setOpenDialog(false)
        let response = null

        switch (action) {
            case 'DELETE':
                response = await eliminarAlmacen(idAlmacen, token, tokenCompany)
                break
            case 'UPDATE':
                response = await actualizarAlmacen(almacen, token, tokenCompany)
                break
            default:
                response = await crearAlmacen(almacen, token, tokenCompany)
                break
        }

        if (response.success) {
            await loadAlmacenes()
            setOpenModalRegistrar(false)
        }

        setAlert(response)
        setOpenAlert(true)
    }

    const handleImportData = async (e) => {
        setUploading(true)
        const file = validarFile(e)

        if (!file.status) {
            setUploading(false)
            //setAlert2(file)
            //setOpenAlert(true)
            return
        }

        const response = await importarAlmacenes(file.data, token, tokenCompany)
        setUploading(false)
        setPage(0);
        await loadAlmacenes(0)
        if (response.severity !== 'error' && !response.success) {
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

    React.useEffect(() => {
        load()
    }, [load, token, tokenCompany])

    return <Container fixed>
        <Grid container>
            <Grid item xs={6} sm={8}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Lista de Almacenes / Puntos de Venta
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
                <Button variant="contained"
                        size="small"
                        onClick={() => {
                            setAlmacen(dataIni)
                            setOpenModalRegistrar(true)
                        }}
                >Nuevo</Button>
            </Grid>
        </Grid>
        <br/>
        <Grid item xs={12} sm={12}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={3} sm={3}>
                    <TextField type={"text"}
                               value={filtroPorNombre}
                               size={"small"}
                               fullWidth
                               onChange={(event) => {
                                   setFiltroPorNombre(event.target.value)
                               }}
                               placeholder="Nombre"/>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <Select
                        value={filtroPorTipo}
                        size={"small"}
                        fullWidth
                        onChange={(event) => {
                            setFiltroPorTipo(event.target.value)
                        }}
                    >
                        <MenuItem value=" ">-- Todos --</MenuItem>
                        <MenuItem value="Almacen">Almacén</MenuItem>
                        <MenuItem value="PDV">Punto de Venta</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <IconButton size={"small"}
                                onClick={ async () => {
                                    await loadAlmacenes(0, rowsPerPage)
                                }}>
                        <IconSearch/>
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
        <br/>
        <Grid item xs={12} sm={12}>
            <TableContainer component={Paper} style={{borderRadius: "0px"}}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                            <TableCell sx={{ width: 5 }}/>
                            <TableCell align="center">HOLA</TableCell>
                            <TableCell align="center">Descripción</TableCell>
                            <TableCell align="center">Dirección</TableCell>
                            <TableCell align="center">Departamento</TableCell>
                            <TableCell align="center">Provincia</TableCell>
                            <TableCell align="center">Distrito</TableCell>
                            <TableCell align="center">Tipo</TableCell>
                            <TableCell align="center">Empresa</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center" sx={{ width: 100 }}>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {almacenes.rows.map((almacen, index) => (
                            <TableRow key={index} sx={{
                                'td > p': {p: 0, m: 0},
                                'td, th': {px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"},
                                'td': {bgcolor: "grey.200"},
                                'th': {bgcolor: "primary.200"}
                            }}>
                                <TableCell width={15} component="th"></TableCell>
                                <TableCell align="center"><p>{almacen.nombre}</p></TableCell>
                                <TableCell align="left"><p>{almacen.descripcion}</p></TableCell>
                                <TableCell align="center"><p>{almacen.direccion}</p></TableCell>
                                <TableCell align="left"><p>{almacen.departamento}</p></TableCell>
                                <TableCell align="left"><p>{almacen.provincia}</p></TableCell>
                                <TableCell align="right"><p>{almacen.distrito}</p></TableCell>
                                <TableCell align="right"><p>{almacen.tipo}</p></TableCell>
                                <TableCell align="right"><p>{almacen.empresa}</p></TableCell>
                                <TableCell align="center"><p>{almacen.Activo}</p></TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color="primary"
                                        onClick={ async () => {
                                            console.log('departamentos', departamentos)
                                            await loadProvincias(almacen.departamento_inei)
                                            await loadDistritos(almacen.provincia_inei)
                                            setOpenModalRegistrar(true)
                                            setAlmacen(almacen)
                                        }}
                                    >
                                        <Edit></Edit>
                                    </IconButton>
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color={almacen.Activo === 'Activo' ? "error" : "success"}
                                        onClick={() => {
                                            setIdAlmacen(almacen.id)
                                            setTextConfirm(`¿Está seguro de ${almacen.Activo === 'Activo' ? 'eliminar' : 'activar'} el almacén?`)
                                            setAction('DELETE')
                                            setOpenDialog(true)
                                        }}
                                    >
                                        {almacen.Activo === 'Activo' ? <DeleteIcon/> : <IconCheckbox/>}

                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20]}
                component="div"
                count={almacenes.count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Grid>

        <MainModal
            open={openModalRegistrar}
            onClose={handleCloseModalRegistrar}
            aria_labelledby="modal-find-worker"
            aria_describedby="modal-find-pick-worker"
        >
            <Typography id="modal-find-worker" variant="h3" component="h2">
                Registro de almacén / Punto de Venta
            </Typography>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={6}>
                    <p>Tipo</p>
                    <Select
                        value={almacen.tipo}
                        size={"small"}
                        fullWidth
                        onChange={(event) => {
                            setAlmacen({...almacen, tipo: event.target.value})
                        }}
                    >
                        <MenuItem value="Almacen">Almacén</MenuItem>
                        <MenuItem value="Punto de Venta">Punto de Venta</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <p>Nombre</p>
                    <TextField
                        value={almacen.nombre}
                        fullWidth
                        size={"small"}
                        onChange={(event) => {
                            setAlmacen({...almacen, nombre: event.target.value})
                        }}/>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
                <p>Descripción</p>
                <TextField
                    value={almacen.descripcion}
                    fullWidth
                    size={"small"}
                    onChange={(event) => {
                        setAlmacen({...almacen, descripcion: event.target.value})
                    }}/>
            </Grid>
            <Grid item xs={12} sm={12}>
                <p>Dirección</p>
                <TextField
                    value={almacen.direccion}
                    fullWidth
                    size={"small"}
                    onChange={(event) => {
                        setAlmacen({...almacen, direccion: event.target.value})
                    }}/>
            </Grid>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={4}>
                    <p>Departamento</p>
                    <Select
                        value={almacen.departamento_inei}
                        size={"small"}
                        fullWidth
                        onChange={async (event) => {
                            setAlmacen({...almacen, departamento_inei: event.target.value})
                            await loadProvincias(event.target.value)
                        }}
                    >
                        <MenuItem value=" ">-- Seleccione --</MenuItem>
                        {departamentos.map((departamento, index) => (
                            <MenuItem key={index} value={departamento.departamento_inei}>{departamento.departamento}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <p>Provincia</p>
                    <Select
                        value={almacen.provincia_inei}
                        size={"small"}
                        fullWidth
                        onChange={async (event) => {
                            setAlmacen({...almacen, provincia_inei: event.target.value})
                            await loadDistritos(event.target.value)
                        }}
                    >
                        <MenuItem value=" ">-- Seleccione --</MenuItem>
                        {provincias.map((provincia, index) => (
                            <MenuItem key={index} value={provincia.provincia_inei}>{provincia.provincia}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <p>Distrito</p>
                    <Select
                        value={almacen.ubigeo_inei}
                        size={"small"}
                        fullWidth
                        onChange={(event) => {
                            setAlmacen({...almacen, ubigeo_inei: event.target.value})
                        }}
                    >
                        <MenuItem value=" ">-- Seleccione --</MenuItem>
                        {distritos.map((distrito, index) => (
                            <MenuItem key={index} value={distrito.ubigeo_inei}>{distrito.distrito}</MenuItem>
                        ))}
                    </Select>
                </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}
                  sx={{mt: 1}}
                  direction={"row"}
                  justifyContent={"flex-end"}
                  alignItems={"flex-end"}>
                <Grid item xs={2} sm={2}>
                    <Button variant="contained"
                            fullWidth
                            size={"small"}
                            color={"primary"}
                            disabled={ almacen.departamento_inei === ' ' || almacen.ubigeo_inei === ' ' || !almacen.provincia_inei === ' ' }
                            onClick={async () => {
                                setTextConfirm(almacen.id ? '¿Deseas actualizar el almacén?' : `¿Deseas registrar el ${almacen.tipo}?`)
                                setAction(almacen.id ? 'UPDATE' : 'SAVE')
                                setOpenDialog(true)
                            }}>
                        {
                            almacen.id ? 'Actualizar' : 'Registrar'
                        }
                    </Button>
                </Grid>
            </Grid>
        </MainModal>

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
                <p>Datos correctos {erroresImportacionData.almacenesSuccess}</p>
                <p>Datos con errores {erroresImportacionData.almacenesErrors.length}</p>
                <br/>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                            <TableCell/>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Descripción</TableCell>
                            <TableCell align="center">Dirección</TableCell>
                            <TableCell align="center">Ubigeo</TableCell>
                            <TableCell align="center">Tipo</TableCell>
                            <TableCell align="center">Observaciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {erroresImportacionData.almacenesErrors.map((item, index) => (
                            <TableRow key={index} sx={{
                                'td > p': {p: 0, m: 0},
                                'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
                            }}>
                                <TableCell width={15} sx={{bgcolor: '#FF455C !important'}}></TableCell>
                                <TableCell align={"center"}>
                                    <p>{item.N}</p>
                                </TableCell>
                                <TableCell align={"center"}>
                                    <p>{item.Nombre}</p>
                                </TableCell>
                                <TableCell align={"center"}>
                                    <p>{item.Descripcion}</p>
                                </TableCell>
                                <TableCell align={"left"}>
                                    <p>{item.Direccion}</p>
                                </TableCell>
                                <TableCell align="left">
                                    <p>{item.Ubigeo}</p>
                                </TableCell>
                                <TableCell align="left">
                                    <p>{item.Tipo}</p>
                                </TableCell>
                                <TableCell align="left">
                                    <p>{item.errores.map((error, i) => (<label key={i} style={{display: "block"}}>{error}</label>))}</p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </MainModal>

        <input
            accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
            type="file"
            onChange={handleImportData}
            hidden
            ref={inputFile}
        />
        <a ref={downloadFile} href="./bucket/ALMACENES_CARGA_INICIAL.xlsx" target={"_blank"} download hidden/>

        <DialogMain
            open={openDialog}
            title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
            body={textConfirm}
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

export default AlmacenesPage
