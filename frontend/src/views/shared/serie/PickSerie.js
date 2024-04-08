import * as React from 'react'

import PropTypes from 'prop-types'

import {
    Typography,
} from '@mui/material'

import MainModal from '../../../ui-component/modals/MainModal.js'

import DataGridApp from '../../../ui-component/grid/DataGridApp.js'

import { modeContext } from '../../../context/modeContext'

const PickSerie = ({
    open = false,
    handleClose = () => { },
    handleSelectedArticle = () => { },
    url = '',
    param = {},
    columns = [
        { field: 'SerialNumber', headerName: 'Serie', width: 400 },
        { field: 'id', hide: true },
        { field: 'IdAlmacen', hide: true },
        { field: 'IdNegocio', hide: true },
        { field: 'IdArticulo', hide: true },
        { field: 'IdGrupoArticulo', hide: true },
    ]
}) => {
    const { token, tokenCompany } = React.useContext(modeContext)
    const [list, setList] = React.useState([])
    React.useEffect(() => {
        if (open) {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(param),
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'empresa': tokenCompany,
                    cache: 'no-cache',
                    pragma: 'no-cache',
                    'cache-control': 'no-cache'
                }
            })
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    setList(response)
                })
        }
    }, [open, url, param, token, tokenCompany])

    const handleSelected = (ids) => {
        const selectedIDs = new Set(ids)
        const selectedRowData = list.find((row) =>
            selectedIDs.has(row.id)
        )
        if (selectedRowData) {
            handleClose()
            handleSelectedArticle(selectedRowData)
        }
    }

    return (
        <MainModal
            open={open}
            onClose={handleClose}
            aria_labelledby="modal-find-serie"
            aria_describedby="modal-find-pick-serie"
        >
            <Typography id="modal-find-serie" variant="h3" component="h2">
                Control de series
            </Typography>
            <DataGridApp
                rows={list}
                columns={columns}
                onSelectionModelChange={handleSelected}
            />
        </MainModal>
    )
}

PickSerie.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSelectedArticle: PropTypes.func,
}

export default PickSerie