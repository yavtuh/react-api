import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  FormControlLabel,
  InputLabel,
  Stack,
  Select,
  FormControl,
  Button,
  Checkbox,
  MenuItem,
  Container,
  Typography,
  TextField,
  Switch,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import api from '../api/api';

// ----------------------------------------------------------------------

export default function CreateCrmPage() {
  const [crm, setCrm] = useState({ name: '', description: '' });
  const [fields, setFields] = useState([{ remote_field: '', local_field: '', field_type: '', another_value: '' }]);
  const [showDynamicFields, setShowDynamicFields] = useState(false);
  const [headers, setHeaders] = useState([{ header_name: '', header_value: '' }]);
  const [showDynamicHeaders, setShowDynamicHeaders] = useState(false);
  const [headerAuth, setHeaderAuth] = useState({ base_url: '', token_path: '', auth_type: '', method: '' });
  const [showDynamicHeaderAuth, setShowDynamicHeaderAuth] = useState(false);
  const [headerAuthFields, setHeaderAuthFields] = useState([{ header_name: '', header_value: '', header_type: '' }]);
  const [showHeaderAuthFields, setShowHeaderAuthFields] = useState(false);
  const [settings, setSettings] = useState({
    working_hours_start: '',
    working_hours_end: '',
    working_days: [],
    daily_cap: '',
  });
  const [showSettingsCrm, setShowSettingsCrm] = useState(false);
  const [createLeads, setCreateLeads] = useState({ base_url: '', method: '' });
  const [showCreateLeads, setShowCreateLeads] = useState(false);
  const [statusLeads, setStatusLeads] = useState({ base_url: '', method: '' });
  const [showStatusLeads, setShowStatusLeads] = useState(false);
  const [fieldsStatusLeads, setFieldsStatusLeads] = useState([
    { remote_field: '', local_field: '', field_type: '', another_value: '' },
  ]);
  const [showFieldsStatusLeads, setShowFieldsStatusLeads] = useState(false);
  const [responseLeads, setResponseLeads] = useState([
    { response_type: '', response_path: '', expected_type: 'string', expected_value: '', is_empty: false },
  ]);
  const [showResponseLeads, setShowResponseLeads] = useState(false);

  const [leadFields, setLeadFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeadFields = async () => {
      try {
        const response = await api.get('/api/getLeadFields');
        setLeadFields(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLeadFields();
  }, []);

  const handleAddField = () => {
    setFields([...fields, { name: '', description: '' }]);
  };

  const handleAddResponseField = () => {
    setResponseLeads([
      ...responseLeads,
      { response_type: '', response_path: '', expected_type: 'string', expected_value: '', is_empty: false },
    ]);
  };

  const handleCheckFieldsResponse = (index, event) => {
    const values = [...responseLeads];
    values[index][event.target.name] = event.target.value;
    setResponseLeads(values);
  };

  const handleCheckCheckedResponse = (index, event) => {
    const values = [...responseLeads];
    values[index].is_empty = event.target.checked;
    setResponseLeads(values);
  };

  const handleAddStatusField = () => {
    setFieldsStatusLeads([...fieldsStatusLeads, { name: '', description: '' }]);
  };

  const handleCheckStatusFieldsChange = (index, event) => {
    const values = [...fieldsStatusLeads];
    values[index][event.target.name] = event.target.value;
    setFieldsStatusLeads(values);
  };

  const handleCheckAuthFieldsChange = (index, event) => {
    const values = [...headerAuthFields];
    values[index][event.target.name] = event.target.value;
    setHeaderAuthFields(values);
  };

  const handleAddAuthField = () => {
    setHeaderAuthFields([...headerAuthFields, { header_name: '', header_value: '', header_type: '' }]);
  };

  const handleCheckFieldsChange = (index, event) => {
    const values = [...fields];
    values[index][event.target.name] = event.target.value;
    setFields(values);
  };
  const handleAddHeader = () => {
    setHeaders([...headers, { header_name: '', header_value: '' }]);
  };

  const handleCheckHeadersChange = (index, event) => {
    const values = [...headers];
    values[index][event.target.name] = event.target.value;
    setHeaders(values);
  };

  const handleWorkingDaysChange = (event) => {
    const dayNumber = parseInt(event.target.name, 10);
    const isChecked = event.target.checked;
    setSettings((prevSettings) => {
      const newWorkingDays = isChecked
        ? [...prevSettings.working_days, dayNumber]
        : prevSettings.working_days.filter((day) => day !== dayNumber);
      return { ...prevSettings, working_days: newWorkingDays };
    });
  };

  const handleSubmit = async () => {
    const values = {
      crm,
      fields: showDynamicFields ? fields : null,
      headers: showDynamicHeaders ? headers : null,
      headerAuth: showDynamicHeaderAuth ? headerAuth : null,
      headerAuthFields: showHeaderAuthFields ? headerAuthFields : null,
      settings: showSettingsCrm ? settings : null,
      createLeads: showCreateLeads ? createLeads : null,
      statusLeads: showStatusLeads ? statusLeads : null,
      fieldsStatusLeads: showFieldsStatusLeads ? fieldsStatusLeads : null,
      responseLeads: showResponseLeads ? responseLeads : null,
    };
    setIsSubmitting(true);
    try {
      await api.post('/api/crms', values);
      setIsSubmitting(false);
      navigate('/dashboard/crms');
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Создать CRM</title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Создать CRM
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <TextField
            label="Имя"
            fullWidth
            variant="outlined"
            onChange={(event) => setCrm({ ...crm, name: event.target.value })}
          />
          <TextField
            label="Описание"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            onChange={(event) => setCrm({ ...crm, description: event.target.value })}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={showSettingsCrm}
                onChange={(e) => setShowSettingsCrm(e.target.checked)}
                color="primary"
              />
            }
            label="Добавить настройки"
          />

          {showSettingsCrm && (
            <>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Время начала"
                  name="working_hours_start"
                  type="time"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  value={settings.working_hours_start}
                  onChange={(event) => setSettings({ ...settings, working_hours_start: event.target.value })}
                />
                <TextField
                  label="Время конца"
                  name="working_hours_end"
                  variant="outlined"
                  value={settings.working_hours_end}
                  onChange={(event) => setSettings({ ...settings, working_hours_end: event.target.value })}
                  type="time"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Капа в день"
                  name="daily_cap"
                  variant="outlined"
                  value={settings.daily_cap}
                  onChange={(event) => setSettings({ ...settings, daily_cap: event.target.value })}
                  fullWidth
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox checked={settings.working_days.includes(0)} onChange={handleWorkingDaysChange} name="0" />
                  }
                  label="Воскресенье"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={settings.working_days.includes(1)} onChange={handleWorkingDaysChange} name="1" />
                  }
                  label="Понедельник"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={settings.working_days.includes(2)} onChange={handleWorkingDaysChange} name="2" />
                  }
                  label="Вторник"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={settings.working_days.includes(3)} onChange={handleWorkingDaysChange} name="3" />
                  }
                  label="Среда"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={settings.working_days.includes(4)} onChange={handleWorkingDaysChange} name="4" />
                  }
                  label="Четверг"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={settings.working_days.includes(5)} onChange={handleWorkingDaysChange} name="5" />
                  }
                  label="Пятница"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={settings.working_days.includes(6)} onChange={handleWorkingDaysChange} name="6" />
                  }
                  label="Субота"
                />
              </Stack>
            </>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={showCreateLeads}
                onChange={(e) => setShowCreateLeads(e.target.checked)}
                color="primary"
              />
            }
            label="Создание Лида"
          />

          {showCreateLeads && (
            <>
              <TextField
                label="URL"
                fullWidth
                variant="outlined"
                onChange={(event) => setCreateLeads({ ...createLeads, base_url: event.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Метод</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={createLeads.method}
                  label="Выбор"
                  onChange={(event) => setCreateLeads({ ...createLeads, method: event.target.value })}
                >
                  <MenuItem value={'GET'}>GET</MenuItem>
                  <MenuItem value={'POST'}>POST</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showDynamicFields}
                    onChange={(e) => setShowDynamicFields(e.target.checked)}
                    color="primary"
                  />
                }
                label="Добавить поле"
              />
              {showDynamicFields && (
                <>
                  {fields.map((field, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <TextField
                        label="Имя поля"
                        name="remote_field"
                        fullWidth
                        variant="outlined"
                        value={field.remote_field || ''}
                        onChange={(event) => handleCheckFieldsChange(index, event)}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="createLeadField">Поле нашей Срм</InputLabel>
                        <Select
                          labelId="createLeadField"
                          value={field.local_field || ''}
                          name="local_field"
                          label="Поле нашей Срм"
                          onChange={(event) => handleCheckFieldsChange(index, event)}
                        >
                          {leadFields.map((lead, index) => (
                            <MenuItem key={index} value={lead}>
                              {lead}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="createLeadType">Тип</InputLabel>
                        <Select
                          labelId="createLeadType"
                          value={field.field_type || ''}
                          name="field_type"
                          label="Тип"
                          onChange={(event) => handleCheckFieldsChange(index, event)}
                        >
                          <MenuItem value={'string'}>STRING</MenuItem>
                          <MenuItem value={'int'}>INT</MenuItem>
                          <MenuItem value={'float'}>FLOAT</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Другое значение"
                        name="another_value"
                        variant="outlined"
                        fullWidth
                        value={field.another_value || ''}
                        onChange={(event) => handleCheckFieldsChange(index, event)}
                      />
                    </Stack>
                  ))}

                  <Button startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddField}>
                    Добавить поле
                  </Button>
                </>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showResponseLeads}
                    onChange={(e) => setShowResponseLeads(e.target.checked)}
                    color="primary"
                  />
                }
                label="Ответ на создание"
              />

              {showResponseLeads && (
                <>
                  {responseLeads.map((field, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <TextField
                        label="Тип ответа"
                        name="response_type"
                        fullWidth
                        variant="outlined"
                        value={field.response_type || ''}
                        onChange={(event) => handleCheckFieldsResponse(index, event)}
                      />
                      <TextField
                        label="Путь к значению"
                        name="response_path"
                        fullWidth
                        variant="outlined"
                        value={field.response_path || ''}
                        onChange={(event) => handleCheckFieldsResponse(index, event)}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Тип значения</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={field.expected_type || ''}
                          name="expected_type"
                          label="Выбор"
                          onChange={(event) => handleCheckFieldsResponse(index, event)}
                        >
                          <MenuItem value={'string'}>string</MenuItem>
                          <MenuItem value={'int'}>int</MenuItem>
                          <MenuItem value={'float'}>float</MenuItem>
                          <MenuItem value={'bool'}>bool</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Ожидаемое значение"
                        name="expected_value"
                        fullWidth
                        variant="outlined"
                        value={field.expected_value || ''}
                        onChange={(event) => handleCheckFieldsResponse(index, event)}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.is_empty || false}
                            onChange={(event) => handleCheckCheckedResponse(index, event)}
                          />
                        }
                        label="Пустой Ответ?"
                      />
                    </Stack>
                  ))}

                  <Button startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddResponseField}>
                    Добавить поле
                  </Button>
                </>
              )}
            </>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={showStatusLeads}
                onChange={(e) => setShowStatusLeads(e.target.checked)}
                color="primary"
              />
            }
            label="Статус Лида"
          />

          {showStatusLeads && (
            <>
              <TextField
                label="URL"
                fullWidth
                variant="outlined"
                onChange={(event) => setStatusLeads({ ...statusLeads, base_url: event.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Метод</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={statusLeads.method}
                  label="Выбор"
                  onChange={(event) => setStatusLeads({ ...statusLeads, method: event.target.value })}
                >
                  <MenuItem value={'GET'}>GET</MenuItem>
                  <MenuItem value={'POST'}>POST</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showFieldsStatusLeads}
                    onChange={(e) => setShowFieldsStatusLeads(e.target.checked)}
                    color="primary"
                  />
                }
                label="Добавить поле"
              />
              {showFieldsStatusLeads && (
                <>
                  {fieldsStatusLeads.map((field, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <TextField
                        label="Имя поля"
                        name="remote_field"
                        fullWidth
                        variant="outlined"
                        value={field.remote_field || ''}
                        onChange={(event) => handleCheckStatusFieldsChange(index, event)}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="createLeadField">Поле нашей Срм</InputLabel>
                        <Select
                          labelId="createLeadField"
                          value={field.local_field || ''}
                          name="local_field"
                          label="Поле нашей Срм"
                          onChange={(event) => handleCheckStatusFieldsChange(index, event)}
                        >
                          {leadFields.map((lead, index) => (
                            <MenuItem key={index} value={lead}>
                              {lead}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="createLeadType">Тип</InputLabel>
                        <Select
                          labelId="createLeadType"
                          value={field.field_type || ''}
                          name="field_type"
                          label="Тип"
                          onChange={(event) => handleCheckStatusFieldsChange(index, event)}
                        >
                          <MenuItem value={'string'}>STRING</MenuItem>
                          <MenuItem value={'int'}>INT</MenuItem>
                          <MenuItem value={'float'}>FLOAT</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Другое значение"
                        name="another_value"
                        variant="outlined"
                        fullWidth
                        value={field.another_value || ''}
                        onChange={(event) => handleCheckStatusFieldsChange(index, event)}
                      />
                    </Stack>
                  ))}

                  <Button startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddStatusField}>
                    Добавить поле
                  </Button>
                </>
              )}
            </>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={showDynamicHeaders}
                onChange={(e) => setShowDynamicHeaders(e.target.checked)}
                color="primary"
              />
            }
            label="Добавить заголовки"
          />

          {showDynamicHeaders && (
            <>
              {headers.map((header, index) => (
                <Stack direction="row" spacing={2} key={index}>
                  <TextField
                    label="Имя заголовка"
                    name="header_name"
                    variant="outlined"
                    value={header.header_name || ''}
                    onChange={(event) => handleCheckHeadersChange(index, event)}
                  />
                  <TextField
                    label="Описание поля"
                    name="header_value"
                    variant="outlined"
                    value={header.header_value || ''}
                    onChange={(event) => handleCheckHeadersChange(index, event)}
                  />
                </Stack>
              ))}

              <Button startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddHeader}>
                Добавить поле
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showDynamicHeaderAuth}
                    onChange={(e) => setShowDynamicHeaderAuth(e.target.checked)}
                    color="primary"
                  />
                }
                label="Добавить заголовки Авторизации"
              />

              {showDynamicHeaderAuth && (
                <>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="URL"
                      name="base_url"
                      fullWidth
                      variant="outlined"
                      value={headerAuth.base_url}
                      onChange={(event) => setHeaderAuth({ ...headerAuth, base_url: event.target.value })}
                    />
                    <TextField
                      label="Путь к токену(через точку)"
                      name="login"
                      fullWidth
                      variant="outlined"
                      value={headerAuth.token_path}
                      onChange={(event) => setHeaderAuth({ ...headerAuth, token_path: event.target.value })}
                    />
                    <TextField
                      label="Тип(Bear, Basic)"
                      name="password"
                      fullWidth
                      variant="outlined"
                      value={headerAuth.auth_type}
                      onChange={(event) => setHeaderAuth({ ...headerAuth, auth_type: event.target.value })}
                    />
                    <FormControl fullWidth>
                      <InputLabel id="hraderMethod">Метод</InputLabel>
                      <Select
                        labelId="hraderMethod"
                        id="hraderMethod"
                        value={headerAuth.method}
                        label="Выбор"
                        onChange={(event) => setHeaderAuth({ ...headerAuth, method: event.target.value })}
                      >
                        <MenuItem value={'GET'}>GET</MenuItem>
                        <MenuItem value={'POST'}>POST</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showHeaderAuthFields}
                        onChange={(e) => setShowHeaderAuthFields(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Добавить поля Авторизации"
                  />
                  {showHeaderAuthFields && (
                    <>
                      {headerAuthFields.map((field, index) => (
                        <Stack direction="row" spacing={2} key={index}>
                          <TextField
                            label="Имя заголовка"
                            name="header_name"
                            fullWidth
                            variant="outlined"
                            value={field.header_name || ''}
                            onChange={(event) => handleCheckAuthFieldsChange(index, event)}
                          />
                          <TextField
                            label="Значение заголовка"
                            name="header_value"
                            fullWidth
                            variant="outlined"
                            value={field.header_value || ''}
                            onChange={(event) => handleCheckAuthFieldsChange(index, event)}
                          />
                          <FormControl fullWidth>
                            <InputLabel id="headerAuthType">Тип</InputLabel>
                            <Select
                              labelId="headerAuthType"
                              value={field.header_type || ''}
                              name="header_type"
                              label="Тип"
                              onChange={(event) => handleCheckAuthFieldsChange(index, event)}
                            >
                              <MenuItem value={'string'}>STRING</MenuItem>
                              <MenuItem value={'int'}>INT</MenuItem>
                              <MenuItem value={'float'}>FLOAT</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      ))}

                      <Button startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddAuthField}>
                        Добавить поле
                      </Button>
                    </>
                  )}
                </>
              )}
            </>
          )}
          <Button variant="contained" disabled={isSubmitting} onClick={handleSubmit}>
            Создать Срм
          </Button>
        </Stack>
      </Container>
    </>
  );
}
