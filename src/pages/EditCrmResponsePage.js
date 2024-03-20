import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Stack,
  Container,
  Typography,
  TextField,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import api from '../api/api';
import Iconify from '../components/iconify';
import useFetch from '../hooks/useFetch';

const EditCrmResponsePage = () => {
  const [initialValues, setInitialValues] = useState({
    fields: [{ response_type: '', response_path: '', expected_type: 'string', expected_value: '', is_empty: false }],
  });
  const [crmName, setCrmName] = useState('');
  const { crmId } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data, refetch } = useFetch(`api/crms/responses/${crmId}`, 'get');

  useEffect(() => {
    if (data) {
      setCrmName(data.crmName);
      setInitialValues({ fields: data.data });
    }
  }, [data]);

  const updateCrm = async (values) => {
    try {
      await api.put(`api/crms/responses/${crmId}`, values);
      navigate('/dashboard/crms');
      return null;
    } catch (error) {
      return error.response.data.errors;
    }
  };

  const validationSchema = Yup.object().shape({
    fields: Yup.array().of(
      Yup.object().shape({
        response_type: Yup.string().required('Тип ответа обязателен'),
        response_path: Yup.string(),
        expected_type: Yup.string(),
        expected_value: Yup.string(),
        is_empty: Yup.boolean(),
      })
    ),
  });

  if (isLoading) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: 'calc(100vh - 200px)' }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: 'calc(100vh - 200px)' }}>
          <Typography variant="subtitle2" noWrap>
            {error}
          </Typography>
          <Button onClick={refetch}>Обновить</Button>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Настройки Создания Лида</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Настройки Создания Лида в {crmName}
          </Typography>
        </Stack>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            const errors = await updateCrm(values);
            if (errors) {
              setErrors(errors);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={3}>
                <FieldArray name="fields">
                  {({ push, remove, form }) => (
                    <>
                      {form.values.fields.map((field, index) => (
                        <Stack key={index} direction="row" spacing={2}>
                          <Field
                            name={`fields[${index}].response_type`}
                            as={TextField}
                            label="Тип ответа"
                            fullWidth
                            variant="outlined"
                          />
                          <Field
                            name={`fields[${index}].response_path`}
                            as={TextField}
                            label="Путь к значению"
                            fullWidth
                            variant="outlined"
                          />
                          <FormControl fullWidth>
                            <InputLabel id={`statusLeadType-${index}`}>Тип ожидаемого значения</InputLabel>
                            <Field
                              name={`fields[${index}].expected_type`}
                              as={Select}
                              labelId={`statusLeadType-${index}`}
                              label="Тип ожидаемого значения"
                            >
                              <MenuItem value={'string'}>string</MenuItem>
                              <MenuItem value={'int'}>int</MenuItem>
                              <MenuItem value={'float'}>float</MenuItem>
                              <MenuItem value={'bool'}>bool</MenuItem>
                            </Field>
                          </FormControl>
                          <Field
                            name={`fields[${index}].expected_value`}
                            as={TextField}
                            label="Ожидаемое значение"
                            fullWidth
                            variant="outlined"
                          />
                          <FormControlLabel
                            fullWidth
                            control={
                              <Field
                                name={`fields[${index}].is_empty`}
                                type="checkbox"
                                as={Switch}
                                checked={field.is_empty}
                              />
                            }
                            label="Пустой Ответ?"
                          />
                          <Button
                            sx={{ color: 'error.main', width: '50%' }}
                            startIcon={<Iconify icon="eva:trash-2-outline" />}
                            onClick={() => remove(index)}
                          >
                            Удалить
                          </Button>
                        </Stack>
                      ))}
                      <Button
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() =>
                          push({
                            id: '',
                            response_type: '',
                            response_path: '',
                            expected_type: 'string',
                            expected_value: '',
                            is_empty: false,
                          })
                        }
                      >
                        Добавить поле
                      </Button>
                    </>
                  )}
                </FieldArray>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ my: 2 }}
                disabled={isSubmitting}
              >
                Обновить
              </LoadingButton>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default EditCrmResponsePage;
