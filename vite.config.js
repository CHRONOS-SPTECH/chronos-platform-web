import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_TARGET || "http://localhost:8080";
  const isProduction = mode === "production";

  function manualChunks(id) {
    const segments = id.split(/[\\/]+/);
    const nodeModulesIndex = segments.lastIndexOf("node_modules");

    if (nodeModulesIndex === -1) return;

    const packageName = segments[nodeModulesIndex + 1]?.startsWith("@")
      ? `${segments[nodeModulesIndex + 1]}/${segments[nodeModulesIndex + 2]}`
      : segments[nodeModulesIndex + 1];

    if (["react", "react-dom", "scheduler"].includes(packageName)) {
      return "react-vendor";
    }

    if (["react-router", "react-router-dom", "@remix-run/router"].includes(packageName)) {
      return "router-vendor";
    }

    if (
      ["chart.js", "react-chartjs-2", "recharts", "victory-vendor"].includes(packageName) ||
      packageName?.startsWith("d3-")
    ) {
      return "charts-vendor";
    }

    if (["@phosphor-icons/react", "lucide-react"].includes(packageName)) {
      return "icons-vendor";
    }

    if (packageName === "face-api.js") {
      return "face-api-vendor";
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    ...(isProduction && {
      esbuild: {
        drop: ["console", "debugger"],
      },
    }),
    build: {
      minify: "esbuild",
      sourcemap: false,
      reportCompressedSize: false,
      rollupOptions: {
        maxParallelFileOps: 10,
        output: {
          manualChunks,
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
