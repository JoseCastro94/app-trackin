import { DataGrid, esES } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

import { useTheme } from '@mui/material/styles'

const DataGridApp = ({
    rows = [],
    columns = [],
    height = 400,
    width = '100%',
    pageSize = 5,
    rowsPerPageOptions = [5],
    onCellEditCommit,
    onSelectionModelChange,
    checkboxSelection,
    disableSelectionOnClick,
    selectionModel,
    loading = false
}) => {
    const theme = useTheme()
    return (
        <Box
            sx={{
                height: height,
                width: width,
                '& .super-app-grid.primary div': {
                    backgroundColor: `${theme.palette.primary.main} !important`,
                    color: '#fff',
                    fontWeight: '500',
                },
                '& .super-app-grid.warning div': {
                    backgroundColor: `${theme.palette.warning.main}  !important`,
                    color: '#fff',
                    fontWeight: '500',
                },
                '& .super-app-grid.success div': {
                    backgroundColor: `${theme.palette.success.main} !important`,
                    color: '#fff',
                    fontWeight: '500',
                },
                '& .super-app-grid.error div': {
                    backgroundColor: `${theme.palette.error.main} !important`,
                    color: '#fff',
                    fontWeight: '500',
                },
                '& .super-app-grid.secondary div': {
                    backgroundColor: `${theme.palette.secondary.main} !important`,
                    color: '#fff',
                    fontWeight: '500',
                },
            }}
        >
            <DataGrid
                sx={{
                    border: 0,
                }}
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={rowsPerPageOptions}
                onCellEditCommit={onCellEditCommit}
                onSelectionModelChange={onSelectionModelChange}
                checkboxSelection={checkboxSelection}
                disableSelectionOnClick={disableSelectionOnClick}
                selectionModel={selectionModel}
                loading={loading}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </Box>
    )
}

export default DataGridApp