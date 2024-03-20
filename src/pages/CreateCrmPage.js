import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, Container, Typography, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
// sections
import api from '../api/api';

const CreateCrmPage = () => {
  const navigate = useNavigate();
  const initialValues = {
    name: '',
    description: '',
  };


  const createCrm = async (values) => {
    try {
      await api.post('/api/crms', values);
      navigate('/dashboard/crms');
      return null;
    } catch (error) {
      return error.response.data.errors;
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Название обязательно'),
    description: Yup.string().required('Описание'),
  });

  
  return (
    <>
      <Helmet>
        <title>Создать CRM</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Создать CRM
          </Typography>
        </Stack>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            const errors = await createCrm(values);
            if (errors) {
              if (errors.password) {
                errors.password_confirmation = errors.password;
              }
              setErrors(errors);
            }
            setSubmitting(false);
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

export default CreateCrmPage;
