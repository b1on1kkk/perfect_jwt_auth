import axios, { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import type { Data } from "@/types/data";

const useRegistration = () => {
  return useMutation<null, AxiosError, Data>({
    mutationFn: (data: Data) =>
      axios
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
        .then((res) => res.data)
  });
};

export default useRegistration;
