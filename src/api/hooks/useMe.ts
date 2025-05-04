
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axios";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
