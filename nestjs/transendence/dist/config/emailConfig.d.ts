declare const _default: (() => {
    service: string;
    auth: {
        user: string;
        pass: string;
    };
    baseUrl: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    service: string;
    auth: {
        user: string;
        pass: string;
    };
    baseUrl: string;
}>;
export default _default;
