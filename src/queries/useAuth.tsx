// code cux

import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout,
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.refreshTokenFromNextServer,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.register,
  });
};
