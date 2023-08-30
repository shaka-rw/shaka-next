'use client';
import { createPayment } from '@/app/_actions/orders';
import { WaveLinkResponse } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { MdAdd, MdShoppingCartCheckout } from 'react-icons/md';
import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().trim().nonempty(),
  email: z.string().email(),
  address: z.string().trim().nonempty(),
  phoneNumber: z
    .string()
    .trim()
    .nonempty()
    .regex(/^\d{10}$/),
});

const CheckoutForm = ({
  cartTotal,
  onPayLink,
}: {
  cartTotal: number;
  onPayLink: (link: string) => void;
}) => {
  const session = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: z.infer<typeof checkoutSchema>) {
    const formData = new FormData();
    formData.append(
      'userData',
      JSON.stringify({ ...data, phoneNumber: `25${data.phoneNumber}` })
    );
    // formData.append('name', data.name);
    // formData.append('email', data.email);
    // formData.append('address', data.address);
    // formData.append('phoneNumber', `25${data.phoneNumber}`);

    startTransition(async () => {
      const result = await createPayment(formData);
      if (result[0]) {
        toast.error(result[0] as string);
        return;
      }
      const response = result[1] as WaveLinkResponse | null;
      if (!response || !response?.data) {
        toast.error('Something went wrong, try again!');
        return;
      }

      onPayLink(response.data.link);
    });
  }

  return (
    <form
      className="my-2 mx-auto md:grid gap-2 md:grid-cols-2 "
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Fullname</span>
        </label>
        <input
          type="text"
          defaultValue={session?.data?.user?.name ?? ''}
          className="input input-bordered w-full"
          // disabled={!!session?.data?.user?.name}
          placeholder="Shop name"
          {...register('name', { value: session?.data?.user?.name ?? '' })}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-red-500">
              {errors.name.message}
            </span>
          </label>
        )}
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          defaultValue={session?.data?.user?.email ?? ''}
          type="text"
          // disabled={!!session?.data?.user?.email}
          className="input input-bordered w-full"
          placeholder="Email"
          {...register('email', { value: session?.data?.user?.email ?? '' })}
        />
        {errors.email && (
          <label className="label">
            <span className="label-text-alt text-red-500">
              {errors.email.message}
            </span>
          </label>
        )}
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Address</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Address"
          {...register('address')}
        />
        {errors.address && (
          <label className="label">
            <span className="label-text-alt text-red-500">
              {errors.address.message}
            </span>
          </label>
        )}
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Phone Number</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Phone Number"
          {...register('phoneNumber')}
        />
        {errors.phoneNumber && (
          <label className="label">
            <span className="label-text-alt text-red-500">
              {errors.phoneNumber.message}
            </span>
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-fit"
      >
        <MdShoppingCartCheckout /> Checkout{' '}
        <span className="font-mono font-bold ">({cartTotal + 2000}RWF)</span>
        {isPending && <span className="loading loading-spinner loading-sm" />}
      </button>
    </form>
  );
};

export default CheckoutForm;
