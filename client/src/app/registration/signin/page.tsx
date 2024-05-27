"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Data } from "@/types/data";
import { KeyRound, Mail, UserRound } from "lucide-react";
import Link from "next/link";

import React, { useState } from "react";

const Registration = () => {
  const [data, setData] = useState<Data>({
    name: "",
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

  const handleCheckbox = (status: boolean) => {
    setData((prevFormData) => ({
      ...prevFormData,
      status
    }));
  };

  return (
    <div className="p-5 h-full flex flex-col w-full">
      <header className="mb-10">
        <h1 className="text-white font-bold text-lg">Sign in</h1>
      </header>

      <main>
        <form
          className="flex flex-col gap-5 flex-1"
          onSubmit={(e) => {
            e.preventDefault();

            console.log(data);
          }}
        >
          <Input
            type="text"
            input_picture={<UserRound width={18} height={18} color="white" />}
            placeholder="Enter name"
            autoComplete="true"
            name="name"
            onChange={handleChange}
          />

          <Input
            type="email"
            input_picture={<Mail width={18} height={18} color="white" />}
            placeholder="Enter email"
            autoComplete="true"
            name="email"
            onChange={handleChange}
          />

          <Input
            type="password"
            input_picture={<KeyRound width={18} height={18} color="white" />}
            placeholder="Enter password"
            autoComplete="true"
            name="password"
            onChange={handleChange}
          />

          <div className="flex flex-col gap-3 text-sm text-white">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember_me"
                onCheckedChange={handleCheckbox}
                checked={data.status}
              />
              <label htmlFor="remember_me">remember me</label>
            </div>
            <div>
              <p>
                Do have an accout?{" "}
                <Link href="login" className="text-indigo-400 font-semibold">
                  Log in
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

export default Registration;
