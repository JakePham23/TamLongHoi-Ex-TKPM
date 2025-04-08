# 🧠 Git Guidelines – Commit & Branch Naming Conventions

Quy ước đặt tên nhánh và viết commit message giúp quản lý mã nguồn hiệu quả, dễ hiểu và dễ bảo trì.

---

## ✅ 1. Branch Naming – Đặt Tên Nhánh

### 🔧 Cấu trúc:

    <type>/<short-description>


### 📌 Các `type` phổ biến:

| Prefix       | Ý nghĩa                              |
|--------------|---------------------------------------|
| `feature/`   | Thêm tính năng mới                    |
| `fix/`       | Sửa lỗi                               |
| `hotfix/`    | Sửa lỗi khẩn cấp (production bug)     |
| `refactor/`  | Tối ưu code, không đổi logic          |
| `test/`      | Viết hoặc cập nhật test               |
| `docs/`      | Viết tài liệu                         |
| `chore/`     | Cấu hình, format, cập nhật thư viện... |

### 🧩 Ví dụ tên nhánh:
- `feature/add-student-form`
- `fix/login-bug`
- `refactor/teacher-schema`
- `docs/update-readme`
- `chore/setup-eslint`

---

## ✅ 2. Commit Message – Viết Commit Đúng Chuẩn

### 📐 Cấu trúc commit:

    <type>(optional-scope): <message>


### 📌 Các `type` phổ biến:

| Type         | Ý nghĩa                                 |
|--------------|------------------------------------------|
| `feat`       | Thêm tính năng mới                       |
| `fix`        | Sửa lỗi                                  |
| `docs`       | Tài liệu (README, swagger, comments...)  |
| `style`      | Sửa style code (format, dấu cách...)     |
| `refactor`   | Cải tiến code, không thay đổi hành vi    |
| `test`       | Thêm, sửa test                           |
| `chore`      | Cập nhật phụ trợ (deps, config...)       |

### ✨ Ví dụ commit tốt:

- `feat(course): add prerequisite validation`
- `feat(auth): add login page`
- `fix(auth): handle missing token`
- `refactor(student): split address to subfields`
- `docs: update API usage in README`
- `chore: update eslint config`




