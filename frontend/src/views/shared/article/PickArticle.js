import * as React from 'react'

import PropTypes from 'prop-types'

import {
    Typography,
} from '@mui/material'

import MainModal from '../../../ui-component/modals/MainModal.js'

import DataGridApp from '../../../ui-component/grid/DataGridApp.js'

import { modeContext } from '../../../context/modeContext'

const PickArticle = ({
    reload = false,
    open = false,
    handleClose = () => { },
    handleSelectedArticle = () => { },
    url = '',
    param = {},
    columns = [
        { field: 'Articulo', headerName: 'Producto', width: 400 },
        { field: 'CodArticulo', headerName: 'Cod. Producto', width: 200 },
        { field: 'Almacen', headerName: 'Almacen', width: 150 },
        { field: 'Categoria', headerName: 'Categoria', width: 150 },
        {
            field: 'Stock',
            headerName: 'Stock',
            type: 'number',
            width: 90,
        },
        { field: 'id', hide: true },
        { field: 'CodAlmacen', hide: true },
        { field: 'IdArticulo', hide: true },
        { field: 'TieneSerie', hide: true },
    ]
}) => {
    const { token, tokenCompany } = React.useContext(modeContext)
    const [list, setList] = React.useState([])
    const [load, setLoad] = React.useState(false)
    React.useEffect(() => {
 
        if (open && !load) {
     
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
                    if (!reload) {
                        setLoad(true)
                    }
                })
        }
    }, [open, load, url, param, reload, token, tokenCompany])

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
            aria_labelledby="modal-find-article"
            aria_describedby="modal-find-pick-article"
        >
            <Typography id="modal-find-article" variant="h3" component="h2">
                SKU Inventarios
            </Typography>
            <DataGridApp
                rows={list}
                columns={columns}
                onSelectionModelChange={handleSelected}
                height={420}
            />
        </MainModal>
    )
}

PickArticle.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSelectedArticle: PropTypes.func,
}

export default PickArticle