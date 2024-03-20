import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Stack,
  Container,
  Typography,
  TextField,
  CircularProgress,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import api from '../api/api';
import Iconify from '../components/iconify';
import useFetch from '../hooks/useFetch';

const EditCrmCreatePage = () => {
  const [initialValues, setInitialValues] = useState({
    base_url: '',
    method: '',
    content_type: '',
    uuid_path: '',
    fields: [],
  });
  const [currentCreateId, setCurrentCreateId] = useState(0);
  const [crmName, setCrmName] = useState('');
  const [leadFields, setLeadFields] = useState([]);
  const { crmId } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data, refetch } = useFetch(`api/crms/create/${crmId}`, 'get');

  useEffect(() => {
    if (data) {
      setCrmName(data.crmName);
      setLeadFields(data.leadFields);
      if(data.isRelation){
        setCurrentCreateId(data.id);
        setInitialValues({
          base_url: data.base_url,
          method: data.method,
          content_type: data.content_type,
          uuid_path: data.uuid_path,
          fields: data.fields.map((field) => ({
            ...field,
            id: field.id,
            local_field: field.local_field || '',
            remote_field: field.remote_field || '',
            field_type: field.field_type || '',
            another_value: field.another_value || '',
            is_required: field.is_required || '',
          })),
        });
      }
      
    }
  }, [data]);

  const updateCrm = async (values) => {
    try {
      await api.put(`api/crms/create/${currentCreateId}`, values);
      navigate('/dashboard/crms');
      return null;
    } catch (error) {
      return error.response.data.errors;
    }
  };

  const validationSchema = Yup.object().shape({
    base_url: Yup.string().url('Введите корректный URL').required('URL обязателен'),
    method: Yup.string().required('Метод обязателен'),
    fields: Yup.array(),
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
            values.crmId = crmId;
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
                <Field name="base_url">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      placeholder="URL"
                      label="URL"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      error={Boolean(form.errors.base_url && form.touched.base_url)}
                      helperText={form.errors.base_url && form.touched.base_url ? form.errors.base_url : null}
                    />
                  )}
                </Field>
                <Field name="content_type">
                  {({ field, form }) => (
                    <FormControl fullWidth>
                      <InputLabel id="content_type-select-label">Тип отправки</InputLabel>
                      <Select
                        labelId="content_type-select-label"
                        id="content_type-select"
                        {...field}
                        label="Тип отправки"
                        error={Boolean(form.errors.content_type && form.touched.content_type)}
                      >
                        <MenuItem value={'json'}>json</MenuItem>
                        <MenuItem value={'form_params'}>form_params</MenuItem>
                        <MenuItem value={'query'}>query</MenuItem>
                        <MenuItem value={'multipart'}>multipart</MenuItem>
                      </Select>
                      <ErrorMessage name="content_type">
                        {(msg) => <FormHelperText error>{msg}</FormHelperText>}
                      </ErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="method">
                  {({ field, form }) => (
                    <FormControl fullWidth>
                      <InputLabel id="method-select-label">Метод</InputLabel>
                      <Select
                        labelId="method-select-label"
                        id="method-select"
                        {...field}
                        label="Метод"
                        error={Boolean(form.errors.method && form.touched.method)}
                      >
                        <MenuItem value={'GET'}>GET</MenuItem>
                        <MenuItem value={'POST'}>POST</MenuItem>
                      </Select>
                      <ErrorMessage name="method">{(msg) => <FormHelperText error>{msg}</FormHelperText>}</ErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="uuid_path">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      placeholder="Путь к uuid(через точку)"
                      label="Путь к uuid(через точку)"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      error={Boolean(form.errors.uuid_path && form.touched.uuid_path)}
                      helperText={form.errors.uuid_path && form.touched.uuid_path ? form.errors.uuid_path : null}
                    />
                  )}
                </Field>
                <FieldArray name="fields">
                  {({ push, remove, form }) => (
                    <>
                      {form.values.fields.map((field, index) => (
                        <Stack key={index} direction="row" spacing={2}>
                          <Field
                            name={`fields[${index}].remote_field`}
                            as={TextField}
                            label="Имя поля"
                            fullWidth
                            variant="outlined"
                          />

                          <FormControl fullWidth>
                            <InputLabel id={`createLeadField-${index}`}>Поле нашей Срм</InputLabel>
                            <Field
                              name={`fields[${index}].local_field`}
                              as={Select}
                              labelId={`createLeadField-${index}`}
                              label="Поле нашей Срм"
                            >
                              {leadFields.map((lead, fieldIndex) => (
                                <MenuItem key={fieldIndex} value={lead}>
                                  {lead}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>

                          <FormControl fullWidth>
                            <InputLabel id={`createLeadType-${index}`}>Тип</InputLabel>
                            <Field
                              name={`fields[${index}].field_type`}
                              as={Select}
                              labelId={`createLeadType-${index}`}
                              label="Тип"
                            >
                              <MenuItem value={'string'}>STRING</MenuItem>
                              <MenuItem value={'int'}>INT</MenuItem>
                              <MenuItem value={'float'}>FLOAT</MenuItem>
                            </Field>
                          </FormControl>

                          <Field
                            name={`fields[${index}].another_value`}
                            as={TextField}
                            label="Другое значение"
                            variant="outlined"
                            fullWidth
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={field.is_required}
                                onChange={(e) => form.setFieldValue(`fields[${index}].is_required`, e.target.checked)}
                              />
                            }
                            label="Обязательное поле"
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
                            local_field: '',
                            remote_field: '',
                            field_type: '',
                            another_value: '',
                            is_required: true,
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

export default EditCrmCreatePage;
