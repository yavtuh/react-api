import { useState } from 'react';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
// axios
import useAuthContext from '../../../contexts/AuthContext';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Formik
        initialValues={{ email: '',  password: ''}}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Обязательно';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Неверный email';
          }
          if (!values.password) {
            errors.password = 'Обязательно';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          setTimeout(async () => {
            
            const error = await  login({
              email: values.email,
              password: values.password,
            });
            if (error) {
              setErrors({ email: error, password: error });
            }
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={3}>
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
              <Field name="password">
                {({ field, form }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(form.errors.password && form.touched.password)}
                    helperText={form.errors.password && form.touched.password ? form.errors.password : null}
                  />
                )}
              </Field>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
              <Checkbox name="remember" label="Remember me" />
              <Link variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" disabled={isSubmitting}>
              Войти
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </>
  );
}
