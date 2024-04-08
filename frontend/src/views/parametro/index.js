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
    actualizarParametro,
    crearParametro,
    eliminarParametro,
    listarParametrosPaginacion,
    importarParametros,
} from "../../services/Parametro";

import {ArrowDropDown, Edit} from "@mui/icons-material";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DeleteIcon from "@mui/icons-material/Delete";
import {IconCheckbox, IconSearch} from "@tabler/icons";
import {useRef} from "react";
import {validarFile} from "../utilities/Util";
import Select from "@mui/material/Select";
import {listarGrupoParametros} from "../../services/GrupoParametro";
import {modeContext} from "../../context/modeContext";

const ParametrosPage = () => {
    const theme = useTheme()
    const dataIni = {
        id: '',
        Nombre: '',
        Descripcion: '',
        IdGrupo: ' ',
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
    const [parametro, setParametro] = React.useState(dataIni)
    const [grupos, setGrupos] = React.useState([])
    const [parametros, setParametros] = React.useState({ count: 0, rows: [] })
    const [idParametro, setIdParametro] = React.useState(0)
    const [filtroPorNombre, setFiltroPorNombre] = React.useState('');
    const [filtroPorGrupo, setFiltroPorGrupo] = React.useState(' ');
    const [openModalErroresImportacionData, setOpenModalErroresImportacionData] = React.useState(false)
    const { token, tokenCompany } = React.useContext(modeContext)
    const [erroresImportacionData, setErroresImportacionData] = React.useState({
        parametrosSuccess: 0,
        parametrosErrors: []
    })

    const loadParametros = React.useCallback(async (pageInit = page, limit = rowsPerPage) => {
        const filter = []
        if (filtroPorNombre.trim())
            filter.push(`Nombre lk ${filtroPorNombre.trim().replace(' ', '_')}`)
        if (filtroPorGrupo.trim())
            filter.push(`Parametros.IdGrupo eq ${filtroPorGrupo.trim()}`)

        const response = await listarParametrosPaginacion({
            page: pageInit + 1,
            limit,
            filters: filter.join(' and ')
        }, token, tokenCompany)

        if (!response.hasOwnProperty('success')) {
            setParametros(response)
        } else {
            setAlert(response)
            setOpenAlert(true)
        }
    },  [filtroPorNombre, filtroPorGrupo, page, rowsPerPage, token, tokenCompany])

    const load = React.useCallback(async () => {
        await loadParametros()
        const grupos = await listarGrupoParametros({
            page: 0,
            limit: 1000
        }, token, tokenCompany)
        setGrupos(grupos.rows || [])
    }, [loadParametros, token, tokenCompany])

    const handleCloseModalRegistrar = () => setOpenModalRegistrar(false)

    const handleChangePage = async (event, newPage) => {
        await loadParametros(newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        await loadParametros(0, event.target.value)
    };

    const handleGuardar = async () => {
        setOpenDialog(false)
        let response = null
        const objAlert = { message: null, severity: 'info' }

        if (parametro.Nombre === '' && action !== 'DELETE') {
            objAlert.message = 'Campo Nombre es requerido.'
        } else {
            switch (action) {
                case 'DELETE':
                    response = await eliminarParametro(idParametro, token, tokenCompany)
                    break
                case 'UPDATE':
                    response = await actualizarParametro(parametro, token, tokenCompany)
                    break
                default:
                    response = await crearParametro(parametro, token, tokenCompany)
                    break
            }

            if (response.success) {
                await loadParametros()
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
            //setAlert2(file)
            //setOpenAlert(true)
            return
        }

        const response = await importarParametros(file.data, token, tokenCompany)
        setUploading(false)
        setPage(0);
        await loadParametros(0)
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
                    Lista de Parametros
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
                            setParametro(dataIni)
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
                        value={filtroPorGrupo}
                        size={"small"}
                        fullWidth
                        onChange={async (event) => {
                            setFiltroPorGrupo(event.target.value)
                        }}
                    >
                        <MenuItem value=" ">-- Seleccione Grupo --</MenuItem>
                        {grupos.map((grupo, index) => (
                            <MenuItem key={index} value={grupo.id}>{grupo.Nombre}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <IconButton size={"small"}
                                onClick={ async () => {
                                    await loadParametros(0, rowsPerPage)
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
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Descripción</TableCell>
                            <TableCell align="center">Grupo</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center" sx={{ width: 100 }}>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {parametros.rows.map((parametro, index) => (
                            <TableRow key={index} sx={{
                                'td > p': {p: 0, m: 0},
                                'td, th': {px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"},
                                'td': {bgcolor: "grey.200"},
                                'th': {bgcolor: "primary.200"}
                            }}>
                                <TableCell width={15} component="th"></TableCell>
                                <TableCell align="center"><p>{parametro.Nombre}</p></TableCell>
                                <TableCell align="left"><p>{parametro.Descripcion}</p></TableCell>
                                <TableCell align="left"><p>{parametro.Grupo}</p></TableCell>
                                <TableCell align="left"><p>{parametro.Activo}</p></TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color="primary"
                                        onClick={ async () => {
                                            setOpenModalRegistrar(true)
                                            setParametro(parametro)
                                        }}
                                    >
                                        <Edit></Edit>
                                    </IconButton>
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color={parametro.Activo === 'Activo' ? "error" : "success"}
                                        onClick={() => {
                                            setIdParametro(parametro.id)
                                            setTextConfirm(`¿Está seguro de ${parametro.Activo === 'Activo' ? 'eliminar' : 'activar'} el parámetro?`)
                                            setAction('DELETE')
                                            setOpenDialog(true)
                                        }}
                                    >
                                        {parametro.Activo === 'Activo' ? <DeleteIcon/> : <IconCheckbox/>}

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
                count={parametros.count}
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
                Registro de parametros
            </Typography>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <p>Grupo</p>
                    <Select
                        value={parametro.IdGrupo}
                        size={"small"}
                        fullWidth
                        onChange={async (event) => {
                            setParametro({...parametro, IdGrupo: event.target.value})
                        }}
                    >
                        <MenuItem value=" ">-- Seleccione --</MenuItem>
                        {grupos.map((grupo, index) => (
                            <MenuItem key={index} value={grupo.id}>{grupo.Nombre}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <p>Nombre</p>
                    <TextField
                        value={parametro.Nombre}
                        fullWidth
                        size={"small"}
                        onChange={(event) => {
                            setParametro({...parametro, Nombre: event.target.value})
                        }}/>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <p>Descripción</p>
                    <TextField
                        value={parametro.Descripcion}
                        fullWidth
                        size={"small"}
                        onChange={(event) => {
                            setParametro({...parametro, Descripcion: event.target.value})
                        }}/>
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
                            disabled={ !parametro.Nombre }
                            onClick={async () => {
                                setTextConfirm(parametro.id ? '¿Deseas actualizar el grupo parametro?' : '¿Deseas registrar el grupo parametro?')
                                setAction(parametro.id ? 'UPDATE' : 'SAVE')
                                setOpenDialog(true)
                            }}>
                        {
                            parametro.id ? 'Actualizar' : 'Registrar'
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
                <p>Datos correctos {erroresImportacionData.parametrosSuccess}</p>
                <p>Datos con errores {erroresImportacionData.parametrosErrors.length}</p>
                <br/>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                            <TableCell/>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Descripción</TableCell>
                            <TableCell align="center">Grupo</TableCell>
                            <TableCell align="center">Observaciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {erroresImportacionData.parametrosErrors.map((item, index) => (
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
                                    <p>{item.Grupo}</p>
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
        <a ref={downloadFile} href="./bucket/PARAMETROS_CARGA_INICIAL.xlsx" target={"_blank"} download hidden/>

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

export default ParametrosPage
