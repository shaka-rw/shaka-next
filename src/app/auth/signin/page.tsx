'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { MdDangerous, MdLock, MdLogin } from 'react-icons/md';
import {
  AiFillGoogleCircle as GoogleIcon,
  AiOutlineUserAdd as SignupIcon,
} from 'react-icons/ai';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (
    data
  ) => {
    setIsLoading(true);
    const result = await signIn('credentials', {
      redirect: true,
      callbackUrl: '/',
      email: data.email,
      password: data.password,
    });
    setIsLoading(false);

    if (result?.error) {
      toast.error(`Incorrect username or password`);
      // Handle login error, e.g., show an error message.
    } else {
      //   router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 items-center max-w-2xl w-full space-y-8">
        <div>
          <div className="flex items-center justify-center gap-2 p-1">
            <Image src={'/logo_.png'} height={80} width={120} alt="Shaka" />
            <span className=" h-10 w-[.07rem] rounded bg-gray-400 hidden md:inline-block font-bold text-sm"></span>

            <MdLock className="mx-auto h-12 w-auto text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold ">Login</h2>
        </div>
        <form
          className="card flex flex-col w-full md:w-[300px] placeholder:items-center p-2  gap-2 shadow"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <div className="w-full flex gap-2 flex-col">
            {error === 'CredentialsSignin' ? (
              <p className="alert alert-error flex gap-2 items-center">
                <MdDangerous /> Incorrect email or password
              </p>
            ) : (
              <></>
            )}
            <div className="w-full">
              <label htmlFor="email" className="label">
                <div className="label-text">Email address</div>
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                autoComplete="email"
                {...register('email', { required: 'Email is required' })}
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="label">
                <div className="label-text">Password</div>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                {...register('password', { required: 'Password is required' })}
                className="input input-bordered w-full"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center  items-stretch md:items-center gap-2">
            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-primary"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Login'
              )}
              <span>
                <MdLogin />
              </span>
            </button>
            <span className=" h-10 w-[.07rem] rounded bg-gray-400 hidden md:inline-block font-bold text-sm"></span>

            <Link href="/auth/signup" className="btn btn-outline link">
              Signup
              <span>
                <SignupIcon />
              </span>
            </Link>
          </div>
          <div className="flex w-full gap-3 items-center">
            <div className=" border-b-2 rounded border-gray-500 w-full"></div>
            <span className="inline-block font-bold text-sm">OR</span>
            <div className=" border-b-2 rounded border-gray-500 w-full"></div>
          </div>
          <button
            type="button"
            onClick={() =>
              signIn('google', { redirect: true, callbackUrl: '/' })
            }
            disabled={isLoading}
            className="btn flex bg-yellow-600 text-white items-center "
          >
            <span className=" flex items-center pl-3">
              <GoogleIcon className="h-5 w-5 text-xl text-yellow-500 group-hover:text-yellow-400" />
            </span>
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
