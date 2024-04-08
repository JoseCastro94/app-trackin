import { useTheme } from "@mui/material/styles";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Container,
  Grid,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { gridSpacing } from "../../store/constant";
import MainModal from "../../ui-component/modals/MainModal";
import Select from "@mui/material/Select";
import DialogMain from "../../ui-component/alerts/DialogMain";
import {
  actualizarNegocio,
  crearNegocio,
  eliminarNegocio,
  importarNegocios,
  listarNegociosConEmpresa,
} from "../../services/TipoNegocio";

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { ArrowDropDown, Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconCheckbox, IconSearch } from "@tabler/icons";
import { useRef, useContext } from "react";
import { validarFile } from "../utilities/Util";
import { listarEmpresas } from "../../services/Empresa";
import { modeContext } from "../../context/modeContext";

const NegociosPage = () => {
  const { company } = useContext(modeContext);
  const theme = useTheme();
  const dataIni = {
    id: "",
    Nombre: "",
    Tipo: 1,
    SubTipo: 1,
    Dim1: "",
    Dim2: "",
    Dim3: "",
    Dim4: "",
    Dim5: "",
    IdEmpresa: " ",
  };
  const inputFile = useRef(null);
  const downloadFile = useRef(null);
  const anchorRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alert, setAlert] = React.useState({
    message: "",
    severity: "success",
  });
  const [textConfirm, setTextConfirm] = React.useState("");
  const [action, setAction] = React.useState("SAVE");
  const [openModalRegistrar, setOpenModalRegistrar] = React.useState(false);
  const [negocio, setNegocio] = React.useState(dataIni);
  const [negocios, setNegocios] = React.useState({ count: 0, rows: [] });
  const [empresas, setEmpresas] = React.useState([]);
  const [idNegocio, setIdNegocio] = React.useState(0);
  const [filtroPorNombre, setFiltroPorNombre] = React.useState("");
  const [openModalErroresImportacionData, setOpenModalErroresImportacionData] =
    React.useState(false);
  const { token, tokenCompany } = React.useContext(modeContext);
  const [erroresImportacionData, setErroresImportacionData] = React.useState({
    negociosSuccess: 0,
    negociosErrors: [],
  });

  const loadNegocios = React.useCallback(
    async (pageInit = page, limit = rowsPerPage) => {
      const filter = [];
      if (filtroPorNombre.trim())
        filter.push(`Nombre lk ${filtroPorNombre.trim().replace(" ", "_")}`);

      const response = await listarNegociosConEmpresa(
        {
          page: pageInit + 1,
          limit,
          filters: filter.join(" and "),
        },
        token,
        tokenCompany
      );

      if (!response.hasOwnProperty("success")) {
        setNegocios(response);
      } else {
        setAlert(response);
        setOpenAlert(true);
      }
    },
    [page, rowsPerPage, filtroPorNombre, token, tokenCompany]
  );

  const load = React.useCallback(async () => {
    await loadNegocios();
    const empresas = await listarEmpresas(
      {
        page: 0,
        limit: 1000,
      },
      token,
      tokenCompany
    );
    setEmpresas(empresas.rows);
  }, [loadNegocios, token, tokenCompany]);

  const handleCloseModalRegistrar = () => setOpenModalRegistrar(false);

  const handleChangePage = async (event, newPage) => {
    await loadNegocios(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    await loadNegocios(0, event.target.value);
  };

  const handleGuardar = async () => {
    setOpenDialog(false);
    let response = null;
    const objAlert = { message: null, severity: "info" };

    if (negocio.nombre === "" && action !== "DELETE") {
      objAlert.message = "Campo Nombre es requerido.";
    } else {
      switch (action) {
        case "DELETE":
          response = await eliminarNegocio(idNegocio, token, tokenCompany);
          break;
        case "UPDATE":
          response = await actualizarNegocio(negocio, token, tokenCompany);
          break;
        default:
          response = await crearNegocio(negocio, token, tokenCompany);
          break;
      }

      if (response.success) {
        await loadNegocios();
        setOpenModalRegistrar(false);
      }

      setAlert(response);
      setOpenAlert(true);
    }

    if (objAlert.message) {
      setAlert(objAlert);
      setOpenAlert(true);
    }
  };

  const handleImportData = async (e) => {
    setUploading(true);
    const file = validarFile(e);

    if (!file.status) {
      setUploading(false);
      //setAlert2(file)
      //setOpenAlert(true)
      return;
    }

    const response = await importarNegocios(file.data, token, tokenCompany);
    setUploading(false);
    setPage(0);
    await loadNegocios(0);
    if (response.severity !== "error" && !response.success) {
      setErroresImportacionData(response.data);
      setOpenModalErroresImportacionData(true);
    }
    setAlert(response);
    setOpenAlert(true);
    inputFile.current.value = "";
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  React.useEffect(() => {
    load();
  }, [load, token, tokenCompany]);

  return (
    <Container fixed>
      <Grid container>
        <Grid item xs={6} sm={8}>
          <Typography variant="h3" sx={{ color: theme.palette.primary.main }}>
            Lista de Negocios
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4} style={{ textAlign: "right" }}>
          <React.Fragment>
            <ButtonGroup
              variant="outlined"
              ref={anchorRef}
              sx={{ marginRight: "1rem" }}
              size={"small"}
              aria-label="split button"
            >
              <Button onClick={() => {}}>
                {uploading ? "Cargando..." : "Carga masiva"}
              </Button>
              <Button
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={() => {
                  setOpen((prevState) => !prevState);
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
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu" autoFocusItem>
                        <MenuItem
                          key={"123"}
                          onClick={() => inputFile.current.click()}
                        >
                          Importar Plantilla
                        </MenuItem>
                        <MenuItem
                          key={"213"}
                          onClick={() => downloadFile.current.click()}
                        >
                          Descargar Plantilla
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </React.Fragment>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setNegocio(dataIni);
              setOpenModalRegistrar(true);
            }}
          >
            Nuevo
          </Button>
        </Grid>
      </Grid>
      <br />
      <Grid item xs={12} sm={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={3} sm={3}>
            <TextField
              type={"text"}
              value={filtroPorNombre}
              size={"small"}
              fullWidth
              onChange={(event) => {
                setFiltroPorNombre(event.target.value);
              }}
              placeholder="Nombre"
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <IconButton
              size={"small"}
              onClick={async () => {
                await loadNegocios(0, rowsPerPage);
              }}
            >
              <IconSearch />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid item xs={12} sm={12}>
        <TableContainer component={Paper} style={{ borderRadius: "0px" }}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow sx={{ "td, th": { py: 0.2, px: 0.2, border: 0 } }}>
                <TableCell sx={{ width: 5 }} />
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Dim 1</TableCell>
                <TableCell align="center">Dim 2</TableCell>
                <TableCell align="center">Dim 3</TableCell>
                <TableCell align="center">Dim 4</TableCell>
                <TableCell align="center">Dim 5</TableCell>
                <TableCell align="center">Empresa</TableCell>
                <TableCell align="center">Unidad Negocio</TableCell>
                <TableCell align="center" sx={{ width: 100 }}>
                  Opciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {negocios.rows
                .filter((negocio) => negocio.empresa === company?.razon_social)
                .map((negocio, index) => (
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
                    <TableCell align="center">
                      <p>{negocio.Nombre}</p>
                    </TableCell>
                    <TableCell align="left">
                      <p>{negocio.Dim1}</p>
                    </TableCell>
                    <TableCell align="left">
                      <p>{negocio.Dim2}</p>
                    </TableCell>
                    <TableCell align="left">
                      <p>{negocio.Dim3}</p>
                    </TableCell>
                    <TableCell align="left">
                      <p>{negocio.Dim4}</p>
                    </TableCell>
                    <TableCell align="left">
                      <p>{negocio.Dim5}</p>
                    </TableCell>
                    <TableCell align="center">
                      <p>{negocio.empresa}</p>
                    </TableCell>
                    <TableCell align="center">
                      <p>{negocio.CodigoUnidad}</p>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="find"
                        size="small"
                        color="primary"
                        onClick={async () => {
                          setOpenModalRegistrar(true);
                          setNegocio(negocio);
                        }}
                      >
                        <Edit></Edit>
                      </IconButton>
                      <IconButton
                        aria-label="find"
                        size="small"
                        color={
                          negocio.Activo === "Activo" ? "error" : "success"
                        }
                        onClick={() => {
                          setIdNegocio(negocio.id);
                          setTextConfirm(
                            `¿Está seguro de ${
                              negocio.Activo === "Activo"
                                ? "eliminar"
                                : "activar"
                            } el negocio?`
                          );
                          setAction("DELETE");
                          setOpenDialog(true);
                        }}
                      >
                        {negocio.Activo === "Activo" ? (
                          <DeleteIcon />
                        ) : (
                          <IconCheckbox />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 30]}
          component="div"
          count={negocios.count}
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
          Registro de negocio
        </Typography>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6}>
            <p>Empresa</p>
            <Select
              value={negocio.IdEmpresa}
              size={"small"}
              fullWidth
              onChange={async (event) => {
                setNegocio({ ...negocio, IdEmpresa: event.target.value });
              }}
            >
              <MenuItem value=" ">-- Seleccione --</MenuItem>

              {empresas
                .filter((empresa) => empresa.Activo === "Activo")
                .map((empresa, index) => (
                  <MenuItem key={index} value={empresa.id}>
                    {empresa.razonSocial}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <p>Nombre</p>
            <TextField
              value={negocio.Nombre}
              fullWidth
              size={"small"}
              onChange={(event) => {
                setNegocio({ ...negocio, Nombre: event.target.value });
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={4} sm={2}>
            <p>Dim 1</p>
            <TextField
              value={negocio.Dim1}
              fullWidth
              size={"small"}
              onChange={(event) => {
                setNegocio({ ...negocio, Dim1: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <p>Dim 2</p>
            <TextField
              value={negocio.Dim2}
              fullWidth
              size={"small"}
              onChange={(event) => {
                setNegocio({ ...negocio, Dim2: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <p>Dim 3</p>
            <TextField
              value={negocio.Dim3}
              fullWidth
              size={"small"}
              onChange={(event) => {
                setNegocio({ ...negocio, Dim3: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <p>Dim 4</p>
            <TextField
              value={negocio.Dim4}
              fullWidth
              size={"small"}
              onChange={(event) => {
                setNegocio({ ...negocio, Dim4: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <p>Dim 5</p>
            <TextField
              value={negocio.Dim5}
              fullWidth
              size={"small"}
              onChange={(event) => {
                setNegocio({ ...negocio, Dim5: event.target.value });
              }}
            />
          </Grid>

          {/* HACER CAMBIOS ACA */}

          {
            <Grid item xs={4} sm={2}>
              <p>Unidad Negocio</p>
              <TextField
                value={negocio.CodigoUnidad}
                fullWidth
                size={"small"}
                onChange={(event) => {
                  setNegocio({ ...negocio, CodigoUnidad: event.target.value });
                }}
              />
            </Grid>
          }
        </Grid>
        <Grid
          container
          spacing={gridSpacing}
          sx={{ mt: 1 }}
          direction={"row"}
          justifyContent={"flex-end"}
          alignItems={"flex-end"}
        >
          <Grid item xs={2} sm={2}>
            <Button
              variant="contained"
              fullWidth
              size={"small"}
              color={"primary"}
              disabled={negocio.distrito === " " || !negocio.provincia === " "}
              onClick={async () => {
                setTextConfirm(
                  negocio.id
                    ? "¿Deseas actualizar el negocio?"
                    : "¿Deseas registrar el negocio?"
                );
                setAction(negocio.id ? "UPDATE" : "SAVE");
                setOpenDialog(true);
              }}
            >
              {negocio.id ? "Actualizar" : "Registrar"}
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
          maxHeight: "95%",
          overflowY: "auto",
          width: "90%",
        }}
      >
        <Typography id="modal-find-worker" variant="h3" component="h2">
          <p>Errores al importar datos</p>
        </Typography>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <p>Datos correctos {erroresImportacionData.negociosSuccess}</p>
          <p>
            Datos con errores {erroresImportacionData.negociosErrors.length}
          </p>
          <br />
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow sx={{ "td, th": { py: 0.2, px: 0.2, border: 0 } }}>
                <TableCell />
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Dim 1</TableCell>
                <TableCell align="center">Dim 2</TableCell>
                <TableCell align="center">Dim 3</TableCell>
                <TableCell align="center">Dim 4</TableCell>
                <TableCell align="center">Dim 5</TableCell>
                <TableCell align="center">Empresa</TableCell>
                <TableCell align="center">XD</TableCell>
                <TableCell align="center">Observaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {erroresImportacionData.negociosErrors.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "td > p": { p: 0, m: 0 },
                    "td, th": {
                      bgcolor: "grey.200",
                      px: 1,
                      py: 0,
                      border: 2,
                      borderRadius: "10px",
                      borderColor: "white",
                    },
                  }}
                >
                  <TableCell
                    width={15}
                    sx={{ bgcolor: "#FF455C !important" }}
                  ></TableCell>
                  <TableCell align={"center"}>
                    <p>{item.N}</p>
                  </TableCell>
                  <TableCell align={"center"}>
                    <p>{item.Nombre}</p>
                  </TableCell>
                  <TableCell align={"center"}>
                    <p>{item.Dim1}</p>
                  </TableCell>
                  <TableCell align={"center"}>
                    <p>{item.Dim2}</p>
                  </TableCell>
                  <TableCell align={"center"}>
                    <p>{item.Dim3}</p>
                  </TableCell>
                  <TableCell align={"center"}>
                    <p>{item.Dim4}</p>
                  </TableCell>
                  <TableCell align={"center"}>
                    <p>{item.Dim5}</p>
                  </TableCell>
                  <TableCell align={"left"}>
                    <p>{item.Empresa}</p>
                  </TableCell>
                  <TableCell align="left">
                    <p>
                      {item.errores.map((error, i) => (
                        <label key={i} style={{ display: "block" }}>
                          {error}
                        </label>
                      ))}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </MainModal>

      <input
        accept={
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
        type="file"
        onChange={handleImportData}
        hidden
        ref={inputFile}
      />
      <a
        ref={downloadFile}
        href="./bucket/NEGOCIOS_CARGA_INICIAL.xlsx"
        target={"_blank"}
        download
        hidden
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
        body={textConfirm}
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

export default NegociosPage;
