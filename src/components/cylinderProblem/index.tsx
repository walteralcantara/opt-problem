import React, { useState } from 'react';
import { CalculateOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@mui/material';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';

const validationSchema = yup.object({
  volume: yup
    .number()
    .typeError('O volume deve ser um número')
    .required('Insira um volume'),
  custoBase: yup
    .number()
    .typeError('O custo da base deve ser um número')
    .required('Insira o custo da base'),
  custoLateral: yup
    .number()
    .typeError('Custo da lateral deve ser um número')
    .required('Insira o custo da lateral'),
  comTampa: yup.boolean(),
});

/*
[testes]
---
rio = 400m
distancia fab = 1000
custo rio = 130
custo terra = 50
---
rio = 900
distancia fab = 3000
custo rio = 5
custo terra = 4
---
rio = 6000
distancia fab = 10000
custo rio = 10
custo terra = 8
---**
rio = 900
distancia = 3000
custo rio =1 
custo terra = 4
*/

function CylinderProblem() {
  const [loading, setLoading] = useState(false);
  const [isSnacking, setIsSnacking] = useState(false);

  const formik = useFormik({
    initialValues: {
      volume: 0,
      custoBase: 0,
      custoLateral: 0,
      comTampa: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const hasNegativeNumbers = Object.values(values).filter(
        (v) => Number(v) < 0
      );

      if (hasNegativeNumbers.length) {
        setIsSnacking(true);
        setTimeout(() => setIsSnacking(false), 3000);
        return;
      }

      let ntampa = 1;
      if (values.comTampa) {
        ntampa = 2;
      }

      let raio = Math.pow(
        (values.volume * values.custoLateral * 2) / (2 * values.custoBase),
        1 / 3
      );
      let base = Math.PI * Math.pow(raio, 2);
      let altura = values.volume / Math.pow(raio, 2);
      let areaLateral = 2 * Math.PI * raio * altura;
      let custoTotal =
        values.custoBase * ntampa * base + values.custoLateral * areaLateral;

      const result = {
        raio,
        altura,
        base,
        areaLateral,
        custoTotal,
      };

      setOutput(result);
    },
  });

  const [output, setOutput] = useState({
    raio: 0,
    altura: 0,
    base: 0,
    areaLateral: 0,
    custoTotal: 0,
  });

  return (
    <main>
      <Button
        variant='contained'
        size='large'
        sx={{ position: 'absolute', top: '50px' }}
      >
        <Link to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
          Voltar
        </Link>
      </Button>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          setLoading(true);
          setTimeout(() => {
            formik.handleSubmit();
            setLoading(false);
          }, 1500);
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <TextField
            id='volume'
            name='volume'
            label='Volume'
            value={formik.values.volume}
            onChange={formik.handleChange}
            error={formik.touched.volume && Boolean(formik.errors.volume)}
            helperText={formik.touched.volume && formik.errors.volume}
            sx={{ width: 280 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='start'>cm³</InputAdornment>
              ),
            }}
          />
          <TextField
            id='custoBase'
            name='custoBase'
            label='Custo base'
            value={formik.values.custoBase}
            onChange={formik.handleChange}
            error={formik.touched.custoBase && Boolean(formik.errors.custoBase)}
            helperText={formik.touched.custoBase && formik.errors.custoBase}
            sx={{ width: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>R$</InputAdornment>
              ),
            }}
          />
          <TextField
            id='custoLateral'
            name='custoLateral'
            label='Custo lateral'
            value={formik.values.custoLateral}
            onChange={formik.handleChange}
            error={
              formik.touched.custoLateral && Boolean(formik.errors.custoLateral)
            }
            helperText={
              formik.touched.custoLateral && formik.errors.custoLateral
            }
            sx={{ width: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>R$</InputAdornment>
              ),
            }}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  id='comTampa'
                  name='comTampa'
                  value={formik.values.comTampa}
                  onChange={formik.handleChange}
                />
              }
              label='Está com tampa?'
              labelPlacement='top'
            />
          </FormGroup>
        </div>

        <Button
          variant='outlined'
          fullWidth
          size='large'
          type='submit'
          sx={{ margin: '20px 0' }}
          disabled={!!Object.values(formik.errors).length}
        >
          <CalculateOutlined fontSize='large' />
          Calcular
          {loading && <CircularProgress sx={{ marginLeft: '10px' }} />}
        </Button>
      </form>

      <Box sx={{ display: 'flex', gap: '10px' }}>
        <Card>
          <CardContent>
            <Typography sx={{ textAlign: 'left' }}>
              Custo total da embalagem
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 'bold' }}>
              {output.custoTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography sx={{ textAlign: 'left' }}>Altura</Typography>
            <Typography
              sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'left' }}
            >
              {output.altura.toFixed(2)}cm
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography sx={{ textAlign: 'left' }}>Raio</Typography>
            <Typography
              sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'left' }}
            >
              {output.raio.toFixed(2)}cm
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography sx={{ textAlign: 'left' }}>Area lateral</Typography>
            <Typography
              sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'left' }}
            >
              {output.areaLateral.toFixed(2)}cm
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography sx={{ textAlign: 'left' }}>Base</Typography>
            <Typography
              sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'left' }}
            >
              {output.base.toFixed(2)}cm
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={isSnacking}
        autoHideDuration={6000}
        onClose={console.log}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          className='SNACKBAR-ALERT'
          severity='error'
          sx={{ background: '#d84646', color: '#fff !important' }}
        >
          Valor inválido!
        </Alert>
      </Snackbar>
    </main>
  );
}

export default CylinderProblem;
