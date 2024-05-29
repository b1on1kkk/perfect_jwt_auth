import axios, { AxiosError } from "axios";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import type { LoginData } from "@/types/data";
import type { loginUserResponse } from "@/types/loginUserResponse";

const useLoginUser = (setValue: (value: string | null) => void) => {
  const router = useRouter();

  return useMutation<loginUserResponse, AxiosError, LoginData>({
    mutationFn: (data: LoginData) => {
      return axios
        .post<loginUserResponse>(
          "http://localhost:4000/login",
          {
            email: data.email,
            device_id: data.device_id,
            password: data.password,
            status: data.status
          },
          { withCredentials: true }
        )
        .then((res) => {
          setValue(res.data.device_id);

          return res.data;
        });
    },
    onSuccess: () => {
      router.replace("/");
    }
  });
};

export default useLoginUser;
