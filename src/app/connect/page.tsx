import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Connect the Echo app",
    description: "Point the Echo mobile app at this self-hosted instance.",
};

export default async function ConnectPage() {
    const headerList = await headers();
    const host = headerList.get("host") ?? "localhost:3000";
    const proto =
        headerList.get("x-forwarded-proto") ??
        (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    const origin = `${proto}://${host}`;
    // The mobile app registers the "my-echo" scheme and handles /connect?server=…
    const serverLink = `my-echo://connect?server=${encodeURIComponent(origin)}`;

    return (
        <div className="mx-auto max-w-2xl px-6 py-12 text-gray-800">
            <h1 className="mb-2 text-3xl font-bold">Connect the Echo app</h1>
            <p className="mb-8 text-gray-600">
                Use this instance from the Echo Android or iOS app. Open this page on the phone that has
                the app installed, then tap the button below.
            </p>

            <a
                href={serverLink}
                className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
                Open in the Echo app
            </a>

            <h2 className="mt-10 mb-2 text-xl font-semibold">Or enter it by hand</h2>
            <p className="mb-3 text-gray-600">
                In the app, go to sign-in → <em>Use your own server</em> and type this address:
            </p>
            <code className="block break-all rounded-lg bg-gray-100 px-4 py-3 font-mono text-sm">
                {origin}
            </code>

            <h2 className="mt-10 mb-2 text-xl font-semibold">Notes</h2>
            <ul className="list-disc space-y-2 pl-6 text-gray-600">
                <li>
                    The address must be reachable from the phone. A LAN-only instance works on the same
                    network; a public instance needs HTTPS and a domain.
                </li>
                <li>
                    Accounts are per-server, so after switching the app asks you to sign in again on this
                    instance.
                </li>
                <li>
                    The app checks <code className="font-mono">{origin}/api/health</code> before it saves
                    the server.
                </li>
            </ul>
        </div>
    );
}
