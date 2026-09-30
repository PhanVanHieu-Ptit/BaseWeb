# BaseWeb

Boilerplate frontend production-ready: **Vite + React + TypeScript (strict)**, Tailwind CSS v4 + shadcn/ui, React Router, TanStack Query + Axios (tự refresh token), Zustand, kiến trúc feature-based, ESLint (flat config) + Prettier + lint-staged + Husky.

## Công nghệ

| Nhóm            | Thư viện                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------ |
| Runtime & build | Vite 8, React 19, TypeScript **6.0** (`strict`), pnpm 10                                   |
| UI              | Tailwind CSS 4 (`@tailwindcss/vite`), shadcn/ui (`new-york`, gói `radix-ui`), lucide-react |
| Routing         | React Router 8 (data router, route lazy, layout lồng nhau)                                 |
| Server state    | TanStack Query 5 + Axios (interceptor gắn token, refresh, chuẩn hoá lỗi)                   |
| Client state    | Zustand 5 (`persist`)                                                                      |
| Validation      | Zod 4 (env, form, response API)                                                            |
| Chất lượng code | ESLint 10 (flat) + typescript-eslint (type-aware), Prettier, lint-staged, Husky            |
| Mock API (dev)  | MSW 3                                                                                      |

## Yêu cầu

- Node.js **>= 22.22.1** (xem `.nvmrc`), pnpm **>= 10**.

## Bắt đầu nhanh

```bash
pnpm install
cp .env.example .env     # chỉnh giá trị nếu cần
pnpm dev
```

Mặc định `.env.example` bật `VITE_ENABLE_MOCKS=true`, nên có thể đăng nhập ngay với tài khoản demo
`demo@example.com` / `password123` mà không cần backend.

## Scripts

| Lệnh                                | Mô tả                                                                 |
| ----------------------------------- | --------------------------------------------------------------------- |
| `pnpm dev`                          | Chạy dev server                                                       |
| `pnpm build`                        | `typecheck` rồi `vite build`                                          |
| `pnpm preview`                      | Chạy thử bản build                                                    |
| `pnpm typecheck`                    | `tsc --noEmit` cho `src/` và cho file cấu hình (`tsconfig.node.json`) |
| `pnpm lint` / `pnpm lint:fix`       | ESLint (không cho phép warning)                                       |
| `pnpm format` / `pnpm format:check` | Prettier                                                              |

Pre-commit (Husky): `lint-staged` (ESLint `--fix` + Prettier trên file đã stage), sau đó `pnpm typecheck` cho toàn dự án.

## Biến môi trường

Được kiểm tra bằng Zod ở [`src/config/env.schema.ts`](src/config/env.schema.ts) ba lần: khi khởi động dev server, khi build (trong `vite.config.ts`) và lúc chạy app. Sai/thiếu biến thì dừng ngay với thông báo rõ ràng thay vì ra màn hình trắng.

| Biến                  | Bắt buộc | Mô tả                                                               |
| --------------------- | -------- | ------------------------------------------------------------------- |
| `VITE_APP_NAME`       | không    | Tên hiển thị (mặc định `BaseWeb`)                                   |
| `VITE_API_BASE_URL`   | có       | URL tuyệt đối hoặc path bắt đầu bằng `/` (vd `/api` khi dùng proxy) |
| `VITE_API_TIMEOUT_MS` | không    | Timeout request, mặc định `15000`                                   |
| `VITE_ENABLE_MOCKS`   | không    | `true` để dùng MSW ở dev. Luôn bị bỏ qua ở bản build production     |

## Cấu trúc thư mục

```
src/
├── app/          # Providers, router, layout, route (mỗi file trong routes/ export `Component`, được lazy-load)
├── assets/       # Ảnh, svg, font
├── components/   # UI dùng chung (ui/ = shadcn)
├── config/       # Env (Zod), paths, hằng số
├── features/     # Theo nghiệp vụ; mỗi feature có api/ components/ hooks/ types/ (+ store/) và index.ts
├── hooks/        # Hook dùng chung (useDebounce…)
├── lib/          # axiosClient, queryClient, cn(), ApiError
├── mocks/        # MSW (chỉ dev)
├── types/        # Kiểu dùng chung
└── utils/        # Hàm thuần
```

### Quy ước kiến trúc (được ESLint cưỡng chế)

- **`index.ts` là public API của feature**: bên ngoài chỉ import `@/features/<tên>`, cấm `@/features/<tên>/...`. Trong cùng feature dùng import tương đối.
- **Phụ thuộc một chiều**: `app` → `features` → (`components`, `hooks`, `lib`, `utils`, `config`, `types`). Các thư mục dùng chung không được import `features` hay `app`; `features` không được import `app`.
- Alias `@/*` → `src/*` (khai báo ở `tsconfig.json` và `vite.config.ts`).
- Tên file `kebab-case`, component export dạng `PascalCase`.
- `cn()` (`src/lib/utils.ts`) gộp class có điều kiện và xử lý xung đột Tailwind; xem `Button` (`components/ui/button.tsx`) và `StatusBadge` (`features/dashboard/components/status-badge.tsx`).

## Xác thực

- Route: `/login` là `PublicRoute` (chỉ dành cho khách), `/dashboard` nằm trong `ProtectedRoute` + `MainLayout`. Chưa đăng nhập thì chuyển về `/login` và quay lại đúng URL cũ sau khi đăng nhập (đã chặn open-redirect).
- `axiosClient` ([`src/lib/axios.ts`](src/lib/axios.ts)): tự gắn `Authorization: Bearer`. Khi gặp `401` nó gọi refresh **một lần** dù có nhiều request lỗi cùng lúc, rồi gửi lại request. Refresh thất bại thì xoá session và guard đưa về `/login`. Request công khai dùng `{ skipAuth: true }`.
- `lib/` không import `features/`: feature `auth` đăng ký handler bằng `setupAuth()` (gọi trong `main.tsx`).
- Session lưu ở `localStorage` (Zustand `persist`) và đồng bộ giữa các tab. **Lưu ý bảo mật**: token trong `localStorage` có thể bị đọc nếu trang dính XSS. Nếu backend hỗ trợ, nên để refresh token trong cookie `httpOnly`; phần cần sửa nằm gọn trong `features/auth/store` và `features/auth/setup.ts`.

### Hợp đồng API mà frontend đang gọi

| Method & path                                    | Request               | Response 200                                                             |
| ------------------------------------------------ | --------------------- | ------------------------------------------------------------------------ |
| `POST /auth/login`                               | `{ email, password }` | `{ accessToken, refreshToken, user: { id, email, name } }`               |
| `POST /auth/refresh`                             | `{ refreshToken }`    | `{ accessToken, refreshToken? }` (bỏ `refreshToken` nếu không xoay vòng) |
| `POST /auth/logout`                              | —                     | bất kỳ (2xx)                                                             |
| `GET /dashboard/stats`                           | —                     | `{ totalUsers, activeSessions, revenue, conversionRate }`                |
| `GET /dashboard/activities?search&page&pageSize` | —                     | `{ items: Activity[], total, page, pageSize }`                           |

Lỗi: `{ message?: string, code?: string, errors?: Record<string, string[]> }`. Response được kiểm tra bằng Zod (schema nằm ở `features/*/types`), lệch hợp đồng sẽ báo lỗi rõ ràng.

## Mock API (MSW)

Bật bằng `VITE_ENABLE_MOCKS=true` (chỉ ở `pnpm dev`). Plugin `msw/vite` tự phục vụ `/mockServiceWorker.js`; bản build production không chứa MSW hay file worker.

- Handler: [`src/mocks/handlers.ts`](src/mocks/handlers.ts). Tài khoản demo: `demo@example.com` / `password123`.
- **Access token mock chỉ sống 30 giây** để bạn thấy cơ chế refresh chạy thật: để dashboard mở một lúc rồi gõ tìm kiếm hoặc tải lại trang. Refresh token sống 10 phút; hết hạn sẽ bị đưa về `/login`.

## Thêm một feature mới

1. Tạo `src/features/<tên>/` với `api/`, `components/`, `hooks/`, `types/` (khi cần thì thêm `store/`).
2. Mỗi thao tác API một file trong `api/`: hàm gọi `axiosClient` + parse bằng Zod, và hook `useQuery`/`useMutation` (xem `features/dashboard/api`). Dùng `queryOptions()` và key factory.
3. Export những gì bên ngoài cần trong `index.ts` của feature.
4. Thêm route trong `src/app/routes/<tên>.tsx` (export `Component`) và khai báo lazy trong `src/app/router.tsx`; thêm đường dẫn vào `src/config/paths.ts`.

## Thêm component shadcn/ui

`components.json` đã sẵn sàng (style `new-york`, Tailwind v4, alias `@/components/ui`):

```bash
pnpm dlx shadcn@latest add dialog
```

Tailwind v4 cấu hình theo kiểu CSS-first nên **không có `tailwind.config.js`**: theme nằm ở [`src/index.css`](src/index.css) (`:root`, `.dark`, `@theme inline`). Dark mode dùng class `.dark` trên thẻ cha; dự án chưa có nút chuyển.

## Ghi chú phiên bản

- **TypeScript ghim `~6.0`** chứ không dùng 7.x: `typescript-eslint` hiện chỉ hỗ trợ TypeScript `<6.1`. Nâng lên 7.x khi `typescript-eslint` hỗ trợ.
- `react-router` 8 không còn `react-router-dom`: import từ `react-router` và `react-router/dom` (`RouterProvider`).
- Có `@tanstack/react-query-devtools` trong dev; bản production không chứa devtools.

## Triển khai

Đây là SPA: server tĩnh phải rewrite mọi đường dẫn không phải file về `index.html`. Biến `VITE_*` được nhúng lúc build, hãy cung cấp chúng ở bước build (CI).

## Lệnh cài đặt đã dùng

```bash
# dependencies
pnpm add react react-dom react-router \
  @tanstack/react-query @tanstack/react-query-devtools \
  axios zustand zod \
  radix-ui lucide-react class-variance-authority clsx tailwind-merge

# devDependencies
pnpm add -D vite @vitejs/plugin-react typescript@~6.0.3 \
  @types/node@22 @types/react @types/react-dom \
  tailwindcss @tailwindcss/vite tw-animate-css \
  eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh \
  eslint-config-prettier globals \
  prettier prettier-plugin-tailwindcss \
  husky lint-staged msw
```
