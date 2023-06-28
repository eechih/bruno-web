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

const DIALOG_TITLE = ''
const CLOSE_BUTTON_LABLE = '關閉'

export interface DialogProps {
  children?: React.ReactNode
  fullScreen?: boolean
}

export function Dialog({ children, fullScreen }: DialogProps) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <PhotoCameraIcon />
      </IconButton>
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
}
