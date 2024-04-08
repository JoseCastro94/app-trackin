import * as React from 'react'
import PropTypes from 'prop-types'
import {
    Dialog,
    DialogContent,
    Slide,
    Grid,
    Button,
    useMediaQuery,
    Typography,
} from '@mui/material'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineOutlined  from '@mui/icons-material/ErrorOutlineOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'

import { useTheme } from '@mui/material/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const options = {
    warning: {
        icon: WarningAmberOutlinedIcon,
        color: "warning",
    },
    info: {
        icon: InfoOutlinedIcon,
        color: "primary",
    },
    error: {
        icon: ErrorOutlineOutlined,
        color: "error",
    },
    success: {
        icon: CheckCircleOutlineIcon,
        color: "success",
    }
}

const DialogMain = ({
    open = true,
    title = "",
    body = "",
    handleClose = function () { },
    severity = 'info'
}) => {
    let tipo = {
        icon: InfoOutlinedIcon,
        color: "primary",
    }
    if (severity) {
        const pick = options[severity]
        if (pick) {
            tipo = pick
        }
    }
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
    return (
        <Dialog
            fullWidth={true}
            maxWidth="xs"
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
                sx: {
                    minHeight: 200
                }
            }}
        >
            <DialogContent
                sx={{
                    textAlign: 'center'
                }}
            >
                <tipo.icon
                    color={tipo.color}
                    sx={{
                        fontSize: 100
                    }}
                ></tipo.icon>
                <Typography
                    variant='h3'
                    sx={{
                        color: theme.palette.primary.main,
                        marginBottom: 1
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant='h5'
                    sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                    }}
                >
                    {body}
                </Typography>
            </DialogContent>
            <Grid
                container
                spacing={matchDownSM ? 0 : 2}
                sx={{ flexGrow: 1 }}
                paddingBottom={5}
            >
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={matchDownSM ? 0 : 2}>
                        <Grid item xs={4} sm={4}>
                            <Button
                                onClick={handleClose}
                                variant="contained"
                                color='primary'
                                fullWidth
                            >
                                Aceptar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog >
    )
}

DialogMain.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    body: PropTypes.string,
    actions: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    buttons: PropTypes.array,
}

export default DialogMain