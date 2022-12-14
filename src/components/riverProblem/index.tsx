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
} from '@mui/material';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';

const validationSchema = yup.object({
  riverWidth: yup
    .number()
    .typeError('Margem do rio deve ser um número')
    .required('Insira a margem do rio'),
  factoryDistance: yup
    .number()
    .typeError('Distância da fábrica deve ser um número')
    .required('Insira a distância da fábrica'),
  cableCostByRiver: yup
    .number()
    .typeError('Custo do cabo pelo rio deve ser um número')
    .required('Insira o custo do cabo pelo rio'),
  cableCostByGround: yup
    .number()
    .typeError('Custo do cabo por terra deve ser um número')
    .required('Insira o custo do cabo por terra'),
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

function RiverProblem() {
  const [loading, setLoading] = useState(false);
  const [isSnacking, setIsSnacking] = useState(false);

  const formik = useFormik({
    initialValues: {
      riverWidth: 0,
      factoryDistance: 0,
      cableCostByRiver: 0,
      cableCostByGround: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const hasNegativeNumbers = Object.values(values).filter(
        (v) => Number(v) <= 0
      );

      if (hasNegativeNumbers.length) {
        setIsSnacking(true);
        setTimeout(() => setIsSnacking(false), 3000);
        return;
      }

      let criticalPoint = 0;
      criticalPoint = Math.sqrt(
        (Math.pow(values.cableCostByGround, 2) *
          Math.pow(values.riverWidth, 2)) /
          (Math.pow(values.cableCostByRiver, 2) -
            Math.pow(values.cableCostByGround, 2))
      );

      if (
        Math.pow(values.cableCostByRiver, 2) -
          Math.pow(values.cableCostByGround, 2) <
        0
      ) {
        criticalPoint = Math.sqrt(
          (Math.pow(values.cableCostByGround, 2) *
            Math.pow(values.riverWidth, 2)) /
            (Math.pow(values.cableCostByGround, 2) -
              Math.pow(values.cableCostByRiver, 2))
        );
      }

      const shortestDistanceByRiver = Math.sqrt(
        Math.pow(criticalPoint, 2) + Math.pow(values.riverWidth, 2)
      );
      const shortestDistanceByGround = values.factoryDistance - criticalPoint;
      const costFunction =
        values.cableCostByRiver * shortestDistanceByRiver +
        values.cableCostByGround * shortestDistanceByGround;

      const result = {
        criticalPoint,
        shortestDistanceByGround,
        shortestDistanceByRiver,
        costFunction,
      };

      setOutput(result);
    },
  });

  const [output, setOutput] = useState({
    criticalPoint: 0,
    shortestDistanceByRiver: 0,
    shortestDistanceByGround: 0,
    costFunction: 0,
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
            id='riverWidth'
            name='riverWidth'
            label='Margem do rio'
            value={formik.values.riverWidth}
            onChange={formik.handleChange}
            error={
              formik.touched.riverWidth && Boolean(formik.errors.riverWidth)
            }
            helperText={formik.touched.riverWidth && formik.errors.riverWidth}
            sx={{ width: 280 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='start'>Metros</InputAdornment>
              ),
            }}
          />
          <TextField
            id='factoryDistance'
            name='factoryDistance'
            label='Distância da Fábrica'
            value={formik.values.factoryDistance}
            onChange={formik.handleChange}
            error={
              formik.touched.factoryDistance &&
              Boolean(formik.errors.factoryDistance)
            }
            helperText={
              formik.touched.factoryDistance && formik.errors.factoryDistance
            }
            sx={{ width: 280 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='start'>Metros</InputAdornment>
              ),
            }}
          />
          <TextField
            id='cableCostByRiver'
            name='cableCostByRiver'
            label='Custo pelo rio'
            value={formik.values.cableCostByRiver}
            onChange={formik.handleChange}
            error={
              formik.touched.cableCostByRiver &&
              Boolean(formik.errors.cableCostByRiver)
            }
            helperText={
              formik.touched.cableCostByRiver && formik.errors.cableCostByRiver
            }
            sx={{ width: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>R$</InputAdornment>
              ),
            }}
          />
          <TextField
            id='cableCostByGround'
            name='cableCostByGround'
            label='Custo por terra'
            value={formik.values.cableCostByGround}
            onChange={formik.handleChange}
            error={
              formik.touched.cableCostByGround &&
              Boolean(formik.errors.cableCostByGround)
            }
            helperText={
              formik.touched.cableCostByGround &&
              formik.errors.cableCostByGround
            }
            sx={{ width: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>R$</InputAdornment>
              ),
            }}
          />
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
            <Typography sx={{ textAlign: 'left' }}>Menor custo</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 'bold' }}>
              {output.costFunction.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography sx={{ textAlign: 'left' }}>
              Distância percorrida pelo rio
            </Typography>
            <Typography
              sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'left' }}
            >
              {output.shortestDistanceByRiver.toFixed(2)}m
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography sx={{ textAlign: 'left' }}>
              Distância percorrida por terra
            </Typography>
            <Typography
              sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'left' }}
            >
              {output.shortestDistanceByGround.toFixed(2)}m
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

export default RiverProblem;
