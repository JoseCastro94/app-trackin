import {
    Button,
    Container,
    Grid, IconButton,
    Paper,
    Table,
    TableCell,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TablePagination,
    TextField,
    MenuItem,
    MenuList,
    Popper,
    Checkbox, Card, CardMedia, Divider, ButtonGroup, Grow, ClickAwayListener, Snackbar, Alert, AlertTitle, Box
} from "@mui/material";
import * as React from "react";
import {
    ArrowDropDown, Download,
    Edit,
    Image, KeyboardArrowLeft,
    KeyboardArrowRight,
} from "@mui/icons-material";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DeleteIcon from "@mui/icons-material/Delete";
import {useTheme} from "@mui/material/styles";
import {
    actualizarArticulo,
    buscarArticuloSap,
    crearArticulos, descargarFichaTecnica,
    eliminarArticulo, importarArticulos,
    listarArticulos, listarArticulosSap
} from "../../services/Articulo";
import MainModal from "../../ui-component/modals/MainModal";
import {gridSpacing} from "../../store/constant";
import Select from "@mui/material/Select";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {listarGruposArticulo} from "../../services/GrupoArticulo";
import {listarNegocios,listarNegociosArticulo} from "../../services/TipoNegocio";
import {saveFileAs, validarFile} from "../utilities/Util";
import {IconCheckbox, IconSearch} from "@tabler/icons";
import {listarParametros} from "../../services/Parametro";
import DialogMain from "../../ui-component/alerts/DialogMain";
import {modeContext} from "../../context/modeContext";

const ArticulosPage = () => {
    const theme = useTheme()
    const dataInit = {
        id: null,
        codigo: '',
        name: '',
        code_bar: '',
        unidad_medida: ' ',
        foto: '',
        ficha_tecnica: '',
        procedencia: ' ',
        id_grupo: ' ',
    }
    const urlPhotoDefault = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIF.FiFBrKIaDJpErmu3xESMFQ%26pid%3DApi&f=1'
    const inputFile = React.useRef(null)
    const downloadFile = React.useRef(null)
    const anchorRef = React.useRef(null)
    const [open, setOpen] = React.useState(false);
    const [uploading, setUploading] = React.useState(false)
    const [formData, setFormData] = React.useState(new FormData())
    const [openModalRegistrar, setOpenModalRegistrar] = React.useState(false)
    const [photo, setPhoto] = React.useState(urlPhotoDefault)
    const [articulo, setArticulo] = React.useState(dataInit)
    const [grupos, setGrupos] = React.useState([])
    const [medidas, setMedidas] = React.useState([])
    const [negocios, setNegocios] = React.useState({
        count: 0,
        rows: []
    })
    const [negociosAsignados, setNegociosAsignados] = React.useState([])
    const [articulos, setArticulos] = React.useState({
        count: 0,
        rows: []
    })
    const [page, setPage] = React.useState(0);
    const [pageArticulosSap, setPageArticulosSap] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rowsPerPageArticulosSap, setRowsPerPageArticulosSap] = React.useState(10);
    const [pageNegocios, setPageNegocios] = React.useState(0);
    const [rowsPerPageNegocios, setRowsPerPageNegocios] = React.useState(5);
    const [pageNegociosAsignados, setPageNegociosAsignados] = React.useState(0);
    const [rowsPerPageNegociosAsignados, setRowsPerPageNegociosAsignados] = React.useState(5);
    const [filtroPorCodigo, setFiltroPorCodigo] = React.useState('');
    const [filtroPorNombre, setFiltroPorNombre] = React.useState('');
    const [filtroPorGrupo, setFiltroPorGrupo] = React.useState(' ');
    const [filterNegocioPorNombre, setFilterNegocioPorNombre] = React.useState(' ');
    const [filterIdGrupoArticuloMaestro, setFilterIdGrupoArticuloMaestro] = React.useState('0');
    const [openDialog, setOpenDialog] = React.useState(false)
    const [openAlert, setOpenAlert] = React.useState(false)
    const [alert, setAlert] = React.useState({ message: '', severity: 'success' })
    const [textConfirm, setTextConfirm] = React.useState('')
    const [action, setAction] = React.useState('SAVE')
    const [idArticulo, setIdArticulo] = React.useState(0)
    const [textSearch, setTextSearch] = React.useState('')
    const [openModalErroresImportacionData, setOpenModalErroresImportacionData] = React.useState(false)
    const [erroresImportacionData, setErroresImportacionData] = React.useState({
        articulosSuccess: 0,
        articulosErrors: []
    })
    const { token, tokenCompany } = React.useContext(modeContext)

    const handleSelectedArticle = async (article) => {
        articulo.codigo = article.ItemCode
        articulo.name = article.ItemName
        setArticulo(articulo)
        setOpenModalArticulosSap(false)
    }

    const [openModalArticulosSap, setOpenModalArticulosSap] = React.useState(false)
    const [articulosSap, setArticulosSap] = React.useState({
        count: 0,
        rows: []
    })
    const [idsArticulos, setIdsArticulos] = React.useState([])


    const handleCloseModalRegistrar = () => setOpenModalRegistrar(false)
    const handleOpenModalRegistrar = () => {
        setFormData(new FormData())
        setArticulo(dataInit)
        setGrupos(grupos.map(grupo => {
            grupo.checked = false
            return grupo
        }))
        setPhoto(urlPhotoDefault)
        setNegociosAsignados([])
        setOpenModalRegistrar(true)
    }

    const loadArticulos = React.useCallback(async (pageInit = page, limit = rowsPerPage) => {
        const filter = []
        if (filtroPorCodigo.trim())
            filter.push(`ItemCode lk ${filtroPorCodigo.trim().replace(' ', '_')}`)

        if (filtroPorNombre.trim())
            filter.push(`ItemName lk ${filtroPorNombre.trim().replace(' ', '_')}`)

        if (filtroPorGrupo.trim())
            filter.push(`GrupoArticulo.IdGrupoArticuloMaestro eq ${filtroPorGrupo.trim()}`)

        const articulos = await listarArticulos({
            page: pageInit + 1,
            limit,
            filters: filter.join(' and ')
        }, token, tokenCompany)
        setArticulos(articulos)
    }, [filtroPorCodigo, filtroPorGrupo, filtroPorNombre, page, rowsPerPage, token, tokenCompany])

    const [filtroPorItemCode, setFiltroPorItemCode] = React.useState('');
    const [filtroPorItemName, setFiltroPorItemName] = React.useState('');
    const loadArticulosSap = async (pageInit = pageArticulosSap, limit = rowsPerPageArticulosSap) => {
        const articulosSap = await listarArticulosSap({
            page: pageInit + 1,
            limit,
            filters: `${filtroPorItemCode.trim()}|${filtroPorItemName.trim()}`
        }, token, tokenCompany)
        setArticulosSap(articulosSap)
    }

    const loadNegocios = React.useCallback(async (pageInit = pageNegocios, limit = rowsPerPageNegocios) => {
        const filter = []
        if (filterNegocioPorNombre.trim())
            filter.push(`TipoNegocio.Nombre lk ${filterNegocioPorNombre.trim()}`)
        if (negociosAsignados.length > 0) {
            const ids = negociosAsignados.map((negocio => negocio.id))
            filter.push(`GrupoArticulos.IdNegocio notIn ${ids.toString()}`)
        }
        if (filterIdGrupoArticuloMaestro.trim()){
            filter.push(`GrupoArticulos.IdGrupoArticuloMaestro eq ${filterIdGrupoArticuloMaestro.trim()}`)            
        }
        
        const negocios = await listarNegociosArticulo({
            page: pageInit + 1,
            limit,
            filters: filter.join(' and ')
        }, token, tokenCompany)
        setNegocios(negocios)
    }, [filterIdGrupoArticuloMaestro,filterNegocioPorNombre, negociosAsignados, pageNegocios, rowsPerPageNegocios, token, tokenCompany])

    const load = React.useCallback(async () => {
        await loadArticulos()
        const grupos = await listarGruposArticulo(token, tokenCompany)
        const medidas = await listarParametros(process.env.REACT_APP_ID_GRUPO_PARAMETRO_UNIDAD_MEDIDA, token, tokenCompany);
        await loadNegocios()
        setGrupos(grupos)
        setMedidas(medidas)
    }, [loadArticulos, loadNegocios, token, tokenCompany])

    const handleChangePage = async (event, newPage) => {
        await loadArticulos(newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        await loadArticulos(0, event.target.value)
    };

    const handleChangePageArticulosSap = async (event, newPage) => {
        await loadArticulosSap(newPage)
        setPageArticulosSap(newPage);
    };

    const handleChangeRowsPerPageArticulosSap = async (event) => {
        setRowsPerPageArticulosSap(parseInt(event.target.value, 10));
        setPageArticulosSap(0);
        await loadArticulosSap(0, event.target.value)
    };

    const handleChangePageNegocios = async (event, newPage) => {
        await loadNegocios(newPage)
        setPageNegocios(newPage);
    };

    const handleChangeRowsPerPageNegocios = async (event) => {
        setRowsPerPageNegocios(parseInt(event.target.value, 10));
        setPageNegocios(0);
        await loadNegocios(0, event.target.value)
    };

    const handleChangePageNegociosAsignados = async (event, newPage) => {
        setPageNegociosAsignados(newPage);
    };

    const handleChangeRowsPerPageNegociosAsignados = async (event) => {
        setRowsPerPageNegociosAsignados(parseInt(event.target.value, 10));
        setPageNegociosAsignados(0);
    };
    /*
    const handleEliminarArticulo = async (id) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('¿Está seguro de eliminar?')) {
            const response = await eliminarArticulo(id)
            if (response.success) {
                await loadArticulos()
                setOpenModalRegistrar(false)
            }
            alert(response.message)
        }
    }
    */

    const handleImportData = async (e) => {
        setUploading(true)
        const file = validarFile(e)

        if (!file.status) {
            setUploading(false)
            //setAlert2(file)
            //setOpenAlert(true)
            return
        }

        const response = await importarArticulos(file.data, token, tokenCompany)
        setUploading(false)
        setPage(0);
        await loadArticulos(0)
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
    };

    const handleGuardar = async () => {
        setOpenDialog(false)
        console.log(formData)
        let response = null

        switch (action) {
            case 'DELETE':
                response = await eliminarArticulo(idsArticulos, token, tokenCompany)
            break
            case 'UPDATE':
                response = await actualizarArticulo(formData, token, tokenCompany)
            break
            default:
                response = await crearArticulos(formData, token, tokenCompany)
            break
        }

        if (response.success) {
            await loadArticulos()
            setOpenModalRegistrar(false)
        }

        setAlert(response)
        setOpenAlert(true)
    }

    const searchArticuloSap = async (articulo) => {
        const art = { ...articulo }
        if (art.codigo !== '') {
            const response = await buscarArticuloSap({codigo: art.codigo}, token, tokenCompany)
            if (response.success) {
                art.name = response.data.ItemName
                setArticulo(art)
            } else {
                setAlert(response)
                setOpenAlert(true)
            }
        } else {
            await loadArticulosSap()
            setOpenModalArticulosSap(true)
        }
    }

    const handleDownloadFichaTecnica = async () => {
        const blob = await descargarFichaTecnica(articulo.id, token, tokenCompany)
        console.log(blob)
        saveFileAs(blob, `Ficha Técnica - ${articulo.name}`)
    }

    React.useEffect(() => {
        load()
        loadNegocios()
    }, [negociosAsignados, load, loadNegocios])

    return <Container fixed>
        <Grid container>
            <Grid item xs={6} sm={8}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Lista de Artículos
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
                        onClick={() => { handleOpenModalRegistrar() }}
                >Nuevo</Button>
            </Grid>
        </Grid>
        <br/>
        <Grid item xs={12} sm={12}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={3} sm={3}>
                    <TextField type={"text"}
                               value={filtroPorCodigo}
                               size={"small"}
                               onChange={(event) => {
                                   setFiltroPorCodigo(event.target.value)
                               }}
                               fullWidth
                               placeholder="Código"/>
                </Grid>
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
                        onChange={(event) => {
                            setFiltroPorGrupo(event.target.value)
                        }}
                    >
                        <MenuItem value=" ">-- Seleccione Grupo --</MenuItem>
                        {grupos.map((grupo, index) => (
                            <MenuItem key={index} value={grupo.id}>{grupo.nombre}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <IconButton size={"small"}
                                onClick={ async () => {
                                    await loadArticulos(0, rowsPerPage)
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
                            <TableCell align="center">Código</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Cod. Bar.</TableCell>
                            <TableCell align="center">Uni. Medida</TableCell>
                            <TableCell align="center">Procedencia</TableCell>
                            <TableCell align="center">Grupo</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center" sx={{ width: 100 }}>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {articulos.rows.map((articulo, index) => (
                            <TableRow key={index} sx={{
                                'td > p': {p: 0, m: 0},
                                'td, th': {px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"},
                                'td': {bgcolor: "grey.200"},
                                'th': {bgcolor: "primary.200"}
                            }}>
                                <TableCell width={15} component="th"></TableCell>
                                <TableCell align="center"><p>{articulo.codigo}</p></TableCell>
                                <TableCell align="left"><p>{articulo.name}</p></TableCell>
                                <TableCell align="center"><p>{articulo.code_bar}</p></TableCell>
                                <TableCell align="left"><p>{articulo.unidad_medida_nombre}</p></TableCell>
                                <TableCell align="left"><p>{articulo.procedencia}</p></TableCell>
                                <TableCell align="right"><p>{articulo.grupo}</p></TableCell>
                                <TableCell align="center"><p>{articulo.Activo}</p></TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color="primary"
                                        onClick={() => {
                                            setOpenModalRegistrar(true)
                                            setArticulo(articulo)
                                            setNegociosAsignados(articulo.ArticuloNegocios)
                                            setFilterIdGrupoArticuloMaestro(articulo.id_grupo)
                                        }}
                                    >
                                        <Edit></Edit>
                                    </IconButton>
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color={articulo.Activo === 'Activo' ? "error" : "success"}
                                        onClick={() => {
                                            setIdArticulo(articulo.ItemCode)
                                            const newArray = []
                                            articulo?.ArticuloNegocios?.forEach(res => {
                                                newArray.push( res.idArticulo)            
                                            })
                                            setIdsArticulos(newArray)
                                            setTextConfirm(`¿Está seguro de ${articulo.Activo === 'Activo' ? 'eliminar' : 'activar'} el artículo?`)
                                            setAction('DELETE')
                                            setOpenDialog(true)
                                        }}
                                    >
                                        {articulo.Activo === 'Activo' ? <DeleteIcon/> : <IconCheckbox/>}

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
                count={articulos.count}
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
            styleBody={{
                maxHeight: '95%',
                overflowY: 'auto',
                width: '90%'
            }}
        >
            <Typography id="modal-find-worker" variant="h3" component="h2">
                Registro de articulo
            </Typography>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={3} sm={3}>
                    <Grid item xs={12} sm={12}>
                        <Card elevation={2}>
                            <CardMedia component='img'
                                       height='200'
                                       image={photo}
                                       alt='photo'/>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{mt: 1}}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<Image />}
                            sx={{ marginRight: "1rem" }}
                            fullWidth
                        >
                            Imagen
                            <input
                                type="file"
                                name="foto"
                                hidden
                                onChange={(event) => {
                                    const foto = event.target.files[0]
                                    if (foto) {
                                        setPhoto(URL.createObjectURL(event.target.files[0]))
                                        formData.append('photo', foto)
                                    }
                                }}
                            />
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{mt: 1}}>
                        {!articulo.file ? <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadFileIcon />}
                            sx={{ marginRight: "1rem" }}
                            fullWidth
                        >
                            Ficha Técnica
                            <input
                                type="file"
                                name="ficha_tecnica"
                                hidden
                                onChange={(event) => {
                                    const file = event.target.files[0]
                                    if (file) {
                                        formData.append('file', file)
                                    }
                                }}
                            />
                        </Button> :
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<Download />}
                                sx={{ marginRight: "1rem" }}
                                fullWidth
                                onClick={handleDownloadFichaTecnica}
                            >
                                Descargar Ficha Técnica
                            </Button>}
                    </Grid>
                </Grid>
                <Grid item xs={9} sm={9}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={6} sm={6}>
                            <p>Procedencia</p>
                            <Select
                                value={articulo.procedencia}
                                size={"small"}
                                fullWidth
                                onChange={(event) => {
                                    setArticulo({...articulo, procedencia: event.target.value})
                                }}
                            >
                                <MenuItem value=" ">-- Seleccione --</MenuItem>
                                <MenuItem value={'TRACKING'}>TRACKING</MenuItem>
                                <MenuItem value={'SAP'}>SAP</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <p>Codigo</p>
                            <ButtonGroup aria-label="outlined primary button group" fullWidth>
                                <TextField
                                    disabled={!!articulo.name}
                                    value={articulo.codigo}
                                    fullWidth
                                    size={"small"}
                                    sx={{ width: "100%" }}
                                    onKeyPress={async (e) => {
                                        if (e.key === 'Enter' && articulo.procedencia === 'SAP') {
                                            await searchArticuloSap(articulo)
                                        }
                                    }}
                                    onChange={(event) => {
                                        setArticulo({...articulo, codigo: event.target.value})
                                    }}/>
                                {articulo.procedencia !== 'SAP' ? '' :
                                    <IconButton size={"small"}
                                                onClick={() => searchArticuloSap(articulo)}>
                                        <IconSearch/>
                                    </IconButton>
                                }
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={12}>
                            <p>Nombre</p>
                            <TextField
                                value={articulo.name}
                                fullWidth
                                size={"small"}
                                sx={{ width: "100%" }}
                                onChange={(event) => {
                                    setArticulo({...articulo, name: event.target.value})
                                }}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={4} sm={4}>
                            <p>Cod. Barras</p>
                            <TextField
                                value={articulo.code_bar}
                                fullWidth
                                size={"small"}
                                sx={{ width: "100%" }}
                                onChange={(event) => {
                                    setArticulo({...articulo, code_bar: event.target.value})
                                }}/>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <p>Uni Medida</p>
                            <Select
                                value={articulo.unidad_medida}
                                size={"small"}
                                fullWidth
                                onChange={(event) => {
                                    setArticulo({...articulo, unidad_medida: event.target.value})
                                }}
                            >
                                <MenuItem value=" ">-- Seleccione --</MenuItem>
                                {medidas.map((medida, index) => (
                                    <MenuItem key={index} value={medida.id}>{medida.nombre}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <p>Grupo</p>
                            <Select
                                value={articulo.id_grupo}
                                size={"small"}
                                fullWidth
                                onChange={(event) => {
                                    setArticulo({...articulo, id_grupo: event.target.value})
                                    setFilterIdGrupoArticuloMaestro(event.target.value)
                                }}
                            >
                                <MenuItem value=" ">-- Seleccione --</MenuItem>
                                {grupos.map((grupo, index) => (
                                    <MenuItem key={index} value={grupo.id}>{grupo.nombre}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{mb: 4, mt: 2}}></Divider>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={5} sm={5}>
                    <TableContainer component={Paper} style={{borderRadius: "0px"}}>
                        <p>Lista de Negocios por asignar</p>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell sx={{ width: 5 }}/>
                                    <TableCell align="left">
                                        <TextField type={"text"}
                                                   fullWidth
                                                   size={"small"}
                                                   onChange={(event) => {
                                                       setFilterNegocioPorNombre(event.target.value)
                                                   }}
                                                   onKeyPress={async (e) => {
                                                       if (e.key === 'Enter') {
                                                           await loadNegocios(0)
                                                       }
                                                   }}></TextField>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { (articulo.name ? negocios.rows.filter(negocio => !negociosAsignados.find(item => item.nombre === negocio.nombre)) : negocios.rows).map((negocio, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center" padding="checkbox">
                                            <Checkbox
                                                checked={!!negocio.checked}
                                                color="primary"
                                                onChange={(event) => {
                                                    const negocio = {...negocios.rows[index], checked: !negocios.rows[index].checked}
                                                    const newNegocios = [...negocios.rows]
                                                    newNegocios.splice(index, 1, negocio)
                                                    setNegocios({
                                                        count: negocios.count,
                                                        rows: newNegocios
                                                    })
                                                }}
                                                inputProps={{
                                                    'aria-labelledby': `enhanced-table-checkbox-${index}`,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{negocio.nombre} ({negocio.dim_3}|{negocio.dim_4}|{negocio.dim_5})</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10]}
                        component="div"
                        count={negocios.count}
                        rowsPerPage={rowsPerPageNegocios}
                        page={pageNegocios}
                        onPageChange={handleChangePageNegocios}
                        onRowsPerPageChange={handleChangeRowsPerPageNegocios}
                    />
                </Grid>
                <Grid container xs={2} sm={2} sx={{p: 1}} direction={"column"} justifyContent={"center"} alignItems={"center"}>
                    <Button
                        endIcon={<KeyboardArrowRight />}
                        sx={{ mb: 1 }}
                        size={"small"}
                        color={"primary"}
                        fullWidth
                        onClick={() => {
                            const seleccionados = negocios.rows.filter(negocio => negocio.checked)
                            /*
                            setNegocios({
                                count: negocios.count - seleccionados.length,
                                rows: negocios.rows.filter(negocio => !negocio.checked)
                            })
                            */


                            const newAsignados = seleccionados.map(negocio => {
                                negocio.checked = false
                                return negocio
                            }).concat(negociosAsignados)
                            console.log('NEW NEGOCIOS ASIGNADOS', newAsignados)
                            setNegociosAsignados(newAsignados)
                            console.log('NEGOCIOS ASIGNADOS', negociosAsignados)
                            // loadNegocios()
                        }}
                    >Asignar</Button>
                    <Button
                        startIcon={<KeyboardArrowLeft />}
                        size={"small"}
                        color={"error"}
                        fullWidth
                        onClick={async () => {
                            // const seleccionados = negociosAsignados.filter(negocio => negocio.checked)
                            setNegociosAsignados(negociosAsignados.filter(negocio => !negocio.checked))
                            await loadNegocios()
                            /*
                            setNegocios({
                                count: negocios.count + seleccionados.length,
                                rows: seleccionados.map(negocio => {
                                    negocio.checked = false
                                    return negocio
                                }).concat(negocios.rows)
                            })
                            */
                        }}
                    >Desasignar</Button>
                </Grid>
                <Grid item xs={5} sm={5}>
                    <TableContainer component={Paper} style={{borderRadius: "0px"}}>
                        <p>Lista de Negocios asignados</p>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell sx={{ width: 5 }}/>
                                    <TableCell align="left">
                                        <TextField type={"text"}
                                                fullWidth
                                                size={"small"}
                                                onKeyPress={async (e) => {
                                                    if (e.key === 'Enter') {
                                                        setTextSearch(e.target.value)
                                                    }
                                                }}></TextField>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {negociosAsignados.filter(negocio => {
                                    return negocio.nombre.toLowerCase().includes(textSearch.toLowerCase())
                                }).map((negocio, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center" padding="checkbox">
                                            <Checkbox
                                                checked={!!negocio.checked}
                                                color="primary"
                                                onChange={(event) => {
                                                    const negocio = {...negociosAsignados[index], checked: !negociosAsignados[index].checked}
                                                    const newNegocios = [...negociosAsignados]
                                                    newNegocios.splice(index, 1, negocio)
                                                    setNegociosAsignados(newNegocios)
                                                }}
                                                inputProps={{
                                                    'aria-labelledby': `enhanced-table-checkbox-${index}`,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{negocio.nombre} ({negocio.dim_3}|{negocio.dim_4}|{negocio.dim_5})</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10]}
                        component="div"
                        count={negociosAsignados.length}
                        rowsPerPage={rowsPerPageNegociosAsignados}
                        page={pageNegociosAsignados}
                        onPageChange={handleChangePageNegociosAsignados}
                        onRowsPerPageChange={handleChangeRowsPerPageNegociosAsignados}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}
                  sx={{mt: 1}}
                  direction={"row"}
                  justifyContent={"flex-end"}
                  alignItems={"flex-end"}>
                <Grid item xs={2} sm={2}>
                    <Button variant="contained"
                            disabled={!negociosAsignados.length}
                            fullWidth
                            size={"small"}
                            color={"primary"}
                            onClick={async () => {
                                Object.keys(articulo).forEach(key => {
                                    if (formData.has(key)) {
                                        formData.set(key, articulo[key])
                                    } else {
                                        formData.append(key, articulo[key])
                                    }
                                })
                                formData.delete('idNegocioInicial')
                                formData.delete('idArticuloInicial')
                                formData.delete('idGrupoArticuloInicial')
                                articulo?.ArticuloNegocios?.forEach(res => {
                                    formData.append('idNegocioInicial', res.id)
                                    formData.append('idArticuloInicial', res.idArticulo)
                                    formData.append('idGrupoArticuloInicial', res.idGrupoArticulo)

                                })
                                formData.delete('negocios')
                                formData.delete('GrupoArticulo')                                
                                negociosAsignados.forEach((negocio, key) => {
                                    formData.append('negocios', negocio.id)
                                    formData.append('GrupoArticulo', negocio.idGrupoArticulo)
                                })

                                setTextConfirm(articulo.ArticuloNegocios ? '¿Deseas actualizar el artículo?' : '¿Deseas registrar el artículo?')
                                setAction(articulo.ArticuloNegocios ? 'UPDATE' : 'SAVE')
                                setOpenDialog(true)
                            }}>
                        {
                            articulo.ArticuloNegocios ? 'Actualizar' : 'Registrar'
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
                <p>Datos correctos {erroresImportacionData.articulosSuccess}</p>
                <p>Datos con errores {erroresImportacionData.articulosErrors.length}</p>
                <br/>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                            <TableCell/>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Codigo</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">UnidadMedida</TableCell>
                            <TableCell align="center">Procedencia</TableCell>
                            <TableCell align="center">Grupo</TableCell>
                            <TableCell align="center">Negocio</TableCell>
                            <TableCell align="center">Observaciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {erroresImportacionData.articulosErrors.map((item, index) => (
                            <TableRow key={index} sx={{
                                'td > p': {p: 0, m: 0},
                                'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
                            }}>
                                <TableCell width={15} sx={{bgcolor: '#FF455C !important'}}></TableCell>
                                <TableCell align={"center"}>
                                    <p>{item.N}</p>
                                </TableCell>
                                <TableCell align={"center"}>
                                    <p>{item.Codigo}</p>
                                </TableCell>
                                <TableCell align={"center"}>
                                    <p>{item.ItemName}</p>
                                </TableCell>
                                <TableCell align={"left"}>
                                    <p>{item.UnidadMedida}</p>
                                </TableCell>
                                <TableCell align="left">
                                    <p>{item.Procedencia}</p>
                                </TableCell>
                                <TableCell align="left">
                                    <p>{item.Grupo}</p>
                                </TableCell>
                                <TableCell align="left">
                                    <p>{item.Negocio}</p>
                                </TableCell>
                                <TableCell align="left">
                                    <p>{item.errores.map((error, i) => (<label key={i} style={{display: "block"}}>- {error}</label>))}</p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </MainModal>

        <MainModal
            open={openModalArticulosSap}
            onClose={() => setOpenModalArticulosSap(false)}
            aria_labelledby="modal-find-worker"
            aria_describedby="modal-find-pick-worker"
        >
            <Typography id="modal-find-worker" variant="h3" component="h2">
                <p>Lista de Artículos</p>
            </Typography>
            <Grid item xs={12} sm={12} style={{marginBottom: "15px"}}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={5} sm={5}>
                        <TextField type={"text"}
                                   value={filtroPorItemCode}
                                   size={"small"}
                                   onChange={(event) => {
                                       setFiltroPorItemCode(event.target.value)
                                   }}
                                   fullWidth
                                   placeholder="Código"/>
                    </Grid>
                    <Grid item xs={5} sm={5}>
                        <TextField type={"text"}
                                   value={filtroPorItemName}
                                   size={"small"}
                                   fullWidth
                                   onChange={(event) => {
                                       setFiltroPorItemName(event.target.value)
                                   }}
                                   placeholder="Nombre"/>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <IconButton size={"small"}
                                    onClick={ async () => {
                                        await loadArticulosSap(0, rowsPerPageArticulosSap)
                                    }}>
                            <IconSearch/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TableContainer>
                    <Table size="small" aria-label="purchases">
                        <TableHead>
                            <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                <TableCell/>
                                <TableCell align="center">Codigo</TableCell>
                                <TableCell align="center">Nombre</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articulosSap.rows.map((item, index) => (
                                <TableRow key={index} sx={{
                                    cursor: "pointer",
                                    'td > p': {p: 0, m: 0},
                                    'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
                                }} onDoubleClick={() => handleSelectedArticle(item)}>
                                    <TableCell width={15} sx={{bgcolor: '#90caf9 !important'}}></TableCell>
                                    <TableCell align={"center"}>
                                        <p>{item.ItemCode}</p>
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        <p>{item.ItemName}</p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20]}
                    component="div"
                    count={articulosSap.count}
                    rowsPerPage={rowsPerPageArticulosSap}
                    page={pageArticulosSap}
                    onPageChange={handleChangePageArticulosSap}
                    onRowsPerPageChange={handleChangeRowsPerPageArticulosSap}
                />
            </Box>
        </MainModal>

        <input
            accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
            type="file"
            onChange={handleImportData}
            hidden
            ref={inputFile}
        />
        <a ref={downloadFile} href="./bucket/ARTICULOS_CARGA_INICIAL.xlsx" target={"_blank"} download hidden/>

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

export default ArticulosPage
