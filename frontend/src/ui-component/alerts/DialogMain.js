import * as React from 'react'
import PropTypes from 'prop-types'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    Grid,
    Button,
    useMediaQuery,
} from '@mui/material'

import { useTheme } from '@mui/material/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const DialogMain = ({
    open = true,
    title = "",
    body = "",
    handleClose = function () { },
    actions,
    buttons = [],
    content
}) => {
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
            sx={{
                zIndex: 2000
            }}
        >
            <DialogTitle
                variant='h3'
                sx={{
                    color: theme.palette.primary.main,
                    minHeight: 80,
                    paddingTop: 5,
                }}
                alignSelf="center"
            >{title}</DialogTitle>
            <DialogContent>
                <DialogContentText
                    textAlign='center'
                    sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                    }}
                    id="alert-dialog-slide-description"
                >
                    {body}
                </DialogContentText>
                {
                    content &&
                    <DialogContent
                        sx={{
                            color: theme.palette.primary.main,
                            paddingBottom: 0,
                            paddingTop: 1
                        }}
                        id="alert-dialog-slide-content"
                    >
                        {content}
                    </DialogContent>
                }
            </DialogContent>
            {
                actions &&
                <DialogActions
                >
                    {actions}
                </DialogActions>
            }
            {
                buttons &&
                <Grid
                    container
                    spacing={matchDownSM ? 0 : 2}
                    sx={{
                        flexGrow: 1,
                        marginBottom: 2
                    }}
                >
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" spacing={matchDownSM ? 0 : 2} >
                            {
                                buttons.map((button, y_button) => {
                                    return (
                                        <Grid item xs={4} sm={4} key={`button_${y_button}`}>
                                            <Button
                                                onClick={button.onClick}
                                                variant={button.variant}
                                                color={button.color}
                                                fullWidth
                                            >
                                                {button.text}
                                            </Button>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Grid>
            }
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