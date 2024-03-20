import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Stack,
  Container,
  Typography,
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Switch,
  FormHelperText,
  Button,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import api from '../api/api';
import useFetch from '../hooks/useFetch';

const EditCrmSettingPage = () => {
  const [initialValues, setInitialValues] = useState({
    working_hours_start: '',
    working_hours_end: '',
    working_days: [],
    daily_cap: 0,
    is_active: false,
    skip_after_workings: false,
    generate_email_if_missing: false,
  });
  const [currentSettingsId, setCurrentSettingsId] = useState(0);
  const [crmName, setCrmName] = useState('');
  const { crmId } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data, refetch } = useFetch(`api/crms/settings/${crmId}`, 'get');

  useEffect(() => {
    if (data) {
      setCrmName(data.crmName);
      if(data.isRelation){
        setCurrentSettingsId(data.id);
        setInitialValues({
          working_hours_start: data.working_hours_start,
          working_hours_end: data.working_hours_end,
          working_days: data.working_days,
          daily_cap: data.daily_cap,
          is_active: data.is_active,
          skip_after_workings: data.skip_after_workings,
          generate_email_if_missing: data.generate_email_if_missing,
        });
      }
      
    }
  }, [data]);

  const updateCrm = async (values) => {
    try {
      await api.put(`api/crms/settings/${currentSettingsId}`, values);
      navigate('/dashboard/crms');
      return null;
    } catch (error) {
      return error.response.data.errors;
    }
  };

  const validationSchema = Yup.object().shape({
    working_hours_start: Yup.string().required('Время начала обязательно'),
    working_hours_end: Yup.string().required('Время конца обязательно'),
    daily_cap: Yup.number()
      .required('Укажите капу в день')
      .positive('Капа должна быть положительным числом')
      .integer('Капа должна быть целым числом'),
    is_active: Yup.boolean(),
    working_days: Yup.array().min(1, 'Выберите хотя бы один рабочий день'),
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
        <title>Настройки Срм</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Настройки {crmName}
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
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <Stack spacing={3}>
                <Field name="working_hours_start">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      placeholder="Время начала"
                      label="Время начала"
                      type="time"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      error={Boolean(form.errors.working_hours_start && form.touched.working_hours_start)}
                      helperText={
                        form.errors.working_hours_start && form.touched.working_hours_start
                          ? form.errors.working_hours_start
                          : null
                      }
                    />
                  )}
                </Field>
                <Field name="working_hours_end">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      label="Время конца"
                      variant="outlined"
                      type="time"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={Boolean(form.errors.working_hours_end && form.touched.working_hours_end)}
                      helperText={
                        form.errors.working_hours_end && form.touched.working_hours_end
                          ? form.errors.working_hours_end
                          : null
                      }
                    />
                  )}
                </Field>
                <Field name="daily_cap">
                  {({ field, form }) => (
                    <TextField
                      {...field}
                      label="Капа в день"
                      variant="outlined"
                      fullWidth
                      type="number"
                      error={Boolean(form.errors.daily_cap && form.touched.daily_cap)}
                      helperText={form.errors.daily_cap && form.touched.daily_cap ? form.errors.daily_cap : null}
                    />
                  )}
                </Field>
                <Field name="working_days">
                  {({ field, form }) => (
                    <Stack direction={'row'} spacing={1}>
                      {['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'].map(
                        (day, index) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                checked={field.value.includes(index)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    form.setFieldValue('working_days', [...field.value, index]);
                                  } else {
                                    form.setFieldValue(
                                      'working_days',
                                      field.value.filter((d) => d !== index)
                                    );
                                  }
                                }}
                              />
                            }
                            label={day}
                          />
                        )
                      )}
                    </Stack>
                  )}
                </Field>
                <ErrorMessage name="working_days">{(msg) => <FormHelperText error>{msg}</FormHelperText>}</ErrorMessage>
                <FormControlLabel
                  control={
                    <Switch checked={values.is_active} onChange={(e) => setFieldValue('is_active', e.target.checked)} />
                  }
                  label="Активно"
                />
                <FormControlLabel
                  control={
                    <Switch checked={values.skip_after_workings} onChange={(e) => setFieldValue('skip_after_workings', e.target.checked)} />
                  }
                  label="Пропускать вне рабочего время или дубль?"
                />
                <FormControlLabel
                  control={
                    <Switch checked={values.generate_email_if_missing} onChange={(e) => setFieldValue('generate_email_if_missing', e.target.checked)} />
                  }
                  label="Генерировать пустую почту?"
                />
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

export default EditCrmSettingPage;
