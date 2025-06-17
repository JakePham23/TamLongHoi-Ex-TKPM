const removeVietnameseTones = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD") // Tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu thanh
    .replace(/đ/g, "d") // Chuyển đ → d
    .replace(/Đ/g, "D") // Chuyển Đ → D
    .toLowerCase();
};
export default removeVietnameseTones;
