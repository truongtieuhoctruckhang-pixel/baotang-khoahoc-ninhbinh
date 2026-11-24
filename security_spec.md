# Security Specification — Bảo Tàng Khoa Học Số (Firestore & Admin)

## 1. Data Invariants
- Public visitors (including unauthenticated QR scanners) may read `/stations/{stationId}` and `/siteConfig/{configId}` without signing in.
- Only the designated administrator (`request.auth.token.email == 'truongtieuhoctruckhang@gmail.com'` with `request.auth.token.email_verified == true`) may create, update, or delete documents in `/stations` and `/siteConfig`.
- Every document write must include `updatedAt == request.time` (server timestamp) and match exact schema keys and size limits.
- All other Firestore paths are denied by default.

## 2. Adversarial Test Payloads ("Dirty Dozen")
1. Unauthenticated write to `/stations/01` -> `PERMISSION_DENIED`.
2. Signed-in non-admin user (`other@gmail.com`) write to `/stations/01` -> `PERMISSION_DENIED`.
3. Spoofed admin email with `email_verified: false` -> `PERMISSION_DENIED`.
4. Shadow field injection (`extraField: true`) on `/stations/01` -> `PERMISSION_DENIED`.
5. Oversized `ten` string (> 180 chars) on `/stations/01` -> `PERMISSION_DENIED`.
6. Oversized `stationId` (> 128 chars) or invalid characters (`../bad`) -> `PERMISSION_DENIED`.
7. Client-forged `updatedAt` timestamp (`updatedAt != request.time`) -> `PERMISSION_DENIED`.
8. Invalid `cumId` (`cum-99`) -> `PERMISSION_DENIED`.
9. Unbounded `cauHoi` array (> 20 items) -> `PERMISSION_DENIED`.
10. Unauthenticated write to `/siteConfig/main` -> `PERMISSION_DENIED`.
11. Non-admin delete on `/stations/01` -> `PERMISSION_DENIED`.
12. Read/write to an unlisted collection `/secrets/keys` -> `PERMISSION_DENIED`.
