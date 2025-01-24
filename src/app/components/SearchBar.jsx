'use client';
import { useSearchParams, usePathname, useRouter } from "next/navigation";


export default function SearchBar({ onSearch }) {

    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

    function handleSearch(term) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        }
        else {
            params.delete('q');
        }

        replace(`${pathName}?${params.toString()}`, { scroll: false });
        onSearch(term);
    }

    return (
        <div className="w-full p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Search Your Entries
            </h2>
            <div className="flex w-full justify-center items-center m-3">
                <div className="flex w-1/2 justify-center items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Type to search..."
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                        onChange={(e) => { handleSearch(e.target.value) }}
                        defaultValue={searchParams.get('q')?.toString()}
                    />
                    <input
                        type="date"
                        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
            </div>
        </div>
    )
}
