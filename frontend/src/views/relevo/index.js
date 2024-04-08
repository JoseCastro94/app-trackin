import {
    Button,
    Container,
    Grid, IconButton,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {listarHistorialResponsableAlmacen} from "../../services/HistorialResponsableAlmacen";
import {AssignmentTurnedIn, Description, Mail, Print} from "@mui/icons-material";
import {modeContext} from "../../context/modeContext";

const RelevoPage = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const [rows, setRows] = React.useState([])
    const { token, tokenCompany } = React.useContext(modeContext)
    const load = React.useCallback(async () => {
        const data = await listarHistorialResponsableAlmacen(token, tokenCompany)
        setRows(data)
    }, [token, tokenCompany])
    React.useEffect(() => {
        load()
    }, [load, token, tokenCompany])

    return <Container fixed>
        <Grid container>
            <Grid item xs={6} sm={8}>
                <Typography variant='h3' sx={{ color: theme.palette.primary.main }}>
                    Relevo de responsable de almacén
                </Typography>
            </Grid>
            <Grid item xs={6} sm={4} style={{textAlign: "right"}}>
                <Button variant="contained" size="small" onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/relevos/registrar`)}
                >Nuevo responsable</Button>
            </Grid>
        </Grid>
        <br/>
        <Grid item xs={12} sm={12}>
            <TableContainer component={Paper} style={{borderRadius: "0px"}}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                            <TableCell sx={{ width: 5 }}/>
                            <TableCell align="center"># Relvo</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">P. Asignada</TableCell>
                            <TableCell align="center">Fecha Inicio</TableCell>
                            <TableCell align="center">Fecha Salida</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center" sx={{ width: 50 }}>Doc.</TableCell>
                            <TableCell align="center" sx={{ width: 50 }}>Cargo</TableCell>
                            <TableCell align="center" sx={{ width: 50 }}>Imp.</TableCell>
                            <TableCell align="center" sx={{ width: 50 }}>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index} sx={{
                                'td > p': {p: 0, m: 0},
                                'td, th': {px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"},
                                'td': {bgcolor: "grey.200"},
                                'th': {bgcolor: "primary.200"}
                            }}>
                                <TableCell width={15} component="th"></TableCell>
                                <TableCell align="center"><p>{row.codigo}</p></TableCell>
                                <TableCell align="left"><p>{row.documento}</p></TableCell>
                                <TableCell align="center"><p>{row.email}</p></TableCell>
                                <TableCell align="left"><p>{row.fecha_ini}</p></TableCell>
                                <TableCell align="left"><p>{row.fecha_fin}</p></TableCell>
                                <TableCell align="right"><p>{row.estado}</p></TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color="primary"
                                    >
                                        <Description></Description>
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color="primary"
                                    >
                                        <AssignmentTurnedIn></AssignmentTurnedIn>
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color="primary"
                                    >
                                        <Print></Print>
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="find"
                                        size="small"
                                        color="primary"
                                    >
                                        <Mail></Mail>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Container>
}

export default RelevoPage
