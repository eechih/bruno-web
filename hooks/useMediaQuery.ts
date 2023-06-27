import { Breakpoint, Theme, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useWindowScroll, useWindowSize } from 'react-use'

type BreakpointOrNull = Breakpoint | null

export const useBreakpoint = (): BreakpointOrNull => {
  const theme: Theme = useTheme()
  const keys: readonly Breakpoint[] = [...theme.breakpoints.keys].reverse()
  return (
    keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? key : output
    }, null) || 'xs'
  )
}

interface Screen {
  screenWidth: number
  screenHeight: number
  breakpoint: BreakpointOrNull
  isMobile: boolean // breakpoint == xs, less than 600px
  isTablet: boolean // breakpoint == sm | md, less than 1200px
  isDesktop: boolean // breakpoint == lg | xl, greater than or equal than 1200px
  isPortait: boolean //  width < height
  isLandscape: boolean //  width > height
  scrollX: number
  scroolY: number
}

export const useScreen = (): Screen => {
  const { width, height } = useWindowSize()
  const { x, y } = useWindowScroll()
  const breakpoint = useBreakpoint()
  return {
    screenWidth: width,
    screenHeight: height,
    breakpoint,
    isMobile: breakpoint === 'xs',
    isTablet: breakpoint === 'sm' || breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl',
    isPortait: width < height,
    isLandscape: width > height,
    scrollX: x,
    scroolY: y
  }
}
