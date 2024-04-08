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
import DialogMain from "../../ui-component/alerts/DialogMain";
import {
    actualizarGrupoArticulo, crearGrupoArticulo,
    eliminarGrupoArticulo, importarGrupoArticulos,
    listarGrupoArticulos

} from "../../services/GrupoArticulo";
import {ArrowDropDown, Edit} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import {IconCheckbox, IconSearch} from "@tabler/icons";
import {useRef} from "react";
import {validarFile} from "../utilities/Util";
import Select from "@mui/material/Select";
import {modeContext} from "../../context/modeContext";

const GrupoArticulosPage = () => {
    const theme = useTheme()
    const dataIni = {
        id: '',
        Nombre: '',
        Descripcion: '',
        U_Devolucion: 'N',
        U_DiasEntrega: 0,
        U_Evaluacion: 'N',
        TieneSerie: 'false',
        IdEmpresa: ' ',

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
    // const [empresas, setEmpresas] = React.useState([])
    const [grupoArticulo, setGrupoArticulo] = React.useState(dataIni)
    const [grupoArticulos, setGrupoArticulos] = React.useState({ count: 0, rows: [] })
    const [idGrupoArticulo, setIdGrupoArticulo] = React.useState(0)
    const [filtroPorNombre, setFiltroPorNombre] = React.useState('');
    // const [filtroPorEmpresa, setFiltroPorEmpresa] = React.useState(' ');
    const [openModalErroresImportacionData, setOpenModalErroresImportacionData] = React.useState(false)
    const [erroresImportacionData, setErroresImportacionData] = React.useState({
        grupoArticulosSuccess: 0,
        grupoArticulosErrors: []
    })
    const { token, tokenCompany } = React.useContext(modeContext)

    const loadGrupoArticulos = React.useCallback(async (pageInit = page, limit = rowsPerPage) => {
        const filter = []
        if (filtroPorNombre.trim()){
            filter.push(`GrupoArticulos.Nombre lk ${filtroPorNombre.trim().replace(' ', '_')}`)
        }
        //if (filtroPorEmpresa.trim())
        //    filter.push(`GrupoArticulos.IdEmpresa eq ${filtroPorEmpresa.trim()}`)

        const response = await listarGrupoArticulos({
            page: pageInit + 1,
            limit,
            filters: filter.join(' and ')
        }, token, tokenCompany)

        if (!response.hasOwnProperty('success')) {
            setGrupoArticulos(response)
        } else {
            setAlert(response)
            setOpenAlert(true)
        }
    }, [token, tokenCompany, page, rowsPerPage, filtroPorNombre])

    const handleCloseModalRegistrar = () => setOpenModalRegistrar(false)

    const handleChangePage = async (event, newPage) => {
        await loadGrupoArticulos(newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        await loadGrupoArticulos(0, event.target.value)
    };

    const handleGuardar = async () => {
        setOpenDialog(false)
        let response = null
        const objAlert = { message: null, severity: 'info' }

        if (grupoArticulo.Nombre === '' && action !== 'DELETE') {
            objAlert.message = 'Campo Nombre es requerido.'
        } else {
            switch (action) {
                case 'DELETE':
                    response = await eliminarGrupoArticulo(idGrupoArticulo, token, tokenCompany)
                    break
                case 'UPDATE':
                    response = await actualizarGrupoArticulo(grupoArticulo, token, tokenCompany)
                    break
                default:
                    response = await crearGrupoArticulo(grupoArticulo, token, tokenCompany)
                    break
            }

            if (response.success) {
                await loadGrupoArticulos()
                setOpenModalRegistrar(false)
            }

            setAlert(response)
            setOpenAlert(true)
        }

        if (objAlert.message) {
            setAlert(objAlert)
            setOpenAlert(true)
        }
    }

    const handleImportData = async (e) => {
        setUploading(true)
        const file = validarFile(e)

        if (!file.status) {
            setUploading(false)
            return
        }

        const response = await importarGrupoArticulos(file.data, token, tokenCompany)
        setUploading(false)
        setPage(0);
        await loadGrupoArticulos(0)
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
        loadGrupoArticulos()
    }, [loadGrupoArticulos, token, tokenCompany])

    return <Container fixed>
        <Grid container>
            <Grid item xs={6} sm={8}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Lista de Grupo Articulos
                </Typography>
            </Grid>
            <Grid item xs={6} sm={4} style={{textAlign: "right"}}>
                {/* <React.Fragment>
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
                            setGrupoArticulo(dataIni)
                            setOpenModalRegistrar(true)
                        }}
                >Nuevo</Button> */}
            </Grid>
        </Grid>
        <br/>
        <Grid item xs={12} sm={12}>
            <Grid container spacing={gridSpacing}>
                {/*<Grid item xs={3} sm={3}>
                    <Select
                        value={filtroPorEmpresa}
                        size={"small"}
                        fullWidth
                        onChange={async (event) => {
                            setFiltroPorEmpresa(event.target.value)
                        }}
                    >
                        <MenuItem value=" ">-- Seleccione Empresa --</MenuItem>
                        {empresas.map((empresa, index) => (
                            <MenuItem key={index} value={empresa.id}>{empresa.razonSocial}</MenuItem>
                        ))}
                    </Select>
                </Grid>*/}
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
                    <IconButton size={"small"}
                                onClick={ async () => {
                                    await loadGrupoArticulos(0, rowsPerPage)
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
                            <TableCell align="center">Negocio</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Descripción</TableCell>
                            <TableCell align="center">¿Aplica devolución?</TableCell>
                            <TableCell align="center">¿Días máximos para devolución?</TableCell>
                            <TableCell align="center">¿Aplica Evaluación en su devolución?</TableCell>
                            <TableCell align="center">¿Aplica control por serie? </TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center" sx={{ width: 100 }}>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grupoArticulos.rows.map((grupoArticulo, index) => (
                            <TableRow key={index} sx={{
                                'td > p': {p: 0, m: 0},
                                'td, th': {px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"},
                                'td': {bgcolor: "grey.200"},
                                'th': {bgcolor: "primary.200"}
                            }}>
                                <TableCell width={15} component="th"></TableCell>
                                <TableCell align="center"><p>{grupoArticulo.negocio}</p></TableCell>
                                <TableCell align="center"><p>{grupoArticulo.Nombre}</p></TableCell>
                                <TableCell align="left"><p>{grupoArticulo.Descripcion}</p></TableCell>
                                <TableCell align="center"><p>{grupoArticulo.U_Evaluacion === 'Y' ? 'SI' : 'NO'}</p></TableCell>
                                <TableCell align="right"><p>{grupoArticulo.U_DiasEntrega}</p></TableCell>
                                <TableCell align="center"><p>{grupoArticulo.U_Devolucion === 'Y' ? 'SI' : 'NO'}</p></TableCell>
                                <TableCell align="center"><p>{grupoArticulo.TieneSerie ? 'SI' : 'NO'}</p></TableCell>
                                <TableCell align="center"><p>{grupoArticulo.Activo ? 'ACTIVO': 'INACTIVO'}</p></TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color="primary"
                                        onClick={ async () => {
                                            setOpenModalRegistrar(true)
                                            setGrupoArticulo(grupoArticulo)
                                        }}
                                    >
                                        <Edit></Edit>
                                    </IconButton>
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color={grupoArticulo.Activo ? "error" : "success"}
                                        onClick={() => {
                                            setIdGrupoArticulo(grupoArticulo.id)
                                            setTextConfirm(`¿Está seguro de ${grupoArticulo.Activo ? 'eliminar' : 'activar'} el grupo artículo?`)
                                            setAction('DELETE')
                                            setOpenDialog(true)
                                        }}
                                    >
                                        {grupoArticulo.Activo ? <DeleteIcon/> : <IconCheckbox/>}

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
                count={grupoArticulos.count}
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
                Registro de Grupo Articulo
            </Typography>
            <Grid container spacing={gridSpacing}>
                {/*<Grid item xs={6} sm={6}>
                    <p>Empresa</p>
                    <Select
                        value={grupoArticulo.IdEmpresa}
                        size={"small"}
                        fullWidth
                        onChange={async (event) => {
                            setGrupoArticulo({...grupoArticulo, IdEmpresa: event.target.value})
                        }}
                    >
                        <MenuItem value=" ">-- Seleccione --</MenuItem>
                        {empresas.map((empresa, index) => (
                            <MenuItem key={index} value={empresa.id}>{empresa.razonSocial}</MenuItem>
                        ))}
                    </Select>
                </Grid>*/}
                <Grid item xs={12} sm={12}>
                    <p>Nombre</p>
                    <TextField
                        value={grupoArticulo.Nombre}
                        disabled
                        fullWidth
                        size={"small"}
                        onChange={(event) => {
                            setGrupoArticulo({...grupoArticulo, Nombre: event.target.value})
                        }}/>
                </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <p>Descripción</p>
                    <TextField
                        value={grupoArticulo.Descripcion}
                        disabled
                        fullWidth
                        size={"small"}
                        onChange={(event) => {
                            setGrupoArticulo({...grupoArticulo, Descripcion: event.target.value})
                        }}/>
                </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={3} sm={3}>
                    <p>¿Aplica devolución?</p>
                    <Select
                        value={grupoArticulo.U_Devolucion}
                        size={"small"}
                        fullWidth
                        onChange={async (event) => {
                            const data = {...grupoArticulo, U_Devolucion: event.target.value}
                            if (data.U_Devolucion === 'N') {
                                data.U_DiasEntrega = 0
                                data.U_Evaluacion = 'N'
                            }
                            setGrupoArticulo(data)
                        }}
                    >
                        <MenuItem value="Y">Si</MenuItem>
                        <MenuItem value="N">No</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <p>¿Días máximos para devolución?</p>
                    <TextField
                        disabled={grupoArticulo.U_Devolucion === 'N'}
                        type={"number"}
                        value={grupoArticulo.U_DiasEntrega}
                        fullWidth
                        size={"small"}
                        onChange={(event) => {
                            setGrupoArticulo({...grupoArticulo, U_DiasEntrega: event.target.value})
                        }}/>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <p>¿Aplica Evaluación en su devolución?</p>
                    <Select
                        disabled={grupoArticulo.U_Devolucion === 'N'}
                        value={grupoArticulo.U_Evaluacion}
                        size={"small"}
                        fullWidth
                        onChange={async (event) => {
                            setGrupoArticulo({...grupoArticulo, U_Evaluacion: event.target.value})
                        }}
                    >
                        <MenuItem value="Y">Si</MenuItem>
                        <MenuItem value="N">No</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <p>¿Aplica control por serie? </p>
                    <Select
                        value={grupoArticulo.TieneSerie}
                        size={"small"}
                        fullWidth
                        onChange={async (event) => {
                            setGrupoArticulo({...grupoArticulo, TieneSerie: event.target.value})
                        }}
                    >
                        <MenuItem value="true">Si</MenuItem>
                        <MenuItem value="false">No</MenuItem>
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
                            disabled={ !grupoArticulo.Nombre && grupoArticulo.IdEmpresa.trim() === '' }
                            onClick={async () => {
                                setTextConfirm(grupoArticulo.id ? '¿Deseas actualizar el grupo artículo?' : '¿Deseas registrar el grupo artículo?')
                                setAction(grupoArticulo.id ? 'UPDATE' : 'SAVE')
                                setOpenDialog(true)
                            }}>
                        {
                            grupoArticulo.id ? 'Actualizar' : 'Registrar'
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
                <p>Datos correctos {erroresImportacionData.grupoArticulosSuccess}</p>
                <p>Datos con errores {erroresImportacionData.grupoArticulosErrors.length}</p>
                <br/>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                            <TableCell/>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Descripción</TableCell>
                            <TableCell align="center">Aplica Devolución</TableCell>
                            <TableCell align="center">Días Devolución</TableCell>
                            <TableCell align="center">Aplica Evaluación</TableCell>
                            <TableCell align="center">Tiene Serie</TableCell>
                            <TableCell align="center">Observaciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {erroresImportacionData.grupoArticulosErrors.map((item, index) => (
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
                                <TableCell align={"center"}>
                                    <p>{item.AplicaDevolucion}</p>
                                </TableCell>
                                <TableCell align={"center"}>
                                    <p>{item.DiasDevolucion}</p>
                                </TableCell>
                                <TableCell align={"center"}>
                                    <p>{item.AplicaEvaluacion}</p>
                                </TableCell>
                                <TableCell align={"center"}>
                                    <p>{item.TieneSerie}</p>
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
        <a ref={downloadFile} href="./bucket/GRUPO_ARTICULOS_CARGA_INICIAL.xlsx" target={"_blank"} download hidden/>

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

export default GrupoArticulosPage
