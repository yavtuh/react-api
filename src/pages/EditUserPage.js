
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Stack, Container, Typography, TextField, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { LoadingButton } from '@mui/lab';
// components
// sections
import api from '../api/api';
import useFetch from '../hooks/useFetch';

// ----------------------------------------------------------------------

export default function EditUserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    key: '',
    password: '',
    password_confirmation: '',
  });
  
  const { isLoading, error, data } = useFetch(`api/users/${userId}`, 'get');

  useEffect(() => {
    if (data) {
      setInitialValues({
        name: data.name,
        email: data.email,
        key: data.key,
        password: '',
        password_confirmation: '',
      })
    }
  }, [data]);

  const updateUser = async (values) => {
    try {
      await api.put(`api/users/${userId}`, values);
      navigate('/dashboard/users');
      return null;
    } catch (error) {
      return error.response.data.errors;
    }
  }

  const getChangedValues = (initialValues, currentValues) => {
    return Object.keys(initialValues).reduce((acc, key) => {
      if (initialValues[key] !== currentValues[key]) {
        acc[key] = currentValues[key];
      }
      return acc;
    }, {});
  };

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
        <title>Редактировать Пользователя</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Редактировать Пользователя
          </Typography>
        </Stack>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Обязательно';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
              errors.email = 'Неверный email';
            }
            if (!values.key) {
              errors.key = 'Обязательно';
            }
            if (!values.name) {
              errors.name = 'Обязательно';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            setTimeout(async () => {
              const changedValues = getChangedValues(initialValues, values);
              const errors  = await updateUser(changedValues);
              if (errors) {
                if (errors.password) {
                  errors.password_confirmation = errors.password;
                }
                setErrors(errors);
              }
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
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
                <Field name="email">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      type="email"
                      placeholder="Email"
                      error={Boolean(form.errors.email && form.touched.email)}
                      helperText={form.errors.email && form.touched.email ? form.errors.email : null}
                    />
                  )}
                </Field>
                <Field name="key">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      type="text"
                      placeholder="Ключ"
                      error={Boolean(form.errors.key && form.touched.key)}
                      helperText={form.errors.key && form.touched.key ? form.errors.key : null}
                    />
                  )}
                </Field>
                <Field name="password">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      type="text"
                      placeholder="Новый Пароль (Необязательно)"
                      error={Boolean(form.errors.password && form.touched.password)}
                      helperText={form.errors.password && form.touched.password ? form.errors.password : null}
                    />
                  )}
                </Field>
                <Field name="password_confirmation">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      type="text"
                      placeholder="Подтвердите Пароль"
                      error={Boolean(form.errors.password_confirmation && form.touched.password_confirmation)}
                      helperText={
                        form.errors.password_confirmation && form.touched.password_confirmation
                          ? form.errors.password_confirmation
                          : null
                      }
                    />
                  )}
                </Field>
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
}
