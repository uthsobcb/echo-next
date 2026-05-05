import Image from 'next/image';
export default function ErrorPage() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center w-full min-h-screen gap-12 py-8">
                <Image src="/assets/access.svg" alt="403" width={200} height={200} />
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-3xl font-medium text-center">
                        You are not authorized
                    </h1>
                    <p className="text-xl text-center ">
                        You tried to access a page you did not have prior
                        authorization for.
                    </p>
                </div>
            </div></div>
    )
}
