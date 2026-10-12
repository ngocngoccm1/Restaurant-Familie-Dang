# GitHub Pages

Website: https://ngocngoccm1.github.io/Restaurant-Familie-Dang/

GitHub Pages cần bản JavaScript đã biên dịch. `index.html` ở thư mục gốc là đầu vào của Vite; file thực sự được xuất bản là `dist/index.html` cùng toàn bộ asset trong `dist/`.

Workflow `.github/workflows/pages.yml` tự kiểm tra menu/giỏ hàng, build và deploy mỗi lần push lên `main`. Trong **Settings → Pages → Build and deployment**, Source phải là **GitHub Actions**. Không dùng chế độ publish trực tiếp `main / (root)` cho mã nguồn React.

Workflow lấy base path từ GitHub Pages; ảnh, font, PDF, liên kết và các JavaScript chunk đều dùng cùng base path. Build cũng tạo `impressum.html` và `datenschutz.html` để mở trực tiếp hoặc refresh trên hosting tĩnh mà không cần SPA rewrite.

## Kiểm tra trên máy

```bash
npm ci
PAGES_BASE_PATH=/Restaurant-Familie-Dang/ npm run build
npm run preview -- --base=/Restaurant-Familie-Dang/
```

Mở `http://localhost:4173/Restaurant-Familie-Dang/` (hoặc port Vite hiển thị). PowerShell: đặt `$env:PAGES_BASE_PATH='/Restaurant-Familie-Dang/'` trước khi chạy build. `npm run dev` vẫn dùng URL gốc như trước.

Bản build nằm trong `dist/`; không cần commit thư mục này. GitHub Actions upload nguyên thư mục làm Pages artifact. Các mục nội dung/pháp lý đang chờ chủ quán xác minh vẫn được ghi trong `CONTENT_REVIEW.md` và hiển thị rõ ở trang pháp lý.
