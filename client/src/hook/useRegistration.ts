import axios, { AxiosError } from "axios";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import type { Data } from "@/types/data";

const useRegistration = () => {
  const router = useRouter();

  return useMutation<null, AxiosError, Data>({
    mutationFn: (data: Data) => {
      return axios
        .post(
          "http://localhost:4000/signin",
          {
            email: data.email,
            name: data.name,
            password: data.password,
            status: data.status
          },
          { withCredentials: true }
        )
        .then((res) => res.data);
    },

    onSuccess: () => {
      router.replace("/");
    }
  });
};

export default useRegistration;
