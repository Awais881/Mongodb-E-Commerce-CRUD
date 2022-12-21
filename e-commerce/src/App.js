import logo from './logo.svg';
import './App.css';
import { Stack } from '@mui/system';
import { Box, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Products from "./components/index"

function App() {
  return (
    <Stack>
    <Products/>
  </Stack>
  );
}

export default App;
