import { forwardRef } from 'react'

import {
    Box,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'

import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.grey[500],
        fontSize: 12,
        paddingBottom: 0
    },
}))

const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        marginBottom: 0
    },
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        backgroundColor: theme.palette.action.hover,
        padding: 10,
        border: 'solid 5px #ffffff'
    },
}))


const MainTable = forwardRef(
    (
        {
            children
        },
        ref
    ) => {
        return (
            <Box
                sx={{ height: 300, width: '100%' }}
                ref={ref}
            >
                <TableContainer style={{  }}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <StyledTableHeadRow>
                                <StyledTableHeadCell></StyledTableHeadCell>
                                <StyledTableHeadCell align="right">Cod. producto</StyledTableHeadCell>
                                <StyledTableHeadCell align="right">Cant.</StyledTableHeadCell>
                                <StyledTableHeadCell align="right">P. Asignada</StyledTableHeadCell>
                                <StyledTableHeadCell align="right">Fecha de Recojo</StyledTableHeadCell>
                            </StyledTableHeadRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key="Prueba">
                                <StyledTableCell component="th" scope="row">
                                    Chaleco de seguridad
                                </StyledTableCell>
                                <StyledTableCell align="right">156156165</StyledTableCell>
                                <StyledTableCell align="right">15</StyledTableCell>
                                <StyledTableCell align="right">73101238</StyledTableCell>
                                <StyledTableCell align="right">09/07/1995</StyledTableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }
)

MainTable.propTypes = {
}

export default MainTable