'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { MdDangerous, MdLock } from 'react-icons/md';
import {
  AiFillGoogleCircle as GoogleIcon,
  AiOutlineLogin,
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
            <Link href={'/'} className="flex items-center justify-center">
              <Image src={'/logo_.png'} height={80} width={120} alt="Shaka" />
            </Link>
            <span className=" h-10 w-[.07rem] rounded bg-gray-400 hidden md:inline-block font-bold text-sm"></span>

            <MdLock className="mx-auto h-12 w-auto text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold ">Login</h2>
        </div>
        <form
          className="card flex flex-col border w-full md:w-[300px] placeholder:items-center p-4  gap-2 shadow"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <div className="w-full flex gap-2 flex-col">
            {(error?.length ?? 0) > 0 ? (
              <p className="alert alert-error flex gap-2 items-center">
                <MdDangerous /> Something went wrong. Check you details, or try
                again.
              </p>
            ) : (
              <></>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              signIn('auth0', { redirect: true, callbackUrl: '/' })
            }
            disabled={isLoading}
            className="btn flex btn-primary flex-nowrap items-center "
          >
            <span className=" flex items-center pl-3">
              <AiOutlineLogin className="h-5 w-5 text-xl " />
            </span>
            Login or Signup
          </button>
          <div className="divider">OR</div>
          <button
            type="button"
            onClick={() =>
              signIn('google', { redirect: true, callbackUrl: '/' })
            }
            disabled={isLoading}
            className="btn flex shadow-md border border-yellow-600 btn-neutral items-center "
          >
            <span className=" flex items-center text-yellow-500 pl-3">
              <GoogleIcon className="h-5 w-5 text-xl  group-hover:text-yellow-400" />
            </span>
            Login with{' '}
            <span className="bg-gradient-to-r bg-clip-text text-transparent from-yellow-500 to-red-500 ">
              Google
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
export const dynamic = 'force-dynamic';
