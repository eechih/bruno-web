import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import Button, { ButtonProps } from '@mui/material/Button'

export type FilePickerProps = ButtonProps & {
  width?: number | string
  height?: number
}

export function FilePicker({
  children,
  color = 'inherit',
  size = 'large',
  startIcon = <PhotoCameraIcon />,
  width = '100%',
  height = 160,
  ...props
}: FilePickerProps) {
  return (
    <Button
      {...props}
      color={color}
      size={size}
      startIcon={startIcon}
      sx={{
        border: '1px dashed grey',
        borderRadius: 0,
        width: width,
        height: height
      }}
    >
      {children}
    </Button>
  )
}
