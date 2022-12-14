import React, { useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  LinearProgress,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Link } from 'react-router-dom';


function App() {
  
  return (
    <React.Fragment>

    <main style={{ display: 'flex', gap: '10px' }}>
      <Button variant="contained" size="large">
        <Link to="/1" style={{ color: 'inherit', textDecoration: 'none' }}>
          Problema do Rio
        </Link>
      </Button>

      <Button variant="contained" size="large">
        <Link to="/2" style={{ color: 'inherit', textDecoration: 'none' }}>
          Problema do Cilindro
        </Link>
      </Button>
    </main>


    </React.Fragment>
  );
}

export default App;
