'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { MdLock, MdLogin } from 'react-icons/md';
import {
  AiFillGoogleCircle as GoogleIcon,
  AiOutlineUserAdd as SignupIcon,
} from 'react-icons/ai';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from '@/components/server/Link';
import Image from 'next/image';

const signupSchema = z
  .object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().email(),
    password: z
      .string()
      .min(6)
      .regex(/^(?=.*[\w])(?=.*\d).+$/, {
        message: 'Password must contain atleast 1 digit and letters',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  type Data = {
    firstName: string;
    lastName: string;
    confirmPassword: string;
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>({ resolver: zodResolver(signupSchema) });

  const onSubmit: SubmitHandler<Data> = async (data) => {
    setIsLoading(true);
    const response = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());
    setIsLoading(false);

    if (response?.error) {
      toast.error(`Error: ${response.error}`);
      // Handle login error, e.g., show an error message.
    } else {
      setIsLoading(true);
      const result = await signIn('credentials', {
        redirect: true,
        callbackUrl: '/',
        ...data,
      });
      setIsLoading(false);

      if (result?.error) {
        toast.error(`Incorrect username or password`);
        // Handle login error, e.g., show an error message.
      } else {
        toast.success('You have signed in...!');
        // Redirect or perform any other action upon successful login.
      }
      // Redirect or perform any other action upon successful login.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 items-center max-w-md w-full space-y-8">
        <div className="flex items-center justify-center gap-2 p-1">
          <Link href={'/'}>
            <Image src={'/logo_.png'} height={80} width={120} alt="Shaka" />
          </Link>
          <span className=" h-10 w-[.07rem] rounded bg-gray-400 hidden md:inline-block font-bold text-sm"></span>
          <SignupIcon className="mx-auto h-12 w-auto text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold ">Sign Up</h2>

        <form
          className="card flex flex-col w-full md:w-[400px] items-center p-2  gap-2 shadow"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-col md:flex-row max-w-full w-full gap-2">
              <div className="">
                <label htmlFor="firstName" className="label">
                  <div className="label-text">First Name</div>
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  autoComplete="firstname"
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                  className="input input-bordered w-full"
                />
                {errors.firstName && (
                  <p className="text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="label">
                  <div className="label-text">Last Name</div>
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  autoComplete="lastname"
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                  className="input input-bordered w-full"
                />
                {errors.lastName && (
                  <p className="text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
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
            <div className="flex flex-col md:flex-row  gap-2">
              <div>
                <label htmlFor="password" className="label">
                  <div className="label-text">Password</div>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className="input input-bordered w-full"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="label">
                  <div className="label-text">Confirm Password</div>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  autoComplete="current-password"
                  {...register('confirmPassword', {
                    required: 'Password is required',
                  })}
                  className="input input-bordered w-full"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full mt-5 flex-col md:flex-row justify-center  items-stretch md:items-center gap-2">
            <button type="submit" className="btn btn-primary">
              Sign Up{' '}
              <span>
                <SignupIcon />
              </span>
            </button>
            <span className=" h-10 w-[.07rem] rounded bg-gray-400 hidden md:inline-block font-bold text-sm"></span>

            <Link href="/auth/signin" className="btn btn-outline link">
              Login
              <span>
                <MdLogin />
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
            onClick={() => signIn('google')}
            disabled={isLoading}
            className="btn flex bg-yellow-600 text-white items-center "
          >
            <span className=" flex items-center pl-3">
              <GoogleIcon className="h-5 w-5 text-xl text-yellow-500 group-hover:text-yellow-400" />
            </span>
            Sign up with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
export const dynamic = "force-dynamic"
