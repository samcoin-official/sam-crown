'use client';
import { CircularIcon, Marble } from '@worldcoin/mini-apps-ui-kit-react';
import { CheckCircleSolid } from 'iconoir-react';
import { useSession } from 'next-auth/react';

type UserLike = {
  username?: string | null;
  profilePictureUrl?: string | null;
};

export const UserInfo = () => {
  const session = useSession();
  const user = (session?.data?.user ?? {}) as UserLike;

  return (
    <div className="flex flex-row items-center justify-start gap-4 rounded-xl w-full border-2 border-gray-200 p-4">
      <Marble src={user.profilePictureUrl ?? undefined} className="w-14" />
      <div className="flex flex-row items-center justify-center">
        <span className="text-lg font-semibold capitalize">
          {user.username ?? 'Anonymous'}
        </span>
        {user.profilePictureUrl && (
          <CircularIcon size="sm" className="ml-0">
            <CheckCircleSolid className="text-blue-600" />
          </CircularIcon>
        )}
      </div>
    </div>
  );
};
