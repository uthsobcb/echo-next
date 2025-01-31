
import { doSignOut } from '@/app/action';
import Image from 'next/image';
export default function SignOut() {
    return (
        <form action={doSignOut} >
            <div className='flex justify-between flex-wrap'>
                <button type="submit" className="px-4 py-2 rounded-md  w-full sm:w-auto text-center text-cyan-900 hover:text-cyan-700 transition duration-300 font-semibold text-sm flex items-center">
                    <Image
                        src="/assets/signout.svg"
                        alt="sign out icon"
                        width={24}
                        height={24} />

                    Sign Out
                </button>
            </div>
        </form>
    );
}