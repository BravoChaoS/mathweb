# Browser Automation & Server Troubleshooting Guide

This guide documents common issues encountered when running browser automation tests against the local Vite development server and how to resolve them.

## 1. Connection Refused (ERR_CONNECTION_REFUSED)

**Sympton:** Browser subagent returns `net::ERR_CONNECTION_REFUSED` when trying to access `localhost:5173`.

**Cause:**
- The Vite server is not running.
- The Vite server is running but bound to a different port or IP (not `localhost`).
- The Vite server process was killed or crashed.
- You are trying to access the server before it has finished starting up.

**Solution:**
1.  **Check Process:** Run `ps aux | grep vite` to verify if the process is active.
2.  **Check Logs:** Check `vite.log` (if you redirected output) to see the actual port and binding.
    ```bash
    > vite --port 5173 --host
      VITE v6.4.1  ready in 234 ms
      ➜  Local:   http://localhost:5173/mathweb/
    ```
3.  **Use Correct URL:** If `vite.config.ts` has a `base` set (e.g., `/mathweb/`), you MUST include this in the URL.
    - Incorrect: `http://localhost:5173/equation-solver`
    - Correct: `http://localhost:5173/mathweb/#/equation-solver` (for HashRouter)
4.  **Wait for Startup:** When starting the server via `nohup` or background command, allow at least 5-10 seconds before attempting to access it with the browser agent.

## 2. 404 Not Found vs Blank Page

**Sympton:** Browser navigates but shows a blank page or 404.

**Cause:**
- Incorrect Base URL (as mentioned above).
- Using `Link` or `Router` logic that expects a certain path structure.

**Solution:**
- Always check `vite.config.ts` for the `base` property.
- For HashRouter, remember the `#` symbol. `http://host:port/base/#/route`.

## 3. Server Management in Agent Environment

**Best Practice:**
- Use `pkill -f vite` to clean up old processes before starting a new one to avoid port conflicts.
- Use `nohup npm run dev -- --port 5173 --host > vite.log 2>&1 &` to keep it running in the background and capture logs.
- Verify startup with `cat vite.log` before launching the browser agent.

