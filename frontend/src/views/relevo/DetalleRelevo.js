import {Checkbox, IconButton, TableCell, TableRow, TextField} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";
import * as React from "react";

const DetalleRelevo = (props) => {
    const {articulo} = props

    const handleChangeCantidadRecibida = (value) => {
        //articulo.incidencia = !(articulo.cantidad > value)
    }

    const handleChecked = () => {
        //articulo.checked = !articulo.checked
    }

    return <React.Fragment>
        <TableRow sx={{
            'td > p': {p: 0, m: 0},
            'td, th': {px: 1, py: 0, border: 2, borderRadius: "10px", borderColor: "white"},
            'td': {bgcolor: "grey.200"},
            'th': {bgcolor: "primary.200"}
        }}>
            <TableCell width={15} component="th"></TableCell>
            <TableCell align="center"><p>{articulo.codigo}</p></TableCell>
            <TableCell align="left"><p>{articulo.descripcion}</p></TableCell>
            <TableCell align="center"><p>{articulo.categoria}</p></TableCell>
            <TableCell align="left"><p>{articulo.estado}</p></TableCell>
            <TableCell align="left"><p>{articulo.negocio}</p></TableCell>
            <TableCell align="right"><p>{articulo.stock}</p></TableCell>
            <TableCell sx={{"input": {padding: "4px 8px", textAlign: "right"}, textAlign: "center"}}>
                <TextField
                    disabled={!!articulo.checked}
                    type="number"
                    id="outlined-basic"
                    sx={{ width: 60 }}
                    onChange={(event) => handleChangeCantidadRecibida(event.target.value) }
                    value={articulo.cantidad}/>
            </TableCell>
            <TableCell align="center">
                <IconButton
                    disabled={!articulo.incidencia}
                    aria-label="find"
                    size="small"
                    color="primary"
                    // onClick={() => handleOpenModalRegistrarIncidencia(articulo)}
                >
                    <InfoOutlined></InfoOutlined>
                </IconButton>
            </TableCell>
            <TableCell align="center" padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={!!articulo.checked}
                    onChange={(event) => handleChecked()}
                />
            </TableCell>
        </TableRow>
    </React.Fragment>
}

export default DetalleRelevo