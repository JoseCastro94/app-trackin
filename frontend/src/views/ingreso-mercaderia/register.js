import { useTheme } from "@mui/material/styles";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import Stack from '@mui/material/Stack'
// import esLocale from 'date-fns/locale/es'

import { gridSpacing } from "../../store/constant";
import * as React from "react";
import { listarParametros } from "../../services/Parametro";
import {
  obtenerAlmacenes,
  listarCorreos,
  listarUsuarios,
} from "../../services/Usuario";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  guardarMovimientoMercancia,
  subirArchivoIngresoMercaderia,
} from "../../services/MovimientoMercancia";
import {obtenerIdArticuloReal, listarNegociosPorArticuloNew} from "../../services/ArticuloNegocio";
import ModalSelectItem from "../shared/ModalSelectItem";
import { IconPencil } from "@tabler/icons";
import DialogMain from "../../ui-component/alerts/DialogMain";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { validarFile } from "../utilities/Util";
import { modeContext } from "../../context/modeContext";

// const localeMap = {
//     es: esLocale
// }

const iniAutocomplete = [{ id: 0, nombre: "-- Selecciones --" }];
const dataIni = {
  tipo: iniAutocomplete[0],
  documento: iniAutocomplete[0],
  num_doc: "",
  ruc: "",
  razonSocial: "",
  almacen: "",
  email: [],
  articulos: [],
  attach: null,
};
const dataInitProduct = {
  id: 0,
  codigo: "",
  descripcion: "",
  cuenta: iniAutocomplete[0],
  categoria: "",
  almacen: "",
  cantidad: 0,
  comentario: "",
  devolucion: "",
  codigo_barras: "",
  unidad_medida: "",
  has_serie: 0,
  id_grupo_articulo: 0,
  id_unidad_medida: "",
  serie: "",
};

const columnsModalSelectedItem = [
  { field: "codigo", headerName: "Codigo", width: 200 },
  { field: "nombre", headerName: "Producto", width: 400 },
  { field: "categoria", headerName: "Categoria", width: 300 },
  { field: "unidad_medida", headerName: "U. Medida", width: 100 },
  { field: "id_articulo", hide: true },
  { field: "devolucion", hide: true },
  { field: "codigo_barras", hide: true },
  { field: "id_unidad_medida", hide: true },
];

const RegisterIngresoMercaderiaPage = () => {
  const theme = useTheme();
  const [uploading, setUploading] = React.useState(false);
  const [tipoIngreso, setTipoIngreso] = React.useState(iniAutocomplete);
  const [tipoDocumento, setTipoDocumento] = React.useState(iniAutocomplete);
  const [almacenes, setAlmacenes] = React.useState([])
  const [ingreso, setIngreso] = React.useState(dataIni);
  const [producto, setProducto] = React.useState(dataInitProduct);
  const [cuentas, setCuentas] = React.useState(iniAutocomplete);
  const [usuarios, setUsuarios] = React.useState(iniAutocomplete);
  const [openFind, setOpenFind] = React.useState(false);
  const [editHeader, setEditHeader] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alert, setAlert] = React.useState({
    message: "",
    severity: "success",
  });

  const [value, setValue] = React.useState(new Date())

  const { token, tokenCompany } = React.useContext(modeContext);
  const handleOpenFind = (action) => {
    setOpenFind(action);
  };
  const [contador, setContador] = React.useState(1);



  const load = React.useCallback(async () => {
    const tipoIngreso = await listarParametros(
      process.env.REACT_APP_ID_GRUPO_PARAMETRO_TIPO_INGRESO_MERCADERIA,
      token,
      tokenCompany
    );
    const tipoDocumento = await listarParametros(
      process.env
        .REACT_APP_ID_GRUPO_PARAMETRO_TIPO_DOCUMENTO_INGRESO_MERCADERIA,
      token,
      tokenCompany
    );
    const almacenes = await obtenerAlmacenes({}, token, tokenCompany);
    const correos = await listarCorreos(token, tokenCompany);
    setUsuarios(correos);
    setAlmacenes(almacenes)
    setTipoIngreso(tipoIngreso);
    setTipoDocumento(tipoDocumento);
    dataIni.tipo = tipoIngreso[1];
    dataIni.documento = tipoDocumento[0];
    setIngreso(dataIni);
    setEditHeader(false);
  }, [token, tokenCompany]);

  const listarNegocios = async (id_producto) => {
    const cuentas = await listarNegociosPorArticuloNew(id_producto, token, tokenCompany)
    cuentas.unshift(iniAutocomplete[0])
    setCuentas(cuentas)
}

  const handleDateChange = (index, date) => {
    const updatedArticulos = [...ingreso.articulos];
    updatedArticulos[index].fecha_vencimiento = date;
    setIngreso({ ...ingreso, articulos: updatedArticulos });
  };

  const handleChangeTipoIngreso = (value) => {
    const data = { ...ingreso };
    data.tipo = value;
    switch (data.tipo.id) {
      case "2ffd2b48-470f-4330-aeb9-094c66b9c231": // COMPRA INTERNA
        data.documento = tipoDocumento[1];
        break;
      case "ff7535f6-3273-4ab8-9972-5a45109048db": // ENTREGA CONSIGNACION
        data.documento = tipoDocumento[0];
        break;
      default:
        data.documento = tipoDocumento[1];
        break;
    }
    setIngreso(data);
  };

  const handleChangeAlmacen = (value) => {
    const data = { ...ingreso };
    data.almacen = value;
    setIngreso(data);
  };

  const handleChangeNumeroDocumento = (value) => {
    const data = { ...ingreso };
    data.num_doc = value;
    setIngreso(data);
  };

  const handleChangeEmail = (value) => {
    console.log("handleChangeEmail", value);
    const data = { ...ingreso };
    data.email = value;
    setIngreso(data);
  };

  const handleChangeCuenta = async  (value) => {
    const data = { ...producto };
    const articu = await obtenerIdArticuloReal(producto.id,value.id, token, tokenCompany)
        articu.map(art => {
            if(art.ArticuloNegocios.length > 0){
                data.id = art.ArticuloNegocios[0].idarticulo
                data.id_grupo_articulo = art.ArticuloNegocios[0].idGrupoArticulo
            }
        })
    data.cuenta = value;
    setProducto(data);
  };

  const handleChangeCantidad = (value) => {
    const data = { ...producto };
    data.cantidad = value;
    setProducto(data);
  };

  const handleChangeComentario = (value) => {
    const data = { ...producto };
    data.comentario = value;
    setProducto(data);
  };

  const handleSelectedArticle = async (article) => {
    console.log("articulo seleccionado", article);
    producto.descripcion = article.nombre;
    producto.codigo = article.codigo;
    producto.id = article.id;
    producto.categoria = article.categoria;
    producto.almacen = ingreso.almacen;
    producto.devolucion = article.devolucion;
    producto.codigo_barras = article.codigo_barras;
    producto.unidad_medida = article.unidad_medida;
    producto.id_grupo_articulo = article.id_grupo_articulo;
    producto.id_unidad_medida = article.id_unidad_medida;
    producto.has_serie = article.has_serie;
    await listarNegocios(producto.id);
    setProducto(producto);
  };

  const handleAgregarArticulos = () => {
    let msg = [];
    const ruc = parseInt(ingreso.ruc).toString();
    const objAlert = { message: null, severity: "info" };

    const find_replay = ingreso.articulos.find(
      (f) =>
        !f.has_serie &&
        f.codigo === producto.codigo &&
        f.cuenta.id === producto.cuenta.id
    );

    if (
      ingreso.documento.id === "c1370d68-0c41-41ec-8605-8831c79c49c7" &&
      ingreso.num_doc === ""
    ) {
      objAlert.message = "Campo #Documento es requerido.";
    } else if (ingreso.ruc === "") {
      objAlert.message = "Campo #Ruc es requerido.";
    } else if (ruc.length < 11) {
      objAlert.message = "Campo #Ruc debe ser válido.";
    } else if (ingreso.razonSocial === "") {
      objAlert.message = "Campo Razon Social es requerido.";
    } else if (producto.descripcion === "") {
      objAlert.message = "Campo Descripción es requerido.";
    } else if (producto.cuenta.id === 0) {
      objAlert.message = "Campo Negocio es requerido.";
    } else if (producto.cantidad === 0) {
      objAlert.message = "Campo Cantidad es requerido.";
    } else if (find_replay) {
      const rowIndex =
        contador +
        ingreso.articulos.findIndex(
          (f, index) =>
            !f.has_serie &&
            f.codigo === producto.codigo &&
            f.cuenta.id === producto.cuenta.id
        );
      objAlert.message = `No puede adicionar un registro repetido. Verificar Linea ${rowIndex} `;
    } else {
      const data = { ...ingreso };
      if (producto.has_serie) {
        const cantidad = Number(producto.cantidad);
        for (let i = 0; i < cantidad; i++) {
          producto.cantidad = 1;
          data.articulos.push({ ...producto });
        }
      } else {
        data.articulos.push(producto);
      }
      setEditHeader(true);
      dataInitProduct.codigo = "";
      dataInitProduct.descripcion = "";
      setProducto(dataInitProduct);
      setCuentas(iniAutocomplete);
      setIngreso(data);
    }

    if (objAlert.message) {
      setAlert(objAlert);
      setOpenAlert(true);
    }
  };

  const handleGuardar = async () => {
    setOpenDialog(false);
    const correos = ingreso.email.map((item) => item.Correo);
    const data = { ...ingreso };
    data.email = correos;
    const response = await guardarMovimientoMercancia(
      data,
      token,
      tokenCompany
    );
    if (response.success) {
      console.log("dataIni", dataIni);
      console.log("dataInitProduct", dataInitProduct);
      dataIni.articulos = [];
      setIngreso(dataIni);
      setProducto(dataInitProduct);
      setEditHeader(false);
    }
    setAlert(response);
    setOpenAlert(true);
  };

  const handleEditItem = async (articulo, index) => {
    handleDeleteItem(articulo, index);
    await listarNegocios(articulo.id);
    delete articulo.serie;
    setProducto(articulo);
  };

  const handleDeleteItem = (articulo, index) => {
    const data = { ...ingreso };
    data.articulos = data.articulos.filter((item, i) => i !== index);
    console.log(data.articulos);
    setIngreso(data);
  };

  const handleChangeSerie = (index, serie) => {
    const data = { ...ingreso };
    data.articulos[index].serie = serie;
    setIngreso(data);
  };

  const handleFileUpload = async (event) => {
    const file = validarFile(event);
    if (!file.status) {
      //alert(file.message)
      return false;
    }
    const uploadFile = await subirArchivoIngresoMercaderia(
      file.data,
      token,
      tokenCompany
    );
    const dataIngreso = { ...ingreso };
    dataIngreso.attach = uploadFile.key;
    setIngreso(dataIngreso);
  };

  React.useEffect(() => {
    load();
  }, [load, token, tokenCompany]);

  return (
    <Container fixed>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h3" sx={{ color: theme.palette.primary.main }}>
            Ingreso Mecadería
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={3} sm={3}>
          <p>Tipo Ingreso</p>
          <Autocomplete
            disabled={editHeader}
            options={tipoIngreso}
            getOptionLabel={(option) => option.nombre || ""}
            autoComplete
            disableClearable
            value={ingreso.tipo}
            openText=""
            size="small"
            isOptionEqualToValue={(option, value) =>
              option.nombre === value.nombre
            }
            onChange={(event, value) => handleChangeTipoIngreso(value)}
            renderInput={(params) => {
              return <TextField {...params} placeholder="Seleccione" />;
            }}
          />
        </Grid>
        <Grid item xs={3} sm={3}>
          <p>Documento</p>
          <Autocomplete
            disabled={true}
            options={tipoDocumento}
            getOptionLabel={(option) => option.nombre || ""}
            autoComplete
            disableClearable
            value={ingreso.documento}
            openText=""
            size="small"
            isOptionEqualToValue={(option, value) =>
              option.nombre === value.nombre
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Seleccione" />
            )}
          />
        </Grid>
        <Grid item xs={3} sm={3}>
          <p>#Documento</p>
          <TextField
            disabled={editHeader}
            type={"text"}
            size={"small"}
            fullWidth
            onChange={(event) => {
              return handleChangeNumeroDocumento(event.target.value);
            }}
            value={ingreso.num_doc}
          />
        </Grid>
        <Grid item xs={3} sm={3}>
          <p>Documento</p>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ marginRight: "1rem" }}
            fullWidth
            disabled={uploading || editHeader}
          >
            {uploading ? "Cargando..." : "Subir"}
            <input type="file" onChange={handleFileUpload} hidden />
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={3} sm={3}>
          <p>#Ruc</p>
          <TextField
            fullWidth
            inputProps={{
              maxLength: 11,
            }}
            disabled={editHeader}
            type={"text"}
            size={"small"}
            onChange={(event) => {
              setIngreso({ ...ingreso, ruc: event.target.value });
            }}
            value={ingreso.ruc}
          />
        </Grid>
        <Grid item xs={3} sm={3}>
          <p>Razon Social</p>
          <TextField
            inputProps={{
              maxLength: 200,
            }}
            disabled={editHeader}
            type={"text"}
            size={"small"}
            fullWidth
            onChange={(event) => {
              setIngreso({ ...ingreso, razonSocial: event.target.value });
            }}
            value={ingreso.razonSocial}
          />
        </Grid>
        <Grid item xs={3} sm={3}>
          <p>Almacén</p>
          <Autocomplete
            fullWidth
            disabled={editHeader}
            options={almacenes}
            getOptionLabel={(option) => option.nombre || ""}
            autoComplete
            disableClearable
            value={ingreso.almacen} 
            openText=""
            size="small"
            onChange={(event, value) => handleChangeAlmacen(value)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Seleccione" />
            )}
          />
        </Grid>
        <Grid item xs={3} sm={3}>
          <p>Correo</p>
          <Autocomplete
            fullWidth
            multiple={true}
            disabled={editHeader}
            options={usuarios}
            getOptionLabel={(option) => option.Correo || ""}
            value={ingreso.email}
            autoComplete
            disableClearable
            openText=""
            size="small"
            onChange={(event, value) => handleChangeEmail(value)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Seleccione" />
            )}
          />
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2 }}></Divider>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={3} sm={3}>
          <p>Cod. Producto</p>
          <ButtonGroup aria-label="outlined primary button group" fullWidth>
            <TextField
              type="text"
              size="small"
              value={producto.codigo}
              disabled={true}
            />
            <IconButton
              aria-label="find"
              size="small"
              color="primary"
              onClick={() => {
                handleOpenFind(true);
              }}
            >
              <SearchIcon></SearchIcon>
            </IconButton>
          </ButtonGroup>
        </Grid>
        <Grid item xs={5} sm={5}>
          <p>Descripción</p>
          <TextField
            type={"text"}
            size={"small"}
            sx={{ width: "100%" }}
            disabled={true}
            value={producto.descripcion}
          />
        </Grid>
        <Grid item xs={3} sm={3}>
          <p>Negocio</p>
          <Autocomplete
            options={cuentas}
            getOptionLabel={(option) => option.nombre}
            autoComplete
            disableClearable
            value={producto.cuenta}
            openText=""
            size="small"
            isOptionEqualToValue={(option, value) =>
              option.nombre === value.nombre
            }
            onChange={(event, value) => handleChangeCuenta(value)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Seleccione" />
            )}
          />
        </Grid>
        <Grid
          item
          xs={1}
          sm={1}
          sx={{
            input: { padding: "4px 8px", textAlign: "right" },
            textAlign: "center",
          }}
        >
          <p>Cantidad</p>
          <TextField
            type={"number"}
            size={"small"}
            onChange={(event) => {
              return handleChangeCantidad(event.target.value);
            }}
            value={producto.cantidad}
          />
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={11} sm={11}>
          <TextField
            type={"text"}
            placeholder={"Escribe aquí tus comentarios"}
            size={"small"}
            sx={{ width: "100%" }}
            onChange={(event) => {
              return handleChangeComentario(event.target.value);
            }}
            value={producto.comentario}
          />
        </Grid>
        <Grid item xs={1} sm={1}>
          <Button
            variant="contained"
            size={"small"}
            color={"secondary"}
            fullWidth={true}
            onClick={() => {
              handleAgregarArticulos();
            }}
          >
            Añadir
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2 }}></Divider>
      <Grid
        container
        spacing={gridSpacing}
        sx={{ marginTop: 2, minHeight: 100 }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow sx={{ "td, th": { py: 0.2, px: 0.2, border: 0 } }}>
                <TableCell />
                <TableCell align="center"> # </TableCell>
                <TableCell align="center"> Producto </TableCell>
                <TableCell align="center">Código Producto</TableCell>
                <TableCell align="center">Categoría</TableCell>
                <TableCell align="center">Negocio</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="center">Serie</TableCell>
                {/* <TableCell align="center">F. Vencimiento</TableCell> */}
                <TableCell align="center">Almacén</TableCell>
                <TableCell align="center">Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingreso.articulos.map((articulo, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "td > p": { p: 0, m: 0 },
                    "td, th": {
                      px: 1,
                      py: 0,
                      border: 2,
                      borderRadius: "10px",
                      borderColor: "white",
                    },
                    td: { bgcolor: "grey.200" },
                    th: { bgcolor: "primary.200" },
                  }}
                >
                  <TableCell width={15} component="th"></TableCell>
                  <TableCell width={35} align="center">
                    {contador + index}
                  </TableCell>
                  <TableCell align="left">
                    <p>{articulo.descripcion}</p>
                  </TableCell>
                  <TableCell align="center">
                    <p>{articulo.codigo}</p>
                  </TableCell>
                  <TableCell align="center">
                    <p>{articulo.categoria}</p>
                  </TableCell>
                  <TableCell align="center">
                    <p>{articulo.cuenta.nombre}</p>
                  </TableCell>
                  <TableCell align="center">
                    <p>{articulo.cantidad}</p>
                  </TableCell>
                  <TableCell align="center">
                    {articulo.has_serie ? (
                      <TextField
                        type={"text"}
                        size={"small"}
                        onChange={(event) => {
                          return handleChangeSerie(index, event.target.value);
                        }}
                        value={articulo.serie}
                      />
                    ) : (
                      <p>N/A</p>
                    )}
                  </TableCell>
                  {/* <TableCell>
                    { articulo.has_serie ? (<LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                        adapterLocale={localeMap["es"]}
                                    >
                                        <Stack spacing={0}>
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
                     ): (<p>N/A</p>
                      )
                    }
                  </TableCell> */}
                  <TableCell align="center">
                    <p>{articulo.almacen.nombre}</p>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="find"
                      size="small"
                      color="primary"
                      onClick={() => {
                        handleEditItem(articulo, index);
                      }}
                    >
                      <IconPencil></IconPencil>
                    </IconButton>
                    <IconButton
                      aria-label="find"
                      size="small"
                      color="error"
                      onClick={() => {
                        handleDeleteItem(articulo, index);
                      }}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Divider sx={{ mt: 2 }}></Divider>
      <Grid
        container
        spacing={gridSpacing}
        sx={{ textAlign: "right", marginTop: 1 }}
      >
        <Grid item xs={12} sm={12}>
          <Button
            variant="contained"
            disabled={!ingreso.articulos.length}
            size={"small"}
            color={"primary"}
            onClick={() => {
              const duplicados = ingreso.articulos
                .filter((item) => item.has_serie)
                .every((item, index, array) => {
                  return (
                    array.findIndex(
                      (el) => el.serie.trim() === item.serie.trim()
                    ) === index
                  );
                });

              const sinSerie = ingreso.articulos
                .filter((item) => item.has_serie)
                .some((articulo) => articulo.serie.trim() === "");

              if (!duplicados) {
                setAlert({
                  message: "Existen series duplicadas.",
                  severity: "info",
                });
                setOpenAlert(true);
              } else if (sinSerie) {
                setAlert({
                  message: "Existen artículos sin serie.",
                  severity: "info",
                });
                setOpenAlert(true);
              } else {
                console.log("DATA INGRESO MERCADERÍA", JSON.stringify(ingreso));
                setOpenDialog(true);
              }
            }}
          >
            Registrar
          </Button>
        </Grid>
      </Grid>
      <ModalSelectItem
        open={openFind}
        handleClose={() => {
          handleOpenFind(false);
        }}
        handleSelectedArticle={handleSelectedArticle}
        url={
          process.env.REACT_APP_API + "business/api/articulo_negocio/articulosnew"
        }
        columns={columnsModalSelectedItem}
        param={{}}
      />
      <DialogMain
        open={openDialog}
        title={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <WarningAmberOutlinedIcon
              style={{
                fontSize: "68px",
                marginBottom: "8px",
                color: "#FFB239",
              }}
            />
            <Typography variant="h3" color="#000064">
              Confirmación
            </Typography>
          </div>
        }
        body="¿Deseas registrar el ingreso de mercadería en el sistema?"
        actions={
          <div>
            <Button onClick={() => setOpenDialog(false)}>No</Button>
            <Button onClick={handleGuardar}>Si</Button>
          </div>
        }
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openAlert}
        key="top_left"
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setOpenAlert(false)}
          sx={{ width: "100%" }}
        >
          {alert.title ? <AlertTitle>{alert.title}</AlertTitle> : ""}
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterIngresoMercaderiaPage;
