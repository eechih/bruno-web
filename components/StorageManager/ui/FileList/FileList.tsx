/* eslint-disable no-unused-vars */

import ClearIcon from '@mui/icons-material/Clear'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Unstable_Grid2'

import { FileStatus } from '../../types'
import { FileThumbnail } from '../FileThumbnail'
import { FileListProps } from './types'

export function FileList(props: FileListProps) {
  const { files, onDeleteUpload } = props
  return (
    <Grid container spacing={2}>
      {files.map((storageFile, index) => {
        const { id, file, status, isImage = true } = storageFile
        const thumbnailUrl = file ? URL.createObjectURL(file) : ''
        let subheader = ''
        if (status == FileStatus.UPLOADING) subheader = '上傳中...'
        else if (status === FileStatus.UPLOADED) subheader = '已上傳'

        return (
          <Grid xs={12} key={index}>
            <Card>
              <CardHeader
                avatar={
                  <FileThumbnail
                    url={thumbnailUrl}
                    isImage={isImage}
                    fileName={id}
                    size="small"
                  />
                }
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={() => onDeleteUpload({ id })}
                  >
                    <ClearIcon />
                  </IconButton>
                }
                title={id}
                subheader={
                  status === FileStatus.UPLOADED ? '✔ 已上傳' : '上傳中...'
                }
                subheaderTypographyProps={{
                  color: status === FileStatus.UPLOADED ? '#4caf50' : 'inherit'
                }}
              />
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}
