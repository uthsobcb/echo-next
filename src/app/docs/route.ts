import { ApiReference } from '@scalar/nextjs-api-reference';

const config = {
    spec: {
        url: '/api/openapi',
    },
};

export const GET = ApiReference(config);
