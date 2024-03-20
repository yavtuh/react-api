import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, Container, Typography, TextField, CircularProgress } from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
// sections
import api from '../api/api';
import useFetch from '../hooks/useFetch';

const CreateFunnelPage = () => {
  const navigate = useNavigate();
  const [crmsName, setCrmsName] = useState([]);
  const { isLoading, error, data } = useFetch(`api/getNameCrms`, 'get');
  const initialValues = {
    name: '',
    description: '',
    settings: crmsName.map((crm) => ({ crm_id: crm.id, score: 0 })),
  };

  useEffect(() => {
    if (data) {
      setCrmsName(data.data);
      console.log(crmsName);
    }
  }, [data]);

  const createFunnel = async (values) => {
    try {
      await api.post('/api/funnels', values);
      navigate('/dashboard/funnels');
      return null;
    } catch (error) {
      return error.response.data.errors;
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Название обязательно'),
    description: Yup.string(),
    settings: Yup.array(),
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
          {error}
        </Stack>
      </Container>
    );
  }
  return (
    <>
      <Helmet>
        <title>Создать Воронку</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Создать Воронку
          </Typography>
        </Stack>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            const errors = await createFunnel(values);
            if (errors) {
              if (errors.password) {
                errors.password_confirmation = errors.password;
              }
              setErrors(errors);
            }
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <Stack spacing={3}>
                <Field name="name">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      type="text"
                      placeholder="Имя"
                      error={Boolean(form.errors.name && form.touched.name)}
                      helperText={form.errors.name && form.touched.name ? form.errors.name : null}
                    />
                  )}
                </Field>
                <Field name="description">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      type="text"
                      placeholder="Описание"
                      error={Boolean(form.errors.description && form.touched.description)}
                      helperText={form.errors.description && form.touched.description ? form.errors.description : null}
                    />
                  )}
                </Field>
                <FieldArray name="settings">
                  {({form}) => (
                    <>
                      {values.settings.length > 0 &&
                        values.settings.map((setting, index) => (
                          <div key={index}>
                            <Typography variant="h6">{crmsName[index].name}</Typography>
                            <TextField
                              name={`settings.${index}.score`}
                              type="number"
                              fullWidth
                              value={setting.score}
                              onChange={(e) => form.setFieldValue(`settings.${index}.score`, e.target.value)}
                              error={Boolean(
                                form.errors.settings && form.errors.settings[index] && form.errors.settings[index].score
                              )}
                              helperText={
                                form.errors.settings && form.errors.settings[index] && form.errors.settings[index].score
                              }
                            />
                            <Field name={`settings.${index}.crm_id`} type="hidden" />
                          </div>
                        ))}
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
                Создать
              </LoadingButton>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default CreateFunnelPage;
