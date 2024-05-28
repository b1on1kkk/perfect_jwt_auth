import { LoginData } from "@/types/data";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const useLoginUser = () => {
  const router = useRouter();

  return useMutation<null, AxiosError, LoginData>({
    mutationFn: (data: LoginData) => {
      return axios
        .post(
          "http://localhost:4000/login",
          {
            email: data.email,
            device_id: data.device_id,
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

export default useLoginUser;
