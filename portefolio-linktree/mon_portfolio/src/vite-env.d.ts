/// <reference types="vite/client" />

declare module "*.glb" {
    const value: string;
    export default value;
}

declare module "*.md" {
    const value: string;
    export default value;
}
