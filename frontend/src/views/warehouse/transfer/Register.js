import * as React from "react";

import { useTheme } from "@mui/material/styles";
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
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";

import MainModal from "../../../ui-component/modals/MainModal";

import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";

import { gridSpacing } from "../../../store/constant";

import SearchIcon from "@mui/icons-material/Search";

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import DeleteIcon from "@mui/icons-material/Delete";

import { GridActionsCellItem } from "@mui/x-data-grid";

import DataGridApp from "../../../ui-component/grid/DataGridApp.js";

import { v4 as uuidv4 } from "uuid";

import DialogMain from "../../../ui-component/alerts/DialogMain.js";
import AlertApp from "../../../ui-component/alerts/AlertApp.js";

import PickWarehouse from "../../shared/warehouse/PickWarehouse.js";

import PickArticle from "../../shared/article/PickArticle.js";

import PickSerie from "../../shared/serie/PickSerie.js";

import { modeContext } from "../../../context/modeContext";

import { useNavigate } from "react-router-dom";

///iniciar variable del app
const baseURL = process.env.PUBLIC_URL;

const WarehouseTransferRegister = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const { token, tokenCompany } = React.useContext(modeContext);
  const navigate = useNavigate();

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

  const [tipoWarehouse, setTipoWarehouse] = React.useState({
    url: "",
    tipo: "",
    param: {},
  });

  const [openFind, setOpenFind] = React.useState(false);
  const handleOpenFind = () => {
    setOpenFind(true);
  };
  const handleCloseFind = () => setOpenFind(false);

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
    });
    setContable(article.TieneSerie !== 1);
    setCantidad(1);
    setSerie({
      IdControlSerie: null,
      SerialNumber: "",
    });
  };

  const [listDetail, setListDetail] = React.useState([]);

  const handleAddDetail = () => {
    let unidad = 1;
    let msg = [];

    let cantidad_int = parseInt(cantidad);
    if (cantidad_int <= 0) {
      msg.push("La cantidad no puede ser igual o menor a cero");
    }

    if (cantidad_int > article.Stock) {
      msg.push("La cantidad no puede ser mayor al stock");
    }

    if (article.IdArticulo === null) {
      msg.push("Debe de seleccionar un artículo");
    } else {
      if (article.TieneSerie === 1) {
        if (serie.IdControlSerie === null) {
          msg.push("Debe de seleccionar una serie");
        }
      } else {
        unidad = cantidad_int;
      }
    }

    if (warehouse.IdAlmacen === null) {
      msg.push("Debe de seleccionar el almacen origen");
    }

    if (warehouseTo.IdAlmacen === null) {
      msg.push("Debe de seleccionar el almacen destino");
    }

    let cuentaSelected = cuentaOptions.find((f) => f.IdNegocio === cuenta);

    if (msg.length === 0) {
      const find_elment = listDetail.find(
        (f) =>
          f.IdAlmacenOrigen === warehouse.IdAlmacen &&
          f.IdAlmacenDestino === warehouseTo.IdAlmacen &&
          f.IdNegocio === cuentaSelected.IdNegocio &&
          f.IdArticulo === article.IdArticulo
      );

      if (find_elment) {
        if (find_elment.SerialNumber === "N/A") {
          msg.push("Ya existe el articulo agregado en el detalle");
        }
      }
    }

    if (msg.length === 0) {
      let newDetail = {
        id: uuidv4(),
        ItemName: article.ItemName,
        ItemCode: article.ItemCode,
        SerialNumber: serie.SerialNumber === "" ? "N/A" : serie.SerialNumber,
        Negocio: cuentaSelected.Nombre,
        AlmacenOrigen: warehouse.Nombre,
        AlmacenDestino: warehouseTo.Nombre,
        IdAlmacen: article.IdAlmacen,
        IdArticulo: article.IdArticulo,
        IdNegocio: cuentaSelected.IdNegocio,
        IdControlSerie: serie.IdControlSerie,
        IdAlmacenOrigen: warehouse.IdAlmacen,
        IdAlmacenDestino: warehouseTo.IdAlmacen,
        Cantidad: unidad,
        Grupo: article.Grupo,
        U_BPP_TIPUNMED: article.U_BPP_TIPUNMED,
        Codebars: article.Codebars,
        TipoStock: article.TipoStock,
      };
      console.log(newDetail);
      setListDetail((list) => [...list, newDetail]);
      ClearDetail();
    } else {
      setOpenAlert(true);
      setStateMessage({
        message: msg.join(", "),
        severity: "warning",
      });
    }
  };

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
    });
    setSerie({
      IdControlSerie: null,
      SerialNumber: "",
    });
  };

  const [loading, setLoading] = React.useState(false);

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleSave = () => {
    setOpenDialog(false);
    fetch(process.env.REACT_APP_API + "business/api/translado_almacen/ins", {
      method: "POST",
      body: JSON.stringify({
        warehouse: warehouse,
        warehouseTo: warehouseTo,
        detalle: listDetail,
      }),
      headers: {
        "Content-Type": "application/json",
        token: token,
        empresa: tokenCompany,
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache",
      },
    })
      .catch((error) => console.error("Error:", error))
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "Ok") {
          setOpenAlert(true);
          setStateMessage({
            message: "Se insertó la solicitud correctamente",
            severity: "info",
          });
          setTimeout(() => {
            navigate(`${baseURL}/warehouse/transfer/home`);
          }, 2000);
        } else {
          setOpenAlert(true);
          setStateMessage({
            message: response.message,
            severity: "error",
          });
          setLoading(false);
        }
      });
  };

  const handleOpenDialog = () => {
    setLoading(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setLoading(false);
    setOpenDialog(false);
  };

  const deleteDetail = React.useCallback(
    (id) => () => {
      setTimeout(() => {
        setListDetail((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    []
  );

  const columnsDetail = React.useMemo(
    () => [
      {
        field: "ItemName",
        headerName: "Producto",
        width: 350,
        headerAlign: "center",
      },
      {
        field: "ItemCode",
        headerName: "Cod. Producto",
        width: 150,
        headerAlign: "center",
      },
      {
        field: "SerialNumber",
        headerName: "Serie",
        width: 150,
        headerAlign: "center",
      },
      {
        field: "Negocio",
        headerName: "Cuenta",
        width: 150,
        headerAlign: "center",
      },
      {
        field: "Cantidad",
        headerName: "Cantidad",
        type: "number",
        width: 90,
        headerAlign: "center",
      },
      {
        field: "AlmacenOrigen",
        headerName: "Alm. origen",
        width: 150,
        headerAlign: "center",
      },
      {
        field: "AlmacenDestino",
        headerName: "Alm. dest.",
        width: 150,
        headerAlign: "center",
      },
      { field: "id", hide: true },
      { field: "IdAlmacen", hide: true },
      { field: "IdArticulo", hide: true },
      { field: "IdNegocio", hide: true },
      { field: "IdControlSerie", hide: true },
      { field: "IdAlmacenOrigen", hide: true },
      { field: "IdAlmacenDestino", hide: true },
      { field: "Grupo", hide: true },
      { field: "U_BPP_TIPUNMED", hide: true },
      { field: "Codebars", hide: true },
      { field: "TipoStock", hide: true },
      {
        field: "actions",
        type: "actions",
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
    [deleteDetail]
  );

  const [openAlert, setOpenAlert] = React.useState(false);
  const [stateMessage, setStateMessage] = React.useState({
    message: "",
    severity: "info",
  });
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const handleBack = () => {
    navigate(`${baseURL}/warehouse/transfer/home`);
  };

  const handleEditCantidad = (params) => {
    const id = params.id;
    const key = params.field;
    const value = params.value;
    const number = parseInt(value);

    const back = () => {
      setListDetail((previews) => {
        return previews.map((element) => element);
      });
    };

    const row = listDetail.find((f) => f.id === id);

    if (row) {
      let msg = [];
      if (msg.length > 0) {
        setStateMessage({
          message: msg[0],
          severity: "error",
        });
        setOpenAlert(true);
        back();
      } else {
        setListDetail((previews) => {
          let preview = previews.find((f) => f.id === id);
          if (preview) {
            preview[key] = number;
          }
          return previews;
        });
      }
    }
  };

  const [cuenta, setCuenta] = React.useState("-");

  const handleChangeCuenta = (event) => {
    let selectValue = event.target.value;
    setCuenta(selectValue);
  };

  const [cuentaOptions, setCuentaOptions] = React.useState([]);

  React.useEffect(() => {
    if(warehouse.IdAlmacen !== null) {
    const dataSend = {
      IdAlmacen: warehouse.IdAlmacen
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

  }, [token, tokenCompany, warehouse]);

  const [contable, setContable] = React.useState(true);

  const [cantidad, setCantidad] = React.useState(1);
  const handleChangeCantidad = (event) => {
    setCantidad(parseInt(event.target.value));
  };

  const [serie, setSerie] = React.useState({
    IdControlSerie: null,
    SerialNumber: "",
  });

  const [openSerie, setOpenSerie] = React.useState(false);

  const handleOpenSerie = (action) => {
    setOpenSerie(action);
  };

  const handleSelectedSerie = (pick_serie) => {
    setSerie({
      IdControlSerie: pick_serie.id,
      SerialNumber: pick_serie.SerialNumber,
    });
  };

  const [openCarga, setOpenCarga] = React.useState(false);

  const handleCloseCarga = () => setOpenCarga(false);

  const handleFileUpload = (e) => {
    if (!e.target.files) {
      return;
    }
    setUploading(true);
    const file = e.target.files[0];

    if (file.size > 15194304) {
      setUploading(false);
      setStateMessage({
        message: "se excedió el límite",
        severity: "info",
      });
      setOpenAlert(true);
      return;
    }

    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setUploading(false);
      setStateMessage({
        message: "debe de seleccionar un archivo XLSX",
        severity: "info",
      });
      setOpenAlert(true);
      return;
    }

    let data = new FormData();
    data.append("attached", file);

    fetch(
      process.env.REACT_APP_API +
        "business/api/translado_almacen/loadFromFile",
      {
        method: "POST",
        body: data,
        headers: {
          token: token,
          empresa: tokenCompany,
          cache: "no-cache",
          pragma: "no-cache",
          "cache-control": "no-cache",
        },
      }
    )
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        e.target.value = "";
        setUploading(false);
        setListCarga(response);
        console.log(response)
      });
  };

  const [uploading, setUploading] = React.useState(false);

 

  const columnsCarga = [
    {
      field: "AlmacenOrigen",
      headerName: "Almacen origen",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "AlmacenDestino",
      headerName: "Almacen destino",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "Negocio",
      headerName: "Negocio",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "ItemCode",
      headerName: "ItemCode",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "Cantidad",
      headerName: "Cantidad",
      type: "number",
      width: 90,
      headerAlign: "center",
    },
    {
      field: "__status",
      headerName: "Estado",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "__message",
      headerName: "Mensaje",
      width: 250,
      headerAlign: "center",
    },
    { field: "id", hide: true },
    { field: "CodArticulo", hide: true },
    { field: "IdUsuario", hide: true },
    { field: "IdArticulo", hide: true },
    { field: "Articulo", hide: true },
    { field: "DNI", hide: true },
    { field: "IdArticuloNegocio", hide: true },
    { field: "Almacen", hide: true },
    { field: "IdUsuarioNegocio", hide: true },
    { field: "CCosto", hide: true },
    { field: "CodigoCCosto", hide: true },
    { field: "Nombre", hide: true },
    { field: "U_BPP_TIPUNMED", hide: true },
    { field: "U_Devolucion", hide: true },
    { field: "U_Evaluacion", hide: true },
    { field: "Grupo", hide: true },
    { field: "IdStock", hide: true },
  ];

  const [listCarga, setListCarga] = React.useState([]);

  const handleProcesar = () => {
    handleCloseCarga();
    console.log(listCarga);
    const listProceso = listCarga.filter((f) => f.__status === "Ok");
    setListDetail(listProceso);
  };

  const handleDatos = () => {
    fetch(
      `${process.env.REACT_APP_API}business/api/solicitud_articulo/DataUpload`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          empresa: tokenCompany,
          cache: "no-cache",
          pragma: "no-cache",
          "cache-control": "no-cache",
        },
      }
    )
      .catch((error) => console.error("Error:", error))
      .then((response) => response.blob())
      .then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "datos.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={8} sm={10}>
        <Typography variant="h3" sx={{ color: theme.palette.primary.main }}>
          Nueva Transferencia
        </Typography>
      </Grid>
      <Grid item xs={4} sm={2}>
        <Grid
          container
          spacing={matchDownSM ? 0 : 2}
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => {
                 setListCarga([])
                 setOpenCarga(true)
              }}
            >
              Cargar Excel
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Container fixed>
        <Grid item xs={12} sm={12}>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                borderBottom: 1,
                borderBottomColor: theme.palette.primary.main,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: theme.palette.primary.main }}
              >
                <WarehouseOutlinedIcon
                  style={{ marginBottom: -5, marginRight: 5 }}
                />
                Almacen de Origen
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={matchDownSM ? 0 : 2}>
                <Grid item xs={4} sm={3}>
                  <FormControl variant="outlined" margin="normal" fullWidth>
                    <InputLabel htmlFor="txtAlmacenOrigen" size="small">
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
                <Grid item xs={4} sm={3}>
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
                <Grid item xs={4} sm={3}>
                  <TextField
                    fullWidth
                    label="DNI:"
                    margin="normal"
                    name="almacen_destino_responsable_dni"
                    type="text"
                    size="small"
                    value={warehouse.DNI}
                  />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <TextField
                    fullWidth
                    label="Dirección:"
                    margin="normal"
                    name="almacen_destino_direccion"
                    type="text"
                    size="small"
                    value={warehouse.Direccion}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel2a-header"
              sx={{
                borderBottom: 1,
                borderBottomColor: theme.palette.primary.main,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: theme.palette.primary.main }}
              >
                <WarehouseOutlinedIcon
                  style={{ marginBottom: -5, marginRight: 5 }}
                />
                Almacen de Destino
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
                <Grid item xs={4} sm={3}>
                  <TextField
                    fullWidth
                    label="DNI:"
                    margin="normal"
                    name="almacen_destino_responsable_dni_to"
                    type="text"
                    size="small"
                    value={warehouseTo.DNI}
                  />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <TextField
                    fullWidth
                    label="Dirección:"
                    margin="normal"
                    name="almacen_destino_direccion_to"
                    type="text"
                    size="small"
                    value={warehouseTo.Direccion}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                borderBottom: 1,
                borderBottomColor: theme.palette.primary.main,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: theme.palette.primary.main }}
              >
                <AddBoxOutlinedIcon
                  style={{ marginBottom: -5, marginRight: 5 }}
                />
                Nuevo Producto
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={matchDownSM ? 0 : 2}>
                <Grid item xs={4} sm={3}>
                  <FormControl fullWidth size="small" margin="normal">
                    <InputLabel id="lblCuenta">Cuenta/Área</InputLabel>
                    <Select
                      labelId="lblCuenta"
                      label="Cuenta/Área"
                      size="small"
                      onChange={handleChangeCuenta}
                      value={cuenta}
                    >
                      <MenuItem value="-">--Seleccionar--</MenuItem>
                      {cuentaOptions.map((option) => (
                        <MenuItem
                          key={option.IdNegocio}
                          value={option.IdNegocio}
                        >
                          {option.Nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} sm={3}>
                  <FormControl variant="outlined" margin="normal" fullWidth>
                    <InputLabel htmlFor="txtCodProducto" size="small">
                      Cod. de producto:
                    </InputLabel>
                    <OutlinedInput
                      id="txtCodProducto"
                      type="text"
                      size="small"
                      value={article.itemCode}
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
                      label="Cod. de producto:"
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
                {contable ? (
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      label="Cantidad"
                      margin="normal"
                      name="registro_Cantidad"
                      type="number"
                      value={cantidad}
                      size="small"
                      color="primary"
                      onChange={handleChangeCantidad}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={4} sm={4}>
                    <FormControl variant="outlined" margin="normal" fullWidth>
                      <InputLabel htmlFor="txtSerie">Serie</InputLabel>
                      <OutlinedInput
                        id="txtSerie"
                        type="text"
                        size="small"
                        value={serie.SerialNumber}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                handleOpenSerie(true);
                              }}
                              edge="end"
                            >
                              <SearchIcon></SearchIcon>
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Cod. de producto:"
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              <Grid
                container
                spacing={matchDownSM ? 0 : 2}
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Grid item xs={10} sm={10}>
                  <Typography
                    variant="h4"
                    sx={{ color: theme.palette.primary.main }}
                  >
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
                    Añadir
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                borderBottom: 1,
                borderBottomColor: theme.palette.primary.main,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: theme.palette.primary.main }}
              >
                <PlaylistAddCheckOutlinedIcon
                  style={{ marginBottom: -5, marginRight: 5 }}
                />
                Resumen de Productos
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
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Grid>
           <MainModal
            open={openCarga}
            onClose={handleCloseCarga}
            aria_labelledby="modal-find-article"
            aria_describedby="modal-find-pick-article"
          >
            <Typography id="modal-find-article" variant="h3" component="h2">
              Carga de detalle
            </Typography>
            <DataGridApp
              rows={listCarga}
              columns={columnsCarga}
              height={420}
            ></DataGridApp>
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginRight: "1rem" }}
              href="../../bucket/PLANTILLA_TRANSFERENCIA.xlsx"
              target="_blank"
            >
              Plantilla
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginRight: "1rem" }}
              onClick={handleDatos}
            >
              Datos
            </Button>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{ marginRight: "1rem" }}
              disabled={uploading}
            >
              {uploading ? "Cargando" : "Cargar"}
              <input type="file" onChange={handleFileUpload} hidden />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProcesar}
              disabled={uploading}
            >
              Procesar
            </Button>
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
            IdAlmacen: warehouse.IdAlmacen,
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
        <PickSerie
          open={openSerie}
          handleClose={() => {
            handleOpenSerie(false);
          }}
          handleSelectedArticle={handleSelectedSerie}
          url={
            process.env.REACT_APP_API +
            "business/api/control_series/ListByArticle"
          }
          param={{
            IdNegocio: cuenta,
            IdAlmacen: article.IdAlmacen,
            IdArticulo: article.IdArticulo,
          }}
        ></PickSerie>
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
          body="¿Desea registrar la solicitud de transferencia en el sistema?"
          buttons={[
            {
              text: "Cancelar",
              onClick: handleCloseDialog,
              color: "secondary",
              variant: "outlined",
            },
            {
              text: "Registrar",
              onClick: handleSave,
              color: "primary",
              variant: "contained",
            },
          ]}
        ></DialogMain>
        <AlertApp
          open={openAlert}
          title="Registro de solicitudes"
          body={stateMessage.message}
          handleClose={handleCloseAlert}
          severity={stateMessage.severity}
        ></AlertApp>
      </Container>
    </Grid>
  );
};

export default WarehouseTransferRegister;
