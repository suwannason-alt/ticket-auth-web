'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAppSelector } from '@/lib/store';

interface HeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const { mode, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Auth Demo */}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated && user ? (
            <>
              <Chip
                avatar={
                  <Avatar
                    src={user.pictureUrl}
                    alt={user.displayName}
                    sx={{ width: 24, height: 24 }}
                  >
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                }
                label={user.displayName}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  mr: 1,
                }}
              />
            </>
          ) : (
            <>
              <Button
                color="inherit"
                startIcon={<Login />}
                onClick={onLoginClick}
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                startIcon={<PersonAdd />}
                onClick={onRegisterClick}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  mr: 1,
                }}
              >
                Register
              </Button>
            </>
          )}

          <IconButton
            color="inherit"
            onClick={toggleTheme}
            aria-label="toggle theme"
          >
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
