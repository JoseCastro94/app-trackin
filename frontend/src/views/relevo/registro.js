import {useTheme} from "@mui/material/styles";
import {
    Alert, AlertTitle,
    Avatar,
    Button,
    ButtonGroup, Checkbox,
    Container, Divider,
    Grid,
    IconButton, List, ListItem, ListItemAvatar, ListItemText,
    MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField, Tooltip,
    Typography
} from "@mui/material";
import Select  from "@mui/material/Select";
import {gridSpacing} from "../../store/constant";
import * as React from "react";
import {obtenerAlmacenes} from "../../services/Usuario";
import SearchIcon from "@mui/icons-material/Search";
import {AssignmentTurnedIn, InfoOutlined, UploadFile} from "@mui/icons-material";
import {listarStocks} from "../../services/Stock";
import MainModal from "../../ui-component/modals/MainModal";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {registrarIncidencia} from "../../services/Incidencia";
import {listarParametros} from "../../services/Parametro";
import ModalSelectItem from "../shared/ModalSelectItem";
import {useNavigate} from "react-router-dom";
import {
    generarCargoHistorialResponsableAlmacenPdf,
    guardarHistorialResponsableAlmacen, subirCargoResponsableAlmacen
} from "../../services/HistorialResponsableAlmacen";
import moment from "moment";
import {validarFile} from "../utilities/Util";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DialogMain from "../../ui-component/alerts/DialogMain";
import {modeContext} from "../../context/modeContext";
const iniAutocomplete = [{IdAlmacen: 'select', nombre: '-- Selecciones --'}]
const dataInit = {
    IdAlmacen: iniAutocomplete[0].IdAlmacen,
    documento: '',
    Nombre: '',
    correo: '',
    fecha_inicio: moment().format('YYYY-MM-DD HH:mm'),
    razon_social: '',
    comentario: '',
    articulos: [],
    attach: ''
}
const dataIncidenteInit = {
    IdAlmacen: '',
    almacen: '',
    IdNegocio: '',
    IdArticulo: '',
    Cantidad: '',
    Comentario: '',
    IdParametro: iniAutocomplete[0].id,
    IdTipo: iniAutocomplete[0].id,
    Adjuntos: [],
    U_BPP_TIPUNMED: '',
    U_Devolucion: '',
    U_Evaluacion: '',
    Grupo: '',
    ItemCode: '',
    ItemName: ''
}
const columnsModalSelectUser = [
    { field: 'tipo_doc', headerName: 'Tipo', width: 50 },
    { field: 'num_doc', headerName: 'Num. Doc.', width: 150 },
    { field: 'nombres', headerName: 'Nombres', width: 150 },
    { field: 'ape_paterno', headerName: 'Apellido Materno', width: 150 },
    { field: 'ape_materno', headerName: 'Apellido Paterno', width: 150 },
    { field: 'correo', headerName: 'Correo', width: 200 },
]

const RegistroRelevoPage = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const [canEdit, setCanEdit] = React.useState(true)
    const [uploading, setUploading] = React.useState(false)
    const [incidente, setIncidente] = React.useState(dataIncidenteInit)
    const [almacenes, setAlmacenes] = React.useState(iniAutocomplete)
    const [articulos, setArticulos] = React.useState([])
    const [incidentes, setIncidentes] = React.useState([])
    const [tipoIncidentes, setTipoIncidentes] = React.useState([])
    const [comentarioRelevo, setComentarioRelevo] = React.useState('')
    const [relevo, setRelevo] = React.useState(dataInit)
    const [listFile, setListFile] = React.useState([])
    const [openModalSelectUser, setOpenModalSelectUser] = React.useState(false)
    const [openModalRegistrarIncidencia, setOpenModalRegistrarIncidencia] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [openAlert, setOpenAlert] = React.useState(false)
    const [alert, setAlert] = React.useState({ message: '', severity: 'success' })
    const [action, setAction] = React.useState('SAVE')
    const { token, tokenCompany } = React.useContext(modeContext)
    const handleCloseModalRegistrarIncidencia = () => setOpenModalRegistrarIncidencia(false)
    const handleOpenModalRegistrarIncidencia = (articulo) => {
        console.log('handleOpenModalRegistrarIncidencia')
        setListFile([])
        const almacen = almacenes.find(almacen => almacen.id === articulo.id_almacen)
        articulo.almacen = almacen.nombre
        articulo.IdAlmacen = articulo.id_almacen
        articulo.IdNegocio = articulo.id_negocio
        articulo.IdArticulo = articulo.id_articulo
        articulo.Cantidad = articulo.stock - articulo.cantidad
        articulo.Adjuntos = []
        articulo.U_BPP_TIPUNMED = articulo.unidad_medida
        articulo.U_Devolucion = articulo.devolucion
        articulo.U_Evaluacion = articulo.evaluacion
        articulo.Grupo = articulo.negocio
        articulo.ItemCode = articulo.codigo
        articulo.ItemName = articulo.descripcion
        articulo.IdParametro = iniAutocomplete[0].id
        articulo.IdTipo = iniAutocomplete[0].id
        setIncidente(articulo)
        setOpenModalRegistrarIncidencia(true)
    }
    const handleOpenModalSelectUser = (user, value) => {
        setOpenModalSelectUser(value)
    }

    const load = React.useCallback(async () => {
        const almacenes = await obtenerAlmacenes({}, token, tokenCompany)
        const tipoIncidentes = await listarParametros(process.env.REACT_APP_ID_GRUPO_PARAMETRO_TIPO_INCIDENTES, token, tokenCompany)
        let incidentes = await listarParametros(process.env.REACT_APP_ID_GRUPO_PARAMETRO_INCIDENTES, token, tokenCompany)
        incidentes = incidentes.filter(incidente => incidente.valor_1 === 'INCIDENTE')
        almacenes.unshift(iniAutocomplete[0])
        incidentes.unshift(iniAutocomplete[0])
        tipoIncidentes.unshift(iniAutocomplete[0])
        setAlmacenes(almacenes)
        setIncidentes(incidentes)
        setTipoIncidentes(tipoIncidentes)
        setRelevo(dataInit)
    }, [token, tokenCompany])

    const handleChangeAlmacen = async (event) => {
        const data = {...relevo}
        data.id_almacen = event.target.value
        setRelevo(data)
    }

    const handleChangeComentario = (event) => {
        setComentarioRelevo(event.target.value)
    }

    const handleChangeIncidenteComentario = (value) => {
        const data = {...incidente}
        data.Comentario = value
        setIncidente(data)
    }

    const handleChecked = (index) => {
        const articulo = {...articulos[index], checked: !articulos[index].checked}
        const newArticulos = [...articulos]
        newArticulos.splice(index, 1, articulo)
        setArticulos(newArticulos)
    }

    const handleFileUpload = (e) => {
        setUploading(true)
        const file = validarFile(e)

        if (!file.status) {
            setUploading(false)
            //setAlert(file)
            //setOpenAlert(true)
            return
        }
        fetch(process.env.REACT_APP_API + 'business/api/incidente_adjunto/file', {
            method: 'POST',
            body: file.data
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log(response)
                e.target.value = ""
                setUploading(false)
                setListFile(list => [...list, response])
            })
    }

    const handleSubirCargo = async (event) => {
        const file = validarFile(event)
        if (!file.status) {
            //alert(file.message)
            return false
        }
        const uploadFile = await subirCargoResponsableAlmacen(file.data, token, tokenCompany)
        const dataRelevo = {...relevo}
        dataRelevo.attach = uploadFile.key
        setRelevo(dataRelevo)
    }

    const handleChangeCantidadRecibida = (index, value) => {
        const articulo = {...articulos[index], cantidad: value}
        articulo.incidencia = value ? articulo.stock > value : false
        const newArticulos = [...articulos]
        newArticulos.splice(index, 1, articulo)
        setArticulos(newArticulos)
    }

    const handleSelectUser = async (user) => {
        const data = {...relevo}
        data.documento = user.num_doc
        data.nombre = user.nombres
        data.correo = user.correo
        setRelevo(data)
    }

    const handleChangeEstadoIncidente = (event) => {
        const data = {...incidente}
        data.IdParametro = event.target.value
        setIncidente(data)
    }
    const handleChangeTipoIncidente = (event) => {
        const data = {...incidente}
        data.IdTipo = event.target.value
        setIncidente(data)
    }

    const handleIniciar = async () => {
        setCanEdit(false)
        const articulos = await listarStocks(`id_almacen=${relevo.id_almacen}`, token, tokenCompany)
        setArticulos(articulos)
    }

    const handleGuardar = async () =>{
        setOpenDialog(false)

        if (action === 'SAVE') {
            relevo.articulos = articulos
            relevo.comentario = comentarioRelevo
            const response = await guardarHistorialResponsableAlmacen(relevo, token, tokenCompany)
            if (response.success) {
                navigate(`${process.env.PUBLIC_URL}/relevos`)
            }
        } else {
            const dataSave = {...incidente, Adjuntos: listFile, serie: {
                    IdControlSerie: incidente.id_serie,
                    SerialNumber: incidente.serie
                }}

            const response = await registrarIncidencia(dataSave)
            if (response.status === 'Ok') {
                const index = articulos.findIndex(articulo =>
                    articulo.codigo === incidente.codigo &&
                    articulo.serie === incidente.serie &&
                    articulo.negocio === incidente.negocio
                )
                const articulo = {...articulos[index]}
                articulo.stock = articulo.stock - incidente.Cantidad
                const newArticulos = [...articulos]
                newArticulos.splice(index, 1, articulo)
                setArticulos(newArticulos)
                setOpenModalRegistrarIncidencia(false)
            }
            setAlert(response)
            setOpenAlert(true)
        }
    }

    const generarCargoHistorialRelevoAlmacen = async () => {
        relevo.articulos = articulos
        const pdf = await generarCargoHistorialResponsableAlmacenPdf(relevo, token, tokenCompany)
        window.open(URL.createObjectURL(pdf))
    }

    const handleRemoveFile = (IdAdjunto) => {
        return () => {
            setListFile(list => {
                return list.filter(f => f.IdAdjunto !== IdAdjunto)
            })
        }
    }

    React.useEffect(() => {
        load()
    }, [load, token, tokenCompany])

    return <Container fixed>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Nuevo Responsable
                </Typography>
            </Grid>
        </Grid>
        <br/>
        <Grid item xs={12} sm={12}>
            <Typography variant='h4'
                        sx={{ color: theme.palette.secondary.main, fontWeight: '100' }}>
                Persona asignada
            </Typography>
        </Grid>
        <Divider sx={{mb: 2}}></Divider>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={3} sm={3}>
                <p>Almacén</p>
                <Select
                    IdAlmacen="select-almacen"
                    value={relevo.id_almacen}
                    size={"small"}
                    fullWidth
                    disabled={!canEdit}
                    onChange={handleChangeAlmacen}
                >
                    {almacenes.map((almacen,index) => (
                        <MenuItem key={index} value={almacen.id}>{almacen.nombre}</MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item xs={3} sm={3}>
                <p>DNI</p>
                <ButtonGroup aria-label="outlined primary button group" fullWidth>
                    <TextField
                        //disabled={!canEdit}
                        type="text"
                        size='small'
                        value={relevo.documento}
                        disabled={true}
                        fullWidth
                    />
                    <IconButton
                        disabled={!canEdit}
                        aria-label="find"
                        size="small"
                        color="primary"
                        onClick={() => { handleOpenModalSelectUser(null, true) }}
                    >
                        <SearchIcon></SearchIcon>
                    </IconButton>
                </ButtonGroup>
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>Nombre</p>
                <TextField
                    //disabled={!canEdit}
                    disabled={true}
                    type={"text"}
                    size={"small"}
                    fullWidth
                    value={relevo.nombre}/>
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>Razón Social</p>
                <TextField
                    // disabled={!canEdit}
                    disabled={true}
                    type={"text"}
                    size={"small"}
                    fullWidth
                    value={relevo.razon_social}/>
            </Grid>
            <Grid item xs={2} sm={2}>
                <p>&nbsp;</p>
                <Button variant="contained"
                        color={"primary"}
                        fullWidth
                        onClick={() => {
                            handleIniciar()
                        }}>
                    Iniciar
                </Button>
            </Grid>
        </Grid>
        <br/>
        <Grid item xs={12} sm={12}>
            <Typography variant='h4'
                        sx={{ color: theme.palette.secondary.main, fontWeight: '100' }}>
                Resumen de artículos
            </Typography>
        </Grid>
        <Divider sx={{mb: 2}}></Divider>
        <Grid item xs={12} sm={12}>
            <TableContainer component={Paper} style={{borderRadius: "0px"}}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                            <TableCell sx={{ width: 5 }}/>
                            <TableCell align="center">Codigo</TableCell>
                            <TableCell align="center">Descripción</TableCell>
                            <TableCell align="center">Categoría</TableCell>
                            <TableCell align="center">Serie</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Negocio</TableCell>
                            <TableCell align="center">Cant.</TableCell>
                            <TableCell align="center">Cant. Recib.</TableCell>
                            <TableCell align="center">Incidencia</TableCell>
                            <TableCell align="center" sx={{ width: 50 }}>Revisado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {articulos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((articulo, index) => {
                            return <TableRow key={index} sx={{
                                'td > p': {p: 0, m: 0},
                                'td, th': {px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"},
                                'td': {bgcolor: "grey.200"},
                                'th': {bgcolor: "primary.200"}
                            }}>
                                <TableCell width={15} component="th"></TableCell>
                                <TableCell align="center"><p>{articulo.codigo}</p></TableCell>
                                <TableCell align="left"><p>{articulo.descripcion}</p></TableCell>
                                <TableCell align="center"><p>{articulo.categoria}</p></TableCell>
                                <TableCell align="center"><p>{articulo.serie ?? 'N/A'}</p></TableCell>
                                <TableCell align="left"><p>{articulo.estado}</p></TableCell>
                                <TableCell align="left"><p>{articulo.negocio}</p></TableCell>
                                <TableCell align="right"><p>{articulo.stock}</p></TableCell>
                                <TableCell sx={{"input": {padding: "4px 8px", textAlign: "right"}, textAlign: "center"}}>
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        sx={{ width: 60 }}
                                        onChange={(event) => handleChangeCantidadRecibida(articulo.index, event.target.value) }
                                        value={articulo.cantidad}/>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        disabled={!articulo.incidencia}
                                        aria-label="find"
                                        size="small"
                                        color="primary"
                                        onClick={() => handleOpenModalRegistrarIncidencia(articulo)}
                                    >
                                        <InfoOutlined></InfoOutlined>
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={!!articulo.checked}
                                        onChange={(event) => handleChecked(articulo.index)}
                                        inputProps={{
                                            'aria-labelledby': `enhanced-table-checkbox-${index}`,
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20]}
                component="div"
                count={articulos.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Grid>
        <br/>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={8} sm={8}>
                <label style={{fontSize: 10}}>&nbsp;</label>
                <TextField
                    type={"text"}
                    onChange={handleChangeComentario.bind(this)}
                    value={comentarioRelevo}
                    fullWidth
                    size={"small"}
                    name="comentario-relevo"
                    sx={{ width: "100%" }}
                    placeholder="Escribe aquí tus comentarios"/>
            </Grid>
            <Grid item xs={1} sm={1}>
                <br/>
                <Tooltip title="Descargar cargo">
                    <IconButton
                        component="span"
                        size="small"
                        color="primary"
                        onClick={() => {
                            generarCargoHistorialRelevoAlmacen()
                        }}
                    >
                        <AssignmentTurnedIn></AssignmentTurnedIn>
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid item xs={1} sm={1}>
                <br/>
                <label style={{fontSize: 10}} htmlFor="file">
                    <input id="file" type="file" onChange={handleSubirCargo} hidden/>
                    <Tooltip title="Subir cargo">
                        <IconButton
                            component="span"
                            size="small"
                            color="primary"
                        >
                            <UploadFile></UploadFile>
                        </IconButton>
                    </Tooltip>
                </label>
            </Grid>
            <Grid item xs={1} sm={1}>
                <label style={{fontSize: 10}}>&nbsp;</label>
                <Button variant="contained"
                        color={"secondary"}
                        fullWidth
                        onClick={() => navigate(`${process.env.PUBLIC_URL}/relevos`)}>
                    Regresar
                </Button>
            </Grid>
            <Grid item xs={1} sm={1}>
                <label style={{fontSize: 10}}>&nbsp;</label>
                <Button variant="contained"
                        color={"primary"}
                        fullWidth
                        onClick={() => {
                            setAction('SAVE')
                            setOpenDialog(true)
                        }}>
                    Guardar
                </Button>
            </Grid>
        </Grid>
        <MainModal
            open={openModalRegistrarIncidencia}
            onClose={handleCloseModalRegistrarIncidencia}
            aria_labelledby="modal-find-worker"
            aria_describedby="modal-find-pick-worker"
            style={{width: 1000, margin: "0px auto"}}
        >
            <Typography id="modal-find-worker" variant="h3" component="h2">
                Registro de incidencia
            </Typography>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={2} sm={2}>
                    <p>Almacén</p>
                    <TextField
                        disabled={true}
                        value={incidente.almacen}
                        fullWidth
                        size={"small"}
                        sx={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <p>Cod. Producto</p>
                    <TextField
                        disabled={true}
                        value={incidente.ItemCode}
                        fullWidth
                        size={"small"}
                        sx={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={5} sm={5}>
                    <p>Descripción</p>
                    <TextField
                        disabled={true}
                        value={incidente.ItemName}
                        fullWidth
                        size={"small"}
                        sx={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={2} sm={2}>
                    <p>Categoría</p>
                    <TextField
                        disabled={true}
                        value={incidente.categoria}
                        fullWidth
                        size={"small"}
                        sx={{ width: "100%" }}/>
                </Grid>
            </Grid>
            <Divider sx={{mb: 1, mt: 2}}></Divider>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={3} sm={3}>
                    <p>Negocio</p>
                    <TextField
                        disabled={true}
                        value={incidente.Grupo}
                        fullWidth
                        size={"small"}
                        sx={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={2} sm={2}>
                    <p>Cantidad</p>
                    <TextField
                        type={"number"}
                        value={incidente.Cantidad}
                        fullWidth
                        size={"small"}
                        sx={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <p>Incidente</p>
                    <Select
                        id="select-almacen"
                        value={incidente.IdParametro}
                        size={"small"}
                        fullWidth
                        onChange={handleChangeEstadoIncidente}
                    >
                        {incidentes.map(incidente => (
                            <MenuItem key={incidente.id} value={incidente.id}>{incidente.nombre}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <p>Tipo Incidente</p>
                    <Select
                        id="select-tipo-incidente"
                        value={incidente.IdTipo}
                        size={"small"}
                        fullWidth
                        onChange={handleChangeTipoIncidente}
                    >
                        {tipoIncidentes.map(tipo => (
                            <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={12}>
                    <List dense={true}>
                        {
                            listFile.map((element) => (
                                <ListItem
                                    key={element.IdAdjunto}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={handleRemoveFile(element.IdAdjunto)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.primary[800],
                                                color: '#fff'
                                            }}
                                        >
                                            <AttachFileIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={element.Nombre}
                                        secondary={element.Mime}
                                    />
                                </ListItem>
                            ))
                        }
                    </List>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <p>&nbsp;</p>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        sx={{ marginRight: "1rem" }}
                        fullWidth
                        disabled={uploading}
                    >
                        {
                            uploading ? "Cargando..." : "Subir documento"
                        }
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            hidden
                        />
                    </Button>
                </Grid>
            </Grid>
            <br/>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={10} sm={10}>
                    <TextField
                        onChange={(event) => {
                            handleChangeIncidenteComentario(event.target.value)
                        }}
                        value={incidente.Comentario}
                        fullWidth
                        size={"small"}
                        sx={{ width: "100%" }}
                        placeholder="Escribe aquí tus comentarios"/>
                </Grid>
                <Grid item xs={2} sm={2}>
                    <Button variant="contained"
                            color={"primary"}
                            fullWidth
                            onClick={() => {
                                setAction('SAVE-INCIDENTE')
                                setOpenDialog(true)
                            }}>
                        Registrar
                    </Button>
                </Grid>
            </Grid>
        </MainModal>
        <ModalSelectItem
            open={openModalSelectUser}
            handleClose={() => { handleOpenModalSelectUser(null, false) }}
            handleSelectedArticle={handleSelectUser}
            url={process.env.REACT_APP_API + 'business/api/usuario/responsables'}
            title={'Lista de almaceneros'}
            columns={columnsModalSelectUser}
            param={{}}
        />
        <DialogMain
            open={openDialog}
            title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>Confirmación</Typography>
                  </div>
                }
            body={action === 'SAVE' ? '¿Deseas registrar el relevo en el sistema?' : '¿Deseas registrar el incidente?'}
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

export default RegistroRelevoPage
