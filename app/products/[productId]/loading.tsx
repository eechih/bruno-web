import {
  Box,
  Unstable_Grid2 as Grid,
  Skeleton,
  SkeletonProps,
  Stack
} from '@/components/mui/material'

const MySkeleton = (props: SkeletonProps) => (
  <Skeleton animation="wave" variant="rectangular" width="100%" {...props} />
)

export default function Loading() {
  return (
    <Box>
      <Stack sx={{ p: 2, pl: 1 }}>
        <MySkeleton variant="rectangular" width={320} height={24} />
      </Stack>
      <Grid container>
        <Grid xs={12} md={6}>
          <Stack spacing={2} sx={{ p: 1 }}>
            <MySkeleton width={100} height={32} />
            <MySkeleton height={56} />
            <MySkeleton height={56} />
            <MySkeleton height={56} />
            <MySkeleton height={56} />
            <MySkeleton height={56} />
            <Stack direction="row" spacing={2}>
              <MySkeleton height={56} />
              <MySkeleton height={56} />
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} md={6}>
          <Stack spacing={2} sx={{ p: 1 }}>
            <MySkeleton width={100} height={32} />
            <MySkeleton height={378} />
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack spacing={2} sx={{ p: 1 }}>
            <MySkeleton width={100} height={32} />
            <MySkeleton width={200} height={200} />
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack direction="row" justifyContent="end" spacing={2}>
            <MySkeleton width={64} height={36} />
            <MySkeleton width={88} height={36} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
