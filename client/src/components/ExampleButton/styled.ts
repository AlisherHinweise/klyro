import { Button, styled } from '@mui/material'

export const StyledButton = styled(Button)`
  font-size: 24px;
  background-color: aquamarine;
  transition: all 0.2s ease-in;

  &:hover {
    opacity: 0.6;
    scale: 1.2;
  }
`
