import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFile } from "fs/promises";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;
const isBuild = process.argv.includes("build");

if (!rawPort && !isBuild) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort ?? 3000);

if (!isBuild && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";

const ogRoutes: Record<string, string> = {
  "/whitepaper":          "whitepaper/index.html",
  "/scale-or-transform":  "scale-or-transform/index.html",
  "/cohort":              "cohort/index.html",
};

const whitepaperOgServe = (): Plugin => ({
  name: "whitepaper-og-serve",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url ?? "";
      const trailingSlash = url.endsWith("/") && url.length > 1 ? url.slice(0, -1) : null;
      if (trailingSlash && ogRoutes[trailingSlash]) {
        res.writeHead(301, { Location: trailingSlash });
        res.end();
        return;
      }
      const srcFile = ogRoutes[url];
      if (srcFile) {
        try {
          const raw = await readFile(path.resolve(import.meta.dirname, srcFile), "utf-8");
          const html = await server.transformIndexHtml(url, raw);
          res.setHeader("Content-Type", "text/html");
          res.end(html);
          return;
        } catch {
          return next();
        }
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url ?? "";
      const trailingSlash = url.endsWith("/") && url.length > 1 ? url.slice(0, -1) : null;
      if (trailingSlash && ogRoutes[trailingSlash]) {
        res.writeHead(301, { Location: trailingSlash });
        res.end();
        return;
      }
      const srcFile = ogRoutes[url];
      if (srcFile) {
        try {
          const distFile = srcFile.replace(/\/index\.html$/, "").replace(/^/, "dist/public/") + "/index.html";
          const html = await readFile(path.resolve(import.meta.dirname, distFile), "utf-8");
          res.setHeader("Content-Type", "text/html");
          res.end(html);
          return;
        } catch {
          return next();
        }
      }
      next();
    });
  },
});

export default defineConfig({
  base: basePath,
  plugins: [
    whitepaperOgServe(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:               path.resolve(import.meta.dirname, "index.html"),
        whitepaper:         path.resolve(import.meta.dirname, "whitepaper/index.html"),
        scaleOrTransform:   path.resolve(import.meta.dirname, "scale-or-transform/index.html"),
        cohort:             path.resolve(import.meta.dirname, "cohort/index.html"),
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: false,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
