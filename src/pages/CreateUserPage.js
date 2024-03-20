import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
// @mui
import { InputAdornment,
  Stack,
  Container,
  Typography,
  IconButton,
  TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { LoadingButton } from '@mui/lab';
// sections
import api from '../api/api';


// ----------------------------------------------------------------------

export default function CreateUserPage() {

  const navigate = useNavigate();
  const createUser = async (values) => {
    try {
      await api.post('/api/users', values);
      navigate('/dashboard/users');
      return null;
    } catch (error) {
      return error.response.data.errors;
    }
  }

  return (
    <>
      <Helmet>
        <title>Создать Пользователя</title>
      </Helmet>

      <Container >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Создать Пользователя
          </Typography>
        </Stack>

        <Formik
        initialValues={{ name:'', email: '', key: '',  password: '', password_confirmation: ''}}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Обязательно';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Неверный email';
          }
          if (!values.key) {
            errors.key = 'Обязательно';
          }
          if (!values.name) {
            errors.name = 'Обязательно';
          }
          if (!values.password) {
            errors.password = 'Обязательно';
          }if (!values.password_confirmation) {
            errors.password_confirmation = 'Обязательно';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          setTimeout(async () => {
            const errors  = await createUser(values);
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
            <Field name="name" >
                {({field, form}) => (
                  <TextField 
                    {...field}
                    type="text"
                    placeholder="Имя"
                    error={Boolean(form.errors.name && form.touched.name)}
                    helperText={form.errors.name && form.touched.name ? form.errors.name : null}
                  />
                )}
              </Field>
              <Field name="email" >
                {({field, form}) => (
                  <TextField 
                    {...field}
                    type="email"
                    placeholder="Email"
                    error={Boolean(form.errors.email && form.touched.email)}
                    helperText={form.errors.email && form.touched.email ? form.errors.email : null}
                  />
                )}
              </Field>
              <Field name="key" >
                {({field, form}) => (
                  <TextField 
                    {...field}
                    type="text"
                    placeholder="Ключ"
                    error={Boolean(form.errors.key && form.touched.key)}
                    helperText={form.errors.key && form.touched.key ? form.errors.key : null}
                  />
                )}
              </Field>
              <Field name="password" >
                {({field, form}) => (
                  <TextField 
                    {...field}
                    type="text"
                    placeholder="Пароль"
                    error={Boolean(form.errors.password && form.touched.password)}
                    helperText={form.errors.password && form.touched.password ? form.errors.password : null}
                  />
                )}
              </Field>
              <Field name="password_confirmation" >
                {({field, form}) => (
                  <TextField 
                    {...field}
                    type="text"
                    placeholder="Подтвердите Пароль"
                    error={Boolean(form.errors.password_confirmation && form.touched.password_confirmation)}
                    helperText={form.errors.password_confirmation && form.touched.password_confirmation ? form.errors.password_confirmation : null}
                  />
                )}
              </Field>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{ my: 2 }} disabled={isSubmitting}>
              Создать
            </LoadingButton>
          </Form>
        )}
      </Formik>
      
      </Container>
    </>
  );
}
