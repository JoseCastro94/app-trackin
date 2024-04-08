import * as React from "react";
import {Alert, AlertTitle, Snackbar} from "@mui/material";

const AlertMessage = (props) => {
    const {title = '', message = '', severity = 'success'} = props
    const [openAlert, setOpenAlert] = React.useState(false)

    React.useEffect(() => {
        setOpenAlert(true)
    }, [])

    return <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openAlert}
        key="top_left"
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
    >
        <Alert severity={severity}
               onClose={() => setOpenAlert(false)}
               sx={{ width: '100%' }}>
            {title ? <AlertTitle>{title}</AlertTitle> : ''}
            {message}
        </Alert>
    </Snackbar>
}

export default AlertMessage
