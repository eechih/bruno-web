import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiDialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'

import { DialogHandle, DialogProps } from './types'

const DIALOG_TITLE = ''
const CLOSE_BUTTON_LABLE = '關閉'

function DialogBase(props: DialogProps, ref: React.ForwardedRef<DialogHandle>) {
  const {
    children,
    enabled = false,
    fullScreen = false,
    showTrigger = true
  } = props
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  React.useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true)
    },
    close: () => {
      setOpen(false)
    }
  }))

  if (enabled) {
    return (
      <Box>
        {showTrigger && (
          <IconButton onClick={handleOpen}>
            <PhotoCameraIcon />
          </IconButton>
        )}
        <MuiDialog
          open={open}
          onClose={handleClose}
          fullScreen={fullScreen}
          fullWidth
        >
          {(fullScreen && (
            <>
              <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                  <Typography
                    sx={{ ml: 1, flex: 1 }}
                    variant="h6"
                    component="div"
                  >
                    {DIALOG_TITLE}
                  </Typography>
                  <Button autoFocus color="inherit" onClick={handleClose}>
                    {CLOSE_BUTTON_LABLE}
                  </Button>
                </Toolbar>
              </AppBar>
              <Box sx={{ p: 1.5 }}>{children}</Box>
            </>
          )) || (
            <>
              <DialogTitle>{DIALOG_TITLE}</DialogTitle>
              <DialogContent>{children}</DialogContent>
              <DialogActions>
                <Button onClick={handleClose}> {CLOSE_BUTTON_LABLE}</Button>
              </DialogActions>
            </>
          )}
        </MuiDialog>
      </Box>
    )
  } else {
    return <Box>{children}</Box>
  }
}

const Dialog = React.forwardRef<DialogHandle, DialogProps>(DialogBase)

export { Dialog }
