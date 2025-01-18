
import { doSignOut } from '@/app/action';

export default function SignOut() {
    return (
        <form action={doSignOut}>
            <button type="submit" className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-semibold text-sm">
                Sign Out
            </button>
        </form>
    );
}