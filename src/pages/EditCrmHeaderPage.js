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
} from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import api from '../api/api';
import Iconify from '../components/iconify';
import useFetch from '../hooks/useFetch';

const EditCrmHeaderPage = () => {
  const [initialValues, setInitialValues] = useState({ id: '', headers: [] });
  const [crmName, setCrmName] = useState('');
  const { crmId } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data, refetch } = useFetch(`api/crms/headers/${crmId}`, 'get');

  useEffect(() => {
    if (data) {
      setCrmName(data?.name);
      setInitialValues({
        id: data?.id,
        headers: data?.headers,
      });
    }
  }, [data]);

  const updateCrm = async (values) => {
    try {
      await api.put(`api/crms/headers/${crmId}`, values);
      navigate('/dashboard/crms');
      return null;
    } catch (error) {
      return error.response.data.errors;
    }
  };

  const validationSchema = Yup.object().shape({
    headers: Yup.array(),
  });

  if (isLoading && !data) {
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
        <title>Настройки Статуса Лида</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Настройки Статуса Лида в {crmName}
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
              <Stack spacing={1}>
                <FieldArray name="headers">
                  {({ push, remove, form }) => (
                    <>
                      {form.values.headers.map((header, index) => (
                        <Stack key={index} direction="column" spacing={1}>
                          <Field
                            name={`headers[${index}].header_name`}
                            as={TextField}
                            label="Имя поля"
                            fullWidth
                            variant="outlined"
                          />
                          {typeof header.header_value !== 'object' || header.header_value === null ? (
                            <Field
                              name={`headers[${index}].header_value`}
                              as={TextField}
                              label="Значение поля"
                              fullWidth
                              variant="outlined"
                            />
                          ) : (
                            <>
                              <Field
                                name={`headers[${index}].header_value.auth_type`}
                                as={TextField}
                                label="Тип Авторизации"
                                fullWidth
                              />
                              <Field
                                name={`headers[${index}].header_value.base_url`}
                                as={TextField}
                                label="URL"
                                fullWidth
                              />
                              <FormControl fullWidth>
                                <InputLabel id={`headerContentType-${index}`}>Тип отправки</InputLabel>
                                <Field
                                  name={`headers[${index}].header_value.content_type`}
                                  as={Select}
                                  labelId={`headerContentType-${index}`}
                                  label="Тип отправки"
                                >
                                  <MenuItem value={'json'}>json</MenuItem>
                                  <MenuItem value={'form_params'}>form_params</MenuItem>
                                  <MenuItem value={'query'}>query</MenuItem>
                                  <MenuItem value={'multipart'}>multipart</MenuItem>
                                </Field>
                              </FormControl>
                              <FormControl fullWidth>
                                <InputLabel id={`headerType-${index}`}>Метод</InputLabel>
                                <Field
                                  name={`headers[${index}].header_value.method`}
                                  as={Select}
                                  labelId={`headerType-${index}`}
                                  label="Метод"
                                >
                                  <MenuItem value={'GET'}>GET</MenuItem>
                                  <MenuItem value={'POST'}>POST</MenuItem>
                                </Field>
                              </FormControl>
                              <Field
                                name={`headers[${index}].header_value.token_path`}
                                as={TextField}
                                label="Путь к токену(через точку)"
                                fullWidth
                              />
                              <FieldArray name={`headers[${index}].header_value.fields`}>
                                {({ push: pushField, remove: removeField }) => (
                                  <>
                                    {header.header_value.fields.map((field, fieldIndex) => (
                                      <Stack key={fieldIndex} direction="row" spacing={2}>
                                        <Field
                                          name={`headers[${index}].header_value.fields[${fieldIndex}].header_name`}
                                          as={TextField}
                                          label="Имя вложенного поля"
                                          fullWidth
                                        />
                                        <Field
                                          name={`headers[${index}].header_value.fields[${fieldIndex}].header_value`}
                                          as={TextField}
                                          label="Значение вложенного поля"
                                          fullWidth
                                        />
                                        <FormControl fullWidth>
                                          <InputLabel id={`headerAuthType-${fieldIndex}`}>Тип</InputLabel>
                                          <Field
                                            name={`headers[${index}].header_value.fields[${fieldIndex}].header_type`}
                                            as={Select}
                                            labelId={`headerAuthType-${fieldIndex}`}
                                            label="Тип"
                                          >
                                            <MenuItem value={'string'}>STRING</MenuItem>
                                            <MenuItem value={'int'}>INT</MenuItem>
                                            <MenuItem value={'float'}>FLOAT</MenuItem>
                                          </Field>
                                        </FormControl>
                                        <Button
                                          fullWidth
                                          sx={{ color: 'error.main' }}
                                          startIcon={<Iconify icon="eva:trash-2-outline" />}
                                          onClick={() => removeField(fieldIndex)}
                                        >
                                          Удалить вложенное поле
                                        </Button>
                                      </Stack>
                                    ))}
                                    <Button
                                      onClick={() =>
                                        pushField({ id: '', header_name: '', header_value: '', header_type: '' })
                                      }
                                    >
                                      Добавить вложенное поле
                                    </Button>
                                  </>
                                )}
                              </FieldArray>
                            </>
                          )}

                          <Button
                            sx={{ color: 'error.main' }}
                            fullWidth
                            startIcon={<Iconify icon="eva:trash-2-outline" />}
                            onClick={() => remove(index)}
                          >
                            Удалить
                          </Button>
                        </Stack>
                      ))}
                      <Stack direction="row" spacing={2}>
                        <Button
                          startIcon={<Iconify icon="eva:plus-fill" />}
                          fullWidth
                          onClick={() =>
                            push({
                              id: '',
                              header_name: '',
                              header_value: '',
                            })
                          }
                        >
                          Добавить поле
                        </Button>
                        <Button
                          startIcon={<Iconify icon="eva:plus-fill" />}
                          fullWidth
                          onClick={() =>
                            push({
                              id: '',
                              header_name: '',
                              header_value: {
                                id: '',
                                auth_type: '',
                                base_url: '',
                                method: '',
                                content_type: '',
                                token_path: '',
                                fields: [],
                              },
                            })
                          }
                        >
                          Добавить поле для авторизации
                        </Button>
                      </Stack>
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

export default EditCrmHeaderPage;
