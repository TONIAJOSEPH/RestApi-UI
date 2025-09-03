"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import { z, TypeOf } from "zod";

const createUserSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    password: z
      .string()
      .min(6, { message: "Password too short - should be 6 chars minimum" }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Password confirmation is required" }),
    email: z.string().email({ message: "Not a valid email" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type createUserInput = TypeOf<typeof createUserSchema>;
function RegisterPage() {
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<createUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(values: createUserInput) {
    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        values
      );
      console.log(result);
      router.push("/");
    } catch (e) {
      setRegisterError(String(e));
    }
  }
  console.log({ errors });
  return (
    <>
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="jane@test.com"
            {...register("email")}
          />
          <p>{(errors.email as FieldError)?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="jane"
            {...register("name")}
          />
          <p>{(errors.name as FieldError)?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="*******"
            {...register("password")}
          />
          <p>{(errors.password as FieldError)?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="passwordConfirmation">Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="*******"
            {...register("passwordConfirmation")}
          />
          <p>{(errors.passwordConfirmation as FieldError)?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}

export default RegisterPage;
