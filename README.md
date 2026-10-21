# Restaurant Familie Dang

Website bằng tiếng Đức, React + Vite + TypeScript. Thiết kế tái dựng theo một blueprint duy nhất: Cây Tre, London. Menu lấy đầy đủ từ PDF khách cung cấp; địa chỉ và giờ mở cửa theo Word.

## Chạy dự án

Cần Node.js 22 trở lên.

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị, mặc định http://localhost:5173. Build và xem bản production:

```bash
npm run build
npm run preview
```

## Chỉnh sửa

- `src/data/restaurant.json`: tên, địa chỉ, số điện thoại, giờ mở cửa, liên kết bản đồ. Khi thay đổi thông tin này, cập nhật metadata/schema trong `index.html` và nội dung footer tương ứng.
- `src/data/menu.json`: toàn bộ món và biến thể. `priceCents` là giá integer cent; `priceOriginal` bảo toàn giá nguồn. Không nhập float để tính tiền.
- `src/sections/Landing.tsx`: nội dung homepage và lựa chọn ảnh.
- `src/sections/Menu.tsx`: danh mục, tìm kiếm và danh sách món.
- `src/components/DishDialog.tsx`: chọn biến thể, món thêm, dung tích và tùy chọn đồ uống.
- `src/lib/cart.ts`, `src/hooks/useCart.ts`: tính giá và lưu giỏ hàng.
- `src/components/CartDrawer.tsx`: sao chép đơn và gọi điện.
- `src/components/Legal.tsx`: các trang pháp lý đang chờ thông tin chủ quán.
- `src/styles.css`: bố cục gốc; `src/brand.css`: màu nâu/vàng, chữ lớn theo menu và responsive; `src/fonts.css`: Saira tự host.
- `public/images/`: WebP từ menu được cung cấp; `research/asset-manifest.json`: nguồn trang và mã ảnh trong PDF.

Bộ dữ liệu có **185 mục đánh số + 6 extras = 191 mục**, **318 lựa chọn có giá**, **29 danh mục**. Khoảng trống số món và các lỗi chữ của menu gốc được bảo toàn. `sourcePage` và `sourceText` giúp đối chiếu. Những ký hiệu dị ứng chưa chắc chắn có trong `MENU_REVIEW.md`.

Khách đặt món qua WhatsApp số **+49 176 87889979**, được chủ website xác nhận ngày 21/10/2026. Nút trong giỏ hàng mở WhatsApp với đầy đủ món, biến thể, extras, số lượng và tổng tiền; khách cần bấm Gửi và chờ quán xác nhận. Có nút sao chép và gọi điện dự phòng. Website không thu tiền, tự gửi tin nhắn, hứa giao hàng/nhận tại quán hoặc báo thành công giả. Số WhatsApp cấu hình trong `src/data/restaurant.json`; nội dung đơn và URL nằm trong `src/lib/cart.ts`.

## Kiểm tra

```bash
npm run test:menu
npm run test:cart
npx playwright install chromium
npm run dev
# trong terminal khác:
npm run test:browser
npm run test:responsive
```

`test:menu` kiểm tra đầy đủ mã món, từng giá theo sourceText và toàn bộ giá trích từ PDF. `test:cart` kiểm tra tính giá, biến thể, extras, tùy chọn đồ uống, gộp dòng và dữ liệu localStorage bị lỗi/sửa giá. Browser QA lưu ảnh và kết quả trong `qa/`.

Có thể đặt `QA_BASE_URL`, `CHROMIUM_EXECUTABLE`, `PLAYWRIGHT_MODULE` để dùng một bản preview production hoặc browser có sẵn. Các script browser dùng `localhost:5173` nếu không đặt URL. Các script trích xuất/chuẩn bị tài liệu cần Python có PyMuPDF + Pillow; chúng không cần để chạy website. `research/menu-columns.txt` đã được lưu để đối chiếu giá mà không cài Python.

## Triển khai

- Vercel: import thư mục/repository, preset Vite, command `npm run build`, output `dist`. `vercel.json` hỗ trợ `/impressum`, `/datenschutz`.
- Netlify: command `npm run build`, publish `dist`; `netlify.toml` và `public/_redirects` có sẵn.
- Hosting tĩnh khác: dùng `dist`, cấu hình fallback HTML cho hai route pháp lý.

Chưa triển khai public. Hoàn thiện thông tin chủ quán, pháp lý, ký hiệu dị ứng, quyền ảnh và domain cuối theo `CONTENT_REVIEW.md` trước khi xuất bản. Với domain thật, thêm canonical, `og:url` và đổi `og:image` thành URL tuyệt đối. Google Maps chỉ là liên kết ngoài, không có iframe hoặc tracking tự tải.

## Hồ sơ bàn giao

- `DESIGN_REFERENCE.md`: nghiên cứu, blueprint, mapping và so sánh ảnh.
- `MENU_REVIEW.md`: điểm chưa rõ trong tài liệu menu.
- `CONTENT_REVIEW.md`: thông tin cần chủ quán xác minh/bổ sung.
- `QA_REPORT.md`: kiểm thử và giới hạn.
- `research/`: ảnh chụp mẫu, tài liệu trích xuất và nguồn asset.
- `qa/`: ảnh chụp website và kết quả kiểm tra.

Font Saira khớp font trong PDF menu, có SIL Open Font License kèm trong `public/fonts/`. Ba ảnh sushi mới được khách cung cấp ngày 15/10/2026; nguồn và vị trí có trong `research/CLIENT_ASSETS_2026-10-15.md`. Không sử dụng hình ảnh, logo hoặc source code của website tham khảo.
"# Restaurant-Familie-Dang" 
