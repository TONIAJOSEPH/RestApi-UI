"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import { z, TypeOf } from "zod";

const createSessionSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type createSessionInput = TypeOf<typeof createSessionSchema>;
function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    formState: { errors },

    handleSubmit,
  } = useForm<createSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  async function onSubmit(values: createSessionInput) {
    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        values,
        { withCredentials: true }
      );
      console.log(result);
      router.push("/");
    } catch (e) {
      setLoginError(String(e));
    }
  }
  console.log({ errors });
  return (
    <>
      <p>{loginError}</p>
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="*******"
            {...register("password")}
          />
          <p>{(errors.password as FieldError)?.message}</p>
        </div>

        <button type="submit">SUBMIT</button>
        <a href="/auth/register">Please register</a>
      </form>
    </>
  );
}

export default LoginPage;
