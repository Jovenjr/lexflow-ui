import { useMutation } from '@tanstack/react-query';
import api from '../axios';
import { useAuth } from '../../context/AuthContext';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: any; // Debería ser el tipo User
}

export const useLogin = () => {
  const { login: contextLogin } = useAuth(); // Obtener la función login del contexto

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<LoginResponse>('/auth/login', payload);
      return data;
    },
    onSuccess: (data) => {
      // Llamar a la función login del contexto para actualizar estado y localStorage
      contextLogin(data.access_token, data.refresh_token, data.user);
    },
    onError: (error) => {
      // Aquí puedes manejar errores específicos del login si es necesario
      console.error("Login failed:", error);
      // Podrías usar una librería de notificaciones para mostrar el error al usuario
    },
  });
};

// Aquí se podrían añadir useRegister, useLogout (si necesita llamar API), useMe, useRefreshToken, etc. 