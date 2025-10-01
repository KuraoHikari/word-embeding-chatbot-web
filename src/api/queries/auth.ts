import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { useAuthStore } from "@/store/authStore";
import { type LoginFormData, type RegisterFormData } from "@/lib/validations";

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  access_token: string;
}

export const useLoginMutation = () => {
  const login = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormData): Promise<LoginResponse> => {
      return apiClient.post("auth/login", { json: data }).json();
    },
    onSuccess: (response) => {
      login(response.user, response.access_token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterFormData): Promise<LoginResponse> => {
      return apiClient.post("auth/register", { json: data }).json();
    },
  });
};
