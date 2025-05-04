
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axios";

export const useLogin = () =>
  useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await axiosInstance.post("/auth/login", payload);
      return res.data;
    },
  });
