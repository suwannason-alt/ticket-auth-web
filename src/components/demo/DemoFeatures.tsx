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
} from '@mui/material';
import {
  Info,
  Security,
} from '@mui/icons-material';
import { getLiffEnvironment } from '@/lib/liff';
import { useAppSelector } from '@/lib/store';
import { company, permissions } from '@/service/user.service';

export default function DemoFeatures() {
  const { user } = useAppSelector((state) => state.auth);
  const [services, setServices] = useState<any[]>([]);
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState<string>(user.company || '');

  const liffEnv = getLiffEnvironment();
  useEffect(() => {
    const getServicePermissions = async () => {
      try {
        const services = await permissions();
        setServices(services.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    }
    const getUserCompany = async () => {
      try {
        const companyUser = await company();

        setCompanies(companyUser.data);

      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    }

    getUserCompany();
    getServicePermissions();

  }, [])

  const handleCompanyChange = (event: any) => {
    const selectedCompanyUuid = event.target.value;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        LIFF Demo Features
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
            Environment Information
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
            <Typography variant="h6" gutterBottom>
              <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
              Select Company ({companies.length} available)
            </Typography>
            <Select
              onChange={handleCompanyChange}
              fullWidth
              value={user.company || ''}
              disabled={companies.length === 1}
            >
              {companies.map((comp: any) => (
                <MenuItem key={comp.uuid} value={comp.uuid}>{comp.name}</MenuItem>
              ))}
            </Select>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 2
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
                <Info />
              </Box>
              <Typography variant="h6" gutterBottom>
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {item.description}
              </Typography>

              <Button size={'small'} variant="contained">
                Access {item.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color='text.secondary'>
          <Security sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
          <strong>Note:</strong> If not found any service, Please contact your admin to grant permission any company.
        </Typography>
      </Box>
    </Box>
  );
}
