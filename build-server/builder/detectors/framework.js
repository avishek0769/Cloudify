import { readPackageJson } from "../utils/readPackageJson.js";

export function detectFramework(projectDir) {
    const pkg = readPackageJson(projectDir);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // SSR Detection (Graceful Failures)
    if (deps["next"]) {
        throw new Error("Next.js (SSR framework) detected. Cloudify currently supports static frontend deployments only.");
    }
    if (deps["nuxt"]) {
        throw new Error("Nuxt (SSR framework) detected. Cloudify currently supports static frontend deployments only.");
    }
    if (deps["@remix-run/dev"] || deps["@remix-run/react"]) {
        throw new Error("Remix (SSR framework) detected. Cloudify currently supports static frontend deployments only.");
    }
    if (deps["@sveltejs/kit"]) {
        throw new Error("SvelteKit (SSR framework) detected. Cloudify currently supports static frontend deployments only.");
    }

    // Supported Vite Frameworks Detection
    if (deps["vite"]) {
        if (deps["react"]) return "React (Vite)";
        if (deps["vue"]) return "Vue (Vite)";
        if (deps["svelte"]) return "Svelte (Vite)";
        return "Vanilla Vite";
    }

    throw new Error("Unsupported framework. Cloudify currently only supports Vite-based static frontend deployments (React, Vue, Svelte, or Vanilla Vite).");
}
