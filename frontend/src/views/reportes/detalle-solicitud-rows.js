import * as React from "react";
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DetalleSolicitudRowsPage = (props) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [detalle, setDetalle] = React.useState([]);

    React.useEffect(() => {
        setDetalle(row.detalle)
    }, [row.detalle])

    return <React.Fragment>
        <TableRow sx={{
            'td > p': {p: 0, m: 0},
            'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
        }}>
            <TableCell width={15} sx={{bgcolor: '#90caf9 !important'}}></TableCell>
            <TableCell align="center"><p>{row.codigo}</p></TableCell>
            <TableCell align="center"><p>{row.estado}</p></TableCell>
            <TableCell align="center"><p>{row.motivo}</p></TableCell>
            <TableCell align="center"><p>{row.solicitante}</p></TableCell>
            <TableCell align="center"><p>{row.documento}</p></TableCell>
            <TableCell align="center"><p>{row.fecha_solicitud}</p></TableCell>
            <TableCell align="center"><p>{row.fecha_propuesta}</p></TableCell>
            <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={15}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow sx={{'td, th': { py: 0.2, px: 0.2, border: 0 }}}>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell align="center">Cod. Prod.</TableCell>
                                    <TableCell align="center" width={120}>Serie</TableCell>
                                    <TableCell align="center">Asignado</TableCell>
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                    <TableCell align="center">Almacén</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalle.map((item, index) => (
                                    <TableRow key={index} sx={{
                                        'td > p': {px: 1, fontSize: "12px", margin: "0px"},
                                        'td, th': {bgcolor: "grey.200", px: 0, py: 0.5, border: 2, borderRadius: "10px", borderColor: "white"}
                                    }}>
                                        <TableCell width={15} sx={{bgcolor: "#000064 !important"}}/>
                                        <TableCell>
                                            <p>{item.nombre}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.codigo}</p>
                                        </TableCell>
                                        <TableCell sx={{"input": {padding: "4px 8px", textAlign: "right"}, textAlign: "center"}}>
                                            <p>{item.serie || 'N/A'}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.asignado}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.negocio}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.cantidad}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.almacen}</p>
                                        </TableCell>
                                        <TableCell align="center">
                                            <p>{item.estado}</p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </React.Fragment>
}

export default DetalleSolicitudRowsPage;
