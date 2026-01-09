'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  SelectChangeEvent
} from '@mui/material';
import {
  Info,
  Security,
  AdminPanelSettings,
  BugReport
} from '@mui/icons-material';
import { getLiffEnvironment } from '@/lib/liff';
import { useAppSelector } from '@/lib/store';
import { permissions, profile } from '@/service/user.service';
import { company, createCompany, switchCompany } from '@/service/company.service';
import { useTranslations } from 'next-intl';

export default function DemoFeatures() {
  const t = useTranslations('HomePage');

  const { user } = useAppSelector((state) => state.auth);
  const [services, setServices] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<string>(user.company || '');

  const initialFormData  = {
    name: '',
    address: '',
    telephone: '',
    website: '',
    email: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    description: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
  setFormData(initialFormData);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompany(formData);
      await getUserCompany();
      await getServicePermissions();
      const currentProfile = await profile();
      setCurrentCompany(currentProfile.data.company);
      resetForm();
      setShowLogoutDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const liffEnv = getLiffEnvironment();
  
    const getServicePermissions = async () => {
      try {
        const services = await permissions();
        setServices(services.data);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };
  const getUserCompany = async () => {
    try {
      const companyUser = await company();
      const currentProfile = await profile();
      setCompanies(companyUser.data);
      if ( user.company !== null ) {
        setCurrentCompany(currentProfile.data.company);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    if (user && user.uuid) {
      getUserCompany();
      if ( user.company !== null ) {
        getServicePermissions();
      }
    }
  }, [user]);

  const handleCompanyChange = async (
    event: SelectChangeEvent<string>
  ) => {
    const selectedCompanyUuid = event.target.value;
    setCurrentCompany(selectedCompanyUuid);
    await switchCompany(selectedCompanyUuid);
    await getUserCompany();
    await getServicePermissions();
  };


  const routeService = (serviceName: string) => {
    let pathTo = '';
    if (serviceName.toLowerCase().includes('admin')) {
      pathTo = '/admin';
    } else if (serviceName.toLowerCase().includes('ticket')) {
      pathTo = '/ticket';
    }
    window.location.href = pathTo;
  }

  const handleCompany = async (openDialog?: boolean) => {
    try {
      if (openDialog) {
        setShowLogoutDialog(true);
        return;
      }
      setShowLogoutDialog(false);
    } catch (error) {
      console.error('Create company failed:', error);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box display={'grid'} mb={2} sx={{
        gridTemplateColumns: { xs: '1fr', md: 'repeat(1, 1fr)' },
      }}>
        <Card sx={{
          height: '100%',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
          transition: 'all 0.3s ease',
        }}>
          <CardContent>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                {t('environment.selectCompany')} ({companies.length} {t('environment.available')})
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }} style={{ display: 'flex', justifyContent: 'end' }}>
              {companies.length > 0 ? (
                <Button
                  variant="contained"
                  onClick={() => handleCompany(true)}
                  disabled={false}
                  sx={{ mt: 2, mb: 2,  }}
                >
                  {t('company.createCompany')}
                </Button>
              ) : 
              <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleCompany(true)}
                  disabled={false}
                  sx={{ mt: 2, mb: 2 }}
                >
                  {t('company.createCompany')}
                </Button>
              }
            </Grid>
            <Grid size={{ xs: 12 }}>
              {companies.length > 0 ? (
                <Select
                  onChange={handleCompanyChange}
                  fullWidth
                  value={currentCompany}
                  disabled={companies.length === 1}
                >
                  {companies.map((comp: any) => (
                    <MenuItem key={comp.uuid} value={comp.uuid}>{comp.name}</MenuItem>
                  ))}
                </Select>
              ) : null}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: services.length === 0 ? '1fr' : 'repeat(2, 1fr)' },
        gap: 2,
        mb: 3,
      }}>

        {services.map((item, index) => (
          <Card key={index} sx={{
            height: '100%',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4,
            },
            transition: 'all 0.3s ease',
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {item.name.includes('Admin') ? <AdminPanelSettings sx={{ fontSize: 40 }} color={'info'} /> : <BugReport sx={{ fontSize: 40 }} color={'warning'} />}
              </Box>
              <Typography variant="h6" gutterBottom>
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {item.description}
              </Typography>

              <Button size={'small'} variant="contained" onClick={() => routeService(item.name)}>
                Access {item.name}
              </Button>
            </CardContent>
          </Card>
        ))}
        {
          services.length === 0 && (
            <Card sx={{
              height: '100%',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
              transition: 'all 0.3s ease',
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {t('company.noCompany')}
                </Typography>
              </CardContent>
            </Card>
          )
        }
      </Box>

      <Typography variant="h5" gutterBottom>
        LIFF Version
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
            {t('environment.lineEnvironment')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Chip
              label={liffEnv.isInClient ? 'In LINE App' : 'Web Browser'}
              color={liffEnv.isInClient ? 'success' : 'default'}
              size="small"
            />
            <Chip
              label={liffEnv.isLoggedIn ? 'Line logged In' : 'Base authen login'}
              color={liffEnv.isLoggedIn ? 'success' : 'secondary'}
              size="small"
            />
            <Chip
              label={`Lang: ${liffEnv.language}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`LIFF: ${liffEnv.version}`}
              size="small"
              variant="outlined"
            />
            {liffEnv.lineVersion && (
              <Chip
                label={`LINE: ${liffEnv.lineVersion}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color='text.secondary'>
          <Security sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
          <strong>{t('note.noteTitle')}:</strong> {t('note.noteContent')}
        </Typography>
      </Box>
      <Dialog
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {t('company.titleCompany')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent style={{ marginTop: "20px" }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.companyName')} variant="outlined" fullWidth size='small'
                  name="name" value={formData.name} onChange={handleChange} required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.address')} variant="outlined" fullWidth size='small' 
                  name="address" value={formData.address} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.email')} variant="outlined" fullWidth size='small' 
                  name="email" value={formData.email} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.phone')} variant="outlined" fullWidth size='small' 
                  name="telephone" value={formData.telephone} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.website')} variant="outlined" fullWidth size='small' 
                  name="website" value={formData.website} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.city')} variant="outlined" fullWidth size='small' 
                  name="city" value={formData.city} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.state')} variant="outlined" fullWidth size='small' 
                  name="state" value={formData.state} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.postalCode')} variant="outlined" fullWidth size='small' 
                  name="postalCode" value={formData.postalCode} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.country')} variant="outlined" fullWidth size='small' 
                  name="country" value={formData.country} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ padding: "10px" }}>
                <TextField id="outlined-basic" label={t('company.description')} variant="outlined" fullWidth size='small' 
                  name="description" value={formData.description} onChange={handleChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
            >
              {t('signOut.confirm')}
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setShowLogoutDialog(false)
              }}
            >
              {t('signOut.cancel')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
