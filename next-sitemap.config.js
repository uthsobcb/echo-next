/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://echojournal.life",
    generateRobotsTxt: true,
    // ponytail: only static/marketing paths, since almost every app route is
    // dynamic (ƒ) and never gets picked up from the build output anyway
    exclude: ["/opengraph-image", "/docs"],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
                // private, authenticated app pages — no public content to index
                disallow: [
                    "/api/",
                    "/admin",
                    "/chat",
                    "/entry",
                    "/todo",
                    "/space",
                    "/insights",
                    "/memory",
                    "/profile",
                    "/docs",
                ],
            },
        ],
    },
    additionalPaths: async (config) => [
        await config.transform(config, "/"),
        await config.transform(config, "/guide"),
        await config.transform(config, "/legal/privacy-policy"),
        await config.transform(config, "/legal/tnc"),
    ],
    // ponytail: individual /guide/[slug] posts aren't enumerated here (would
    // need a DB connection at build time); Google finds them via links on
    // /guide. Add a DB-driven additionalPaths query if that stops being enough.
};
