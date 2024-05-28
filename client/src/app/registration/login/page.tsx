"use client";

import Link from "next/link";

import React, { useState } from "react";
import useLoginUser from "@/hook/useLoginUser";

import { KeyRound, Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Data } from "@/types/data";

const Login = () => {
  const loginUser = useLoginUser();

  const [data, setData] = useState<Data>({
    email: "",
    password: "",
    status: false
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  console.log(loginUser);

  return (
    <div className="p-5 h-full flex flex-col w-full">
      <header className="mb-10">
        <h1 className="text-white font-bold text-lg">Log in</h1>
      </header>

      <main>
        <form
          className="flex flex-col gap-5 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            loginUser.mutate({ ...data, device_id: null });
          }}
        >
          <Input
            type="email"
            input_picture={<Mail width={18} height={18} color="white" />}
            placeholder="Enter email"
            autoComplete="true"
            name="email"
            onChange={handleChange}
            value={data.email}
          />

          <Input
            type="password"
            input_picture={<KeyRound width={18} height={18} color="white" />}
            placeholder="Enter password"
            autoComplete="true"
            name="password"
            onChange={handleChange}
            value={data.password}
          />

          <div className="flex flex-col gap-3 text-sm text-white">
            <div>
              <p>
                Do not have an accout?{" "}
                <Link href="signin" className="text-indigo-400 font-semibold">
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </main>
    </div>
  );
};

export default Login;
