/* eslint-disable @next/next/no-img-element */
import { getPath } from '@/app/_actions';
import prisma from '@/prisma';
import { User } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import React from 'react';

async function makeSeller(formData: FormData) {
  'use server';
  const userId = formData.get('userId') as string;

  await prisma.user.update({ where: { id: userId }, data: { role: 'SELLER' } });
  revalidatePath(await getPath());
}

const UsersTable = ({ users }: { users: User[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Name</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {users.map((user) => (
            <tr key={user.id}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src={
                          user.image ??
                          'https://daisyui.com/tailwind-css-component-profile-2@56w.png'
                        }
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm opacity-50">{user.email}</div>
                  </div>
                </div>
              </td>
              <td>
                {user.role}
                {/* <br />
                <span className="badge badge-ghost badge-sm">
                  Desktop Support Technician
                </span> */}
              </td>
              <th>
                <form action={makeSeller}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    disabled={user.role !== 'CUSTOMER'}
                    className="btn btn-ghost btn-xs"
                  >
                    Make Seller
                  </button>
                </form>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
