export interface DialogProps {
  enabled?: boolean // default false
  fullScreen?: boolean // default false
  showTrigger?: boolean // default true
  children?: React.ReactNode
}

export interface DialogHandle {
  open: () => void
  close: () => void
}
