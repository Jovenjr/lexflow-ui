import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from '../api/hooks/useAuth';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

// Esquema de validación con Zod
const schema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type LoginFormInputs = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            autoComplete="email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          {/* Aquí podrías añadir un Checkbox para "Recordarme" si es necesario */}
          {loginMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {/* Idealmente, mapear el error de la API a un mensaje más amigable */}
              Error al iniciar sesión. Verifica tus credenciales.
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loginMutation.isPending} // Deshabilitar mientras carga
          >
            {loginMutation.isPending ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
          {/* Aquí podrías añadir enlaces para "Olvidé mi contraseña" o "Registrarse" */}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
