import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

type Breadcrumb = {
  label: string
  href?: string
}

export default function Breadcrumbs(props: { breadcrumbs: Breadcrumb[] }) {
  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {props.breadcrumbs.map((breadcrumb, index) => {
        const { label, href } = breadcrumb
        if (href)
          return (
            <Link href={href} key={index}>
              <Typography
                variant="overline"
                sx={{ color: '#1976d2' }}
                key={index}
              >
                {label}
              </Typography>
            </Link>
          )
        else
          return (
            <Typography variant="overline" key={index}>
              {label}
            </Typography>
          )
      })}
    </MuiBreadcrumbs>
  )
}
