import * as React from 'react'

import { useTheme } from '@mui/material/styles'
import {
    Grid,
    TextField,
    useMediaQuery,
    Container,
    Button,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItem,
    ListItemText,
    OutlinedInput,
    InputAdornment,
} from '@mui/material'

import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined'

import { gridSpacing } from '../../store/constant'

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Stack from '@mui/material/Stack'
import esLocale from 'date-fns/locale/es'

import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'

import MainModal from '../../ui-component/modals/MainModal.js'

import { GridActionsCellItem } from '@mui/x-data-grid'

import DataGridApp from '../../ui-component/grid/DataGridApp.js'

import PickWarehouse from "../shared/warehouse/PickWarehouse.js";

import PickArticle from "../shared/article/PickArticle.js";



import { v4 as uuidv4 } from 'uuid'

import DialogMain from '../../ui-component/alerts/DialogMain.js'
import AlertApp from '../../ui-component/alerts/AlertApp.js'

import { modeContext } from '../../context/modeContext'

import {
    useNavigate
} from "react-router-dom"

import UploadFileIcon from "@mui/icons-material/UploadFile"

const localeMap = {
    es: esLocale
}

const columns = [
    { field: 'Articulo', headerName: 'Articulo', width: 400, headerAlign: 'center', },
    {
        field: 'Stock',
        headerName: 'Stock',
        type: 'number',
        width: 90,
        headerAlign: 'center',
    },
    { field: 'CodArticulo', headerName: 'Cod. Articulo', width: 200, headerAlign: 'center', },
    { field: 'Almacen', headerName: 'Almacen', width: 300, headerAlign: 'center', },
    { field: 'Categoria', headerName: 'Categoria', width: 300, headerAlign: 'center', },
    { field: 'id', hide: true },
    { field: 'CodAlmacen', hide: true },
    { field: 'IdArticulo', hide: true },
    { field: 'U_BPP_TIPUNMED', hide: true },
    { field: 'U_Devolucion', hide: true },
    { field: 'U_Evaluacion', hide: true },
]


///iniciar variable del app
const baseURL = process.env.PUBLIC_URL

const RequestRegisterAlmacen = () => {
    const [value, setValue] = React.useState(new Date())
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    const { token, tokenCompany } = React.useContext(modeContext)

    const navigate = useNavigate()

    const [employee, setEmployee] = React.useState({
        id: null,
        nombre: "",
        descripcion: "",
        NroDocumento: "",
        ApellidoPaterno: "",
        ApellidoMaterno: "",
        Nombres: ""        
    })

    const [warehouse, setWarehouse] = React.useState({
        IdAlmacen: null,
        Nombre: "",
        Descripcion: "",
        Direccion: "",
        Reponsable: "",
        DNI: "",
      });

    const [warehouseTo, setWarehouseTo] = React.useState({
        IdAlmacen: null,
        Nombre: "",
        Descripcion: "",
        Direccion: "",
        Reponsable: "",
        DNI: "",
    });

    const [openWarehouse, setOpenWarehouse] = React.useState(false);
    const handleOpenFindWarehouse = (action, tipo) => {
        setOpenWarehouse(action);
        switch (tipo) {
          case "From":
            setTipoWarehouse({
              url: process.env.REACT_APP_API + "business/api/almacen/OwnAlmacen",
              tipo: "From",
              param: {},
            });
            break;
          case "To":
            setTipoWarehouse({
              url: process.env.REACT_APP_API + "business/api/almacen/NotOwnAlmacen",
              tipo: "To",
              param: {
                id_almacen: warehouse.IdAlmacen,
              },
            });
            break;
          default:
            setTipoWarehouse({
              url: process.env.REACT_APP_API + "business/api/almacen/OwnAlmacen",
              tipo: "From",
              param: {},
            });
            break;
        }
      };

      const [tipoWarehouse, setTipoWarehouse] = React.useState({
        url: "",
        tipo: "",
        param: {},
      });

      const handleSelectedWarehouse = (warehouse, tipo) => {
        switch (tipo) {
          case "From":
            setWarehouse({
              IdAlmacen: warehouse.id,
              Nombre: warehouse.Nombre,
              Descripcion: warehouse.Descripcion,
              Direccion: warehouse.Direccion,
              Reponsable: `${warehouse.ApellidoPaterno} ${warehouse.ApellidoMaterno} ${warehouse.Nombres}`,
              DNI: warehouse.NroDocumento,
            });
            break;
          case "To":
            setWarehouseTo({
              IdAlmacen: warehouse.id,
              Nombre: warehouse.Nombre,
              Descripcion: warehouse.Descripcion,tipoWarehouse,
              Direccion: warehouse.Direccion,
              Reponsable: `${warehouse.ApellidoPaterno} ${warehouse.ApellidoMaterno} ${warehouse.Nombres}`,
              DNI: warehouse.NroDocumento,
            });
            break;
          default:
            setWarehouse({
              IdAlmacen: warehouse.id,
              Nombre: warehouse.Nombre,
              Descripcion: warehouse.Descripcion,
              Direccion: warehouse.Direccion,
              Reponsable: `${warehouse.ApellidoPaterno} ${warehouse.ApellidoMaterno} ${warehouse.Nombres}`,
              DNI: warehouse.NroDocumento,
            });
            break;
        }
      };

    
    const [article, setArticle] = React.useState({
        Almacen: "",
        IdAlmacen: null,
        IdArticulo: null,
        IdNegocio: null,
        ItemCode: "",
        ItemName: "",
        TieneSerie: 0,
        Grupo: "",
        U_BPP_TIPUNMED: "",
        Codebars: "",
        TipoStock: "",
        Stock: 0,
        IdArticuloNegocio: ""
    })
    const [stock, setStock] = React.useState({
        codigo: '',
        cantidad: 0
    })

    const [listArticle, setListArticle] = React.useState([])
    const [openFind, setOpenFind] = React.useState(false)
    const handleOpenFind = () => {
        setOpenFind(true);
    }
    const handleCloseFind = () => setOpenFind(false)

    const [cuentaOptions, setCuentaOptions] = React.useState([])



    React.useEffect(() => {
        if(warehouseTo.IdAlmacen !== null) {
        const dataSend = {
          IdAlmacen: warehouseTo.IdAlmacen
        }
        
        fetch(process.env.REACT_APP_API + "business/api/tipo_negocio/getTipoNegocioStocks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            empresa: tokenCompany,
            cache: "no-cache",
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
          body: JSON.stringify(dataSend)
        })
          .then((res) => res.json())
          .catch((error) => console.error("Error:", error))
          .then((response) => {
            setCuentaOptions(response);
          });
        }
    
      }, [token, tokenCompany, warehouseTo]);


    const [cuenta, setCuenta] = React.useState('-')
    const [usuarioNegocio, setUsuarioNegocio] = React.useState('')

    const handleChangeCuenta = (event) => {
        let selectValue = event.target.value
        setCuenta(selectValue)
        const selectedRowCuenta = cuentaOptions.find((row) =>
            row.IdNegocio === selectValue
        )
        let selectUsuarioNegocio = ''
        if (selectedRowCuenta) {
            if (selectedRowCuenta.UsuarioNegocios) {
                if (selectedRowCuenta.UsuarioNegocios.length > 0) {
                    selectUsuarioNegocio = selectedRowCuenta.UsuarioNegocios[0].IdUsuarioNegocio
                }
            }
        }
        setUsuarioNegocio(selectUsuarioNegocio)
    }

    const [cantidad, setCantidad] = React.useState(1)
    const handleChangeCantidad = (event) => {
        setCantidad(parseInt(event.target.value))
    }

    const [motivo, setMotivo] = React.useState('')
    const handleChangeMotivo = (event) => {
        setMotivo(event.target.value)
    }

    const handleSelectedArticle = (article) => {
        setArticle({
          Almacen: article.Almacen,
          IdAlmacen: article.CodAlmacen,
          IdArticulo: article.IdArticulo,
          IdNegocio: article.IdNegocio,
          ItemCode: article.CodArticulo,
          ItemName: article.Articulo,
          TieneSerie: article.TieneSerie,
          Grupo: article.Grupo,
          U_BPP_TIPUNMED: article.U_BPP_TIPUNMED,
          Codebars: article.Codebars,
          TipoStock: article.TipoStock,
          Stock: article.Stock,
          IdArticuloNegocio: article.IdArticuloNegocio
        });
        // setContable(article.TieneSerie !== 1);
        setStock({
                cantidad: article.Stock,
                codigo: article.id
        })
        setCantidad(1);
      };



    const [listDetail, setListDetail] = React.useState([])

    const [listStock, setListStock] = React.useState([])

    const handleAddDetail = () => {
        let msg = []

        if (cantidad > stock.cantidad) {
            msg.push('La cantidad ingresada supera al stock disponible')
        }

        if (article.CodArticle === '') {
            msg.push('Debe de seleccionar un artÃ­culo')
        }

        if (cuenta === '-') {
            msg.push('Debe de seleccionar una cuenta')
        }

        const find_replay = listDetail.find(f =>
            f.IdArticulo === article.IdArticle &&
            f.IdArticuloNegocio === article.IdArticuloNegocio &&
            f.CodAlmacen === article.CodAlmacen &&
            f.IdUsuario === employee.IdUsuario
        )
        
        if (find_replay) {
            msg.push('El articulo seleccionado ya se encuentra en el listado')
        }

        if (msg.length === 0) {
            let newDetail = {
                id: uuidv4(),
                CodArticulo: article.ItemCode,
                Articulo: article.ItemName,
                DNI_Destino: warehouseTo.DNI,
                Cantidad: cantidad,
                IdUsuario: warehouse.Reponsable,
                IdNegocio: article.IdNegocio,
                CodAlmacen: article.IdAlmacen,
                Almacen: article.Almacen,
                IdNegocio: cuenta,
                IdArticulo: article.IdArticulo,
                Nombre: `${warehouse.Reponsable}`,
                U_BPP_TIPUNMED: article.U_BPP_TIPUNMED,
                U_Devolucion: article.U_Devolucion,
                U_Evaluacion: article.U_Evaluacion,
                Grupo: article.Grupo,
                IdStock: stock.codigo,
                Mensaje: "jasdjajdasjd",
                AlmacenOrigen: warehouseTo.IdAlmacen,
                AlmacenDestino: warehouse.IdAlmacen,
                IdArticuloNegocio: article.IdArticuloNegocio
            }
            setListStock(list => {
                let pre = [...list]
                let find = pre.find(f => f.codigo === stock.codigo)
                if (!find) {
                    pre.push({
                        codigo: stock.codigo,
                        cantidad: stock.cantidad,
                    })
                }
                return pre
            })
           
            setListDetail(list => [...list, newDetail])
            ClearDetail()
        } else {
            setOpenAlert(true)
            setStateMessage(
                {
                    message: msg.join(', '),
                    severity: 'warning'
                }
            )
        }
    }

    const ClearDetail = () => {
        setArticle({
            Almacen: "",
            IdAlmacen: null,
            IdArticulo: null,
            IdNegocio: null,
            ItemCode: "",
            ItemName: "",
            TieneSerie: 0,
            Grupo: "",
            U_BPP_TIPUNMED: "",
            Codebars: "",
            TipoStock: "",
            Stock: 0,
        })
        setCantidad(1)
    }

    const [loading, setLoading] = React.useState(false)

    const [openDialog, setOpenDialog] = React.useState(false)

    const handleSave = () => {
        setOpenDialog(false)
        console.log('BODY: ', {
            tipo: 'PEDIDO',
            fecha_propuesta: value,
            detalle: listDetail,
            motivo: motivo,
            usuario: warehouseTo.Reponsable,
            DniSolicitante: warehouse.DNI
        })
      
        fetch(process.env.REACT_APP_API + 'business/api/solicitud_articulo/createSolicitudTransferencia', {
            method: 'POST',
            body: JSON.stringify({
                tipo: 'PEDIDO',
                fecha_propuesta: value,
                detalle: listDetail,
                motivo: motivo,
                usuario: warehouseTo.Reponsable,
                DniSolicitante: warehouse.DNI
            }),
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'empresa': tokenCompany,
                cache: 'no-cache',
                pragma: 'no-cache',
                'cache-control': 'no-cache'
            }
        })
            .catch(error => console.error('Error:', error))
            .then(res => res.json())
            .then(response => {
                if (response.status === 'Ok') {
                    setOpenAlert(true)
                    setStateMessage({
                        message: 'Se insertÃ³ la solicitud correctamente',
                        severity: 'info'
                    })
                    setTimeout(() => {
                        // navigate(`${baseURL}/request/info`)
                    }, 2000)
                } else {
                    setOpenAlert(true)
                    setStateMessage({
                        message: response.message,
                        severity: 'error'
                    })
                    setLoading(false)
                }
            })
    }

    const [listAlmacen, setListAlmacen] = React.useState([])

    const handleOpenDialog = () => {
        const msg = []
        if (employee.IdUsuario === null) {
            msg.push('Debe de seleccionar un usuario')
        }

        if (motivo === '') {
            msg.push('Debe de ingresar un motivo')
        }

        if (value === null) {
            msg.push('Debe de seleccionar una fecha de recojo')
        }

        if (listDetail.length < 1) {
            msg.push('Debe de seleccionar un articulo con asignaciÃ³n para procesar')
        }

        if (msg.length === 0) {
            const almacenes = []

            listDetail.forEach(m => {
                const find_almacen = almacenes.find(f => f === m.Almacen)
                if (!find_almacen) {
                    almacenes.push(m.Almacen)
                }
            })

            setListAlmacen(almacenes)
            console.log('DIALOGO: ', listDetail);
            setLoading(true)
            setOpenDialog(true)
        } else {
            setOpenAlert(true)
            setStateMessage({
                message: msg.join(', '),
                severity: 'error'
            })
        }
    }

    const handleCloseDialog = () => {
        setLoading(false)
        setOpenDialog(false)
    }

    const deleteDetail = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                setListDetail((prevRows) => prevRows.filter((row) => row.id !== id))
            });
        },
        [],
    )

    const columnsDetail = React.useMemo(
        () => [
            { field: 'Articulo', headerName: 'Articulo', width: 350, headerAlign: 'center', },
            { field: 'CodArticulo', headerName: 'Cod. Articulo', width: 150, headerAlign: 'center', },
            { field: 'Almacen', headerName: 'Almacen', width: 150, headerAlign: 'center', },
            
            // { field: 'Nombre', headerName: 'Responsable de Almacen', width: 250, headerAlign: 'center', },
            {
                field: 'Cantidad',
                headerName: 'Cantidad',
                type: 'number',
                width: 90,
                editable: true,
                headerAlign: 'center',
            },
            { field: 'id', hide: true },
            { field: 'IdUsuario', hide: true },
            { field: 'IdArticuloNegocio', hide: true },
            { field: 'CodAlmacen', hide: true },
            { field: 'IdNegocio', hide: true },
            { field: 'IdUsuarioNegocio', hide: true },
            { field: 'CCosto', hide: true },
            { field: 'CodigoCCosto', hide: true },
            { field: 'IdArticulo', hide: true },
            { field: 'IdStock', hide: true },
            { field: 'Mensaje', headerName: 'Mensaje', width: 250, headerAlign: 'center', },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={deleteDetail(params.id)}
                    />,
                ],
            },
            
        ],
        [deleteDetail],
    )

    const [openAlert, setOpenAlert] = React.useState(false)
    const [stateMessage, setStateMessage] = React.useState({
        message: '',
        severity: 'info'
    })
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    const handleBack = () => {
        navigate(`${baseURL}/request/info`)
    }




    const handleEditCantidad = (
        params,
    ) => {
        const id = params.id
        const key = params.field
        const value = params.value
        const number = parseInt(value)

        const back = () => {
            setListDetail(previews => {
                return previews.map(element => element)
            })
        }

        const row = listDetail.find(f => f.id === id)

        if (row) {
            let msg = []
            const find_stock = listStock.find(f => f.codigo === row.IdStock)
            if (find_stock) {
                if (number > find_stock.cantidad) {
                    msg.push('La cantidad ingresada supera al stock disponible')
                }
            }

            if (msg.length > 0) {
                setStateMessage({
                    message: msg[0],
                    severity: 'error'
                })
                setOpenAlert(true)
                back()
            } else {
                setListDetail(previews => {
                    let preview = previews.find(f => f.id === id)
                    if (preview) {
                        preview[key] = number
                    }
                    return previews
                })
            }
        }
    }



    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={8} sm={10}
            >
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }} style={{marginLeft:'100px'}}>Solicitud de Transferencia de Almacen</Typography>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Grid
                    container
                    spacing={matchDownSM ? 0 : 2}
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                >
                </Grid>
            </Grid>
            <Container fixed>
                <Grid item xs={12} sm={12}>
                    <Accordion
                        defaultExpanded={true}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                borderBottom: 1,
                                borderBottomColor: theme.palette.primary.main
                            }}
                        >
                            <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                                <WarehouseOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                AlmacÃ©n que Solicita (MIS ALMACENES)
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                <AccordionDetails>
                                <Grid container spacing={matchDownSM ? 0 : 2}>
                                    <Grid item xs={4} sm={6}>
                                    <FormControl variant="outlined" margin="normal" fullWidth>
                                        <InputLabel htmlFor="txtAlmacenDestino" size="small">
                                        Almacen:
                                        </InputLabel>
                                        <OutlinedInput
                                        id="txtAlmacenOrigen"
                                        type="text"
                                        size="small"
                                        value={warehouse.Nombre}
                                        endAdornment={
                                            <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                aria-label="toggle password visibility"
                                                onClick={() => {
                                                handleOpenFindWarehouse(true, "From");
                                                }}
                                                edge="end"
                                            >
                                                <SearchIcon></SearchIcon>
                                            </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Almacen:"
                                        />
                                    </FormControl>
                                    </Grid>
                                    <Grid item xs={4} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Responsable:"
                                        margin="normal"
                                        name="almacen_destino_responsable"
                                        type="text"
                                        size="small"
                                        value={warehouse.Reponsable}
                                    />
                                    </Grid>
                                </Grid>
                                </AccordionDetails>
                                </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Accordion
                        defaultExpanded={true}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                borderBottom: 1,
                                borderBottomColor: theme.palette.primary.main
                            }}
                        >
                            <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                                <AccountCircleOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                AlmacÃ©n a Solicitar (TODOS LOS ALMACENES MENOS LOS MIOS) 
                   
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={matchDownSM ? 0 : 2}>
								<Grid item xs={4} sm={3}>
								  <FormControl variant="outlined" margin="normal" fullWidth>
									<InputLabel htmlFor="txtAlmacenDestino" size="small">
									  Almacen:
									</InputLabel>
									<OutlinedInput
									  id="txtAlmacenDestino"
									  type="text"
									  size="small"
									  value={warehouseTo.Nombre}
									  endAdornment={
										<InputAdornment position="end">
										  <IconButton
											size="small"
											aria-label="toggle password visibility"
											onClick={() => {
											  handleOpenFindWarehouse(true, "To");
											}}
											edge="end"
										  >
											<SearchIcon></SearchIcon>
										  </IconButton>
										</InputAdornment>
									  }
									  label="Almacen:"
									/>
								  </FormControl>
								</Grid>								
								<Grid item xs={4} sm={3}>
								  <TextField
									fullWidth
									label="Responsable:"
									margin="normal"
									name="almacen_destino_responsable_to"
									type="text"
									size="small"
									value={warehouseTo.Reponsable}
								  />
								</Grid>
								

                                <Grid item xs={4} sm={3}
                                style={{marginLeft: '88px'}}
                                >
                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                        adapterLocale={localeMap["es"]}
                                    >
                                        <Stack spacing={0}
                                        >
                                            <DesktopDatePicker
                                                size='small'
                                                
                                                label="Fecha de recojo"
                                                value={value}
                                                minDate={new Date()}
                                                onChange={(newValue) => {
                                                    setValue(newValue)
                                                }}
                                                renderInput={
                                                    (params) => {
                                                        params.fullWidth = true
                                                        params.margin = "normal"
                                                        params.size = 'small'
                                                        return (
                                                            <TextField {...params} />
                                                        )
                                                    }
                                                }
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        label="Motivo:"
                                        margin="normal"
                                        name="registro_Motivo"
                                        type="text"
                                        size='small'

                                        value={motivo}
                                        onChange={handleChangeMotivo}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid container spacing={2}>
    <Grid item xs={12} sm={12}>
        <Accordion defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                    borderBottom: 1,
                    borderBottomColor: theme.palette.primary.main
                }}
            >
                <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                    <AddBoxOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                    Nuevo Articulo
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size='small' margin='normal'>
                            <InputLabel id="lblCuenta">Cuenta/Ãrea</InputLabel>
                            <Select
                                labelId="lblCuenta"
                                label="Cuenta/Ãrea"
                                size='small'
                                onChange={handleChangeCuenta}
                                value={cuenta}
                            >
                                <MenuItem value='-'>--Seleccionar--</MenuItem>
                                {cuentaOptions.map((option) =>
                                    <MenuItem key={option.IdNegocio} value={option.IdNegocio}>{option.Nombre}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" margin="normal" fullWidth>
                    <InputLabel htmlFor="txtCodProducto" size="small">
                      Cod. de producto:
                    </InputLabel>
                    <OutlinedInput
                      id="txtCodProducto"
                      type="text"
                      size="small"
                      value={article.ItemCode}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            aria-label="toggle password visibility"
                            onClick={handleOpenFind}
                            edge="end"
                          >
                            <SearchIcon></SearchIcon>
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Cod. de Articulo:"
                    />
                  </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={6}>
                    <TextField
                        fullWidth
                        label="Producto:"
                        margin="normal"
                        name="registro_prod"
                        type="text"
                        size="small"
                        value={article.ItemName}
                    />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label="Cantidad"
                            margin="normal"
                            name="registro_Cantidad"
                            type="number"
                            value={cantidad}
                            size='small'
                            color="primary"
                            onChange={handleChangeCantidad}
                            // style={{ marginLeft: '180px' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant='h5' sx={{ color: theme.palette.secondary.main }}>
                            Stock disponible: {stock.cantidad}
                        </Typography>
                    </Grid>
                    <Grid item xs={10} sm={10}>
                        <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                            {article.Article}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleAddDetail}
                        >
                            AÃ±adir
                        </Button>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    </Grid>
</Grid>

                <Grid item xs={12} sm={12}>
                    <Accordion
                        defaultExpanded={true}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                borderBottom: 1,
                                borderBottomColor: theme.palette.primary.main
                            }}
                        >
                            <Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
                                <PlaylistAddCheckOutlinedIcon style={{ marginBottom: -5, marginRight: 5 }} />
                                Resumen de Articulos
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <DataGridApp
                                rows={listDetail}
                                columns={columnsDetail}
                                onCellEditCommit={handleEditCantidad}
                            ></DataGridApp>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Grid
                        container
                        spacing={matchDownSM ? 0 : 2}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        sx={{
                            marginTop: 1
                        }}
                    >
                        <Grid item xs={2} sm={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={handleBack}
                                disabled={loading}
                            >
                                Regresar
                            </Button>
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleOpenDialog}
                                disabled={loading}
                            >
                                Solicitar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <MainModal
                    open={openFind}
                    onClose={handleCloseFind}
                    aria_labelledby="modal-find-article"
                    aria_describedby="modal-find-pick-article"
                >
                    <Typography id="modal-find-article" variant="h3" component="h2">
                        SKU Inventarios
                    </Typography>
                    <DataGridApp
                        rows={listArticle}
                        columns={columns}
                        onSelectionModelChange={handleSelectedArticle}
                        height={420}
                    ></DataGridApp>
                </MainModal>
                <PickWarehouse
                open={openWarehouse}
                handleClose={() => {
                    handleOpenFindWarehouse(false);
                }}
                handleSelectedWarehouse={handleSelectedWarehouse}
                url={tipoWarehouse.url}
                tipo={tipoWarehouse.tipo}
                param={tipoWarehouse.param}
                ></PickWarehouse>
                <PickArticle
                open={openFind}
                reload={true}
                handleClose={handleCloseFind}
                handleSelectedArticle={handleSelectedArticle}
                url={
                    process.env.REACT_APP_API +
                    "business/api/articulo/ArticulosUsuarioAll"
                }
                param={{
                    IdNegocio: cuenta,
                    IdAlmacen: warehouseTo.IdAlmacen, 
                    hideEmpty: true,
                }}
                columns={[
                    { field: "Articulo", headerName: "Producto", width: 400 },
                    { field: "CodArticulo", headerName: "Cod. Producto", width: 200 },
                    { field: "Almacen", headerName: "Almacen", width: 150 },
                    { field: "Categoria", headerName: "Categoria", width: 150 },
                    {
                    field: "Stock",
                    headerName: "Stock",
                    type: "number",
                    width: 90,
                    },
                    { field: "TipoStock", headerName: "Tipo", width: 150 },
                    { field: "id", hide: true },
                    { field: "CodAlmacen", hide: true },
                    { field: "IdArticulo", hide: true },
                    { field: "TieneSerie", hide: true },
                ]}
                ></PickArticle>
                <DialogMain
                    open={openDialog}
                    title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: '68px', marginBottom: '8px', color: '#FFB239' }} />
                    <Typography variant="h3" color='#000064'>ConfirmaciÃ³n</Typography>
                  </div>
                }
                    body={`Â¿Desea registrar la solicitud en el sistema?, los almacenes utilizados son los siguientes:`}
                    content={
                        listAlmacen.map(almacen =>
                            <ListItem>
                                <ListItemText
                                    primary={almacen}
                                />
                            </ListItem>
                        )
                    }
                    buttons={[
                        {
                            text: 'Cancelar',
                            onClick: handleCloseDialog,
                            color: 'secondary',
                            variant: 'outlined'
                        },
                        {
                            text: 'Registrar',
                            onClick: handleSave,
                            color: 'primary',
                            variant: 'contained',
                        }
                    ]}
                >
                </DialogMain>
                <AlertApp
                    open={openAlert}
                    title="Registro de solicitudes"
                    body={stateMessage.message}
                    handleClose={handleCloseAlert}
                    severity={stateMessage.severity}
                >
                </AlertApp>
            </Container>
        </Grid >
    )
}

export default RequestRegisterAlmacen