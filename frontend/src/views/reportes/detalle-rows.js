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
import {Download, Print} from "@mui/icons-material";
import {generarPdf, generarPdfDevolucion} from "../../services/Despacho";

const DetalleRowsPage = (props) => {
    const { row, openModalArchivos, module, token, tokenCompany } = props;
    const [open, setOpen] = React.useState(false);
    const [detalle, setDetalle] = React.useState([]);

    const print = async (row) => {
        let pdf = null
        row.cuenta = row.negocio
        if (module === 'entrega') {
            pdf = await generarPdf(row, token, tokenCompany)
        } else {
            row.num_doc = row.dni_asignado
            row.detalle = row.detalle.map(el => {
                el.descripcion = el.nombre_producto
                el.codigo = el.codigo_producto
                el.cantidad = el.cantidad_entregada
                return el
            })
            pdf = await generarPdfDevolucion(row, token, tokenCompany)
        }
        // const base64Response = await fetch(`data:application/pdf;base64,${pdf}`)
        // const blob = await base64Response.blob();
        window.open(URL.createObjectURL(pdf))
    }

    React.useEffect(() => {
        setDetalle(row.detalle)
    }, [row.detalle])

    return <React.Fragment>
        <TableRow sx={{
            'td > p': {p: 0, m: 0},
            'td, th': {bgcolor: "grey.200", px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"}
        }}>
            <TableCell width={15} sx={{bgcolor: '#90caf9 !important'}}></TableCell>
            <TableCell align="center"><p>{row.codigo_despacho}</p></TableCell>
            <TableCell align="center"><p>{row.codigo_solicitud}</p></TableCell>
            <TableCell align="center"><p>{row.almacen}</p></TableCell>
            <TableCell align="center"><p>{row.responsable_almacen}</p></TableCell>
            <TableCell align="center"><p>{row.responsable_despacho}</p></TableCell>
            <TableCell align="center"><p>{row.negocio}</p></TableCell>
            <TableCell align="center"><p>{row.asignado}</p></TableCell>
            <TableCell align="center"><p>{row.dni_asignado}</p></TableCell>
            <TableCell align="center">{row.estado}</TableCell>
            <TableCell align="center"><p>{row.fecha}</p></TableCell>
            <TableCell align="center"><p>{row.hora}</p></TableCell>
            <TableCell>
                <IconButton color="primary"
                            aria-label="Imprimir"
                            onClick={() => print(row)}>
                    <Print />
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton color="primary"
                            aria-label="Download"
                            onClick={() => openModalArchivos(row.id, true)}>
                    <Download />
                </IconButton>
            </TableCell>
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
                                    <TableCell align="center">Negocio</TableCell>
                                    <TableCell align="center">Picking</TableCell>
                                    <TableCell align="center">Entregado</TableCell>
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
                                            <p>{item.nombre_producto}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.codigo_producto}</p>
                                        </TableCell>
                                        <TableCell sx={{"input": {padding: "4px 8px", textAlign: "right"}, textAlign: "center"}}>
                                            <p>{item.serie || 'N/A'}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.cuenta}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.cantidad_picking}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <p>{item.cantidad_entregada}</p>
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

export default DetalleRowsPage;
