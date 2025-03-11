package StudentManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class StudentManagementSystem {
    // Danh sách lưu trữ sinh viên
    private static List<Student> studentList = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        int choice;
        do {
            showMenu();
            try {
                choice = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                choice = -1;
            }
            switch (choice) {
                case 1:
                    addStudent();
                    break;
                case 2:
                    removeStudent();
                    break;
                case 3:
                    updateStudent();
                    break;
                case 4:
                    searchStudent();
                    break;
                case 5:
                    System.out.println("Thoát chương trình.");
                    break;
                default:
                    System.out.println("Chọn không hợp lệ. Vui lòng thử lại.");
            }
        } while (choice != 5);
    }

    private static void showMenu() {
        System.out.println("\n=== Hệ thống quản lý sinh viên ===");
        System.out.println("1. Thêm sinh viên mới");
        System.out.println("2. Xóa sinh viên");
        System.out.println("3. Cập nhật thông tin sinh viên");
        System.out.println("4. Tìm kiếm sinh viên");
        System.out.println("5. Thoát");
        System.out.print("Chọn chức năng: ");
    }

    // 1. Thêm sinh viên mới
    private static void addStudent() {
        System.out.println("\nNhập thông tin sinh viên mới:");
        System.out.print("Mã số sinh viên: ");
        String id = scanner.nextLine();

        System.out.print("Họ tên: ");
        String name = scanner.nextLine();

        System.out.print("Ngày sinh (dd/MM/yyyy): ");
        String dob = scanner.nextLine();

        System.out.print("Giới tính (true: nam, false: nữ): ");
        boolean gender = Boolean.parseBoolean(scanner.nextLine());

        System.out.println("Chọn khoa:");
        System.out.println("1. Khoa Luật");
        System.out.println("2. Khoa Tiếng Anh thương mại");
        System.out.println("3. Khoa Tiếng Nhật");
        System.out.println("4. Khoa Tiếng Pháp");
        int deptChoice = Integer.parseInt(scanner.nextLine());
        Department department;
        switch (deptChoice) {
            case 1:
                department = Department.LAW;
                break;
            case 2:
                department = Department.BUSINESS_ENGLISH;
                break;
            case 3:
                department = Department.JAPANESE;
                break;
            case 4:
                department = Department.FRENCH;
                break;
            default:
                System.out.println("Lựa chọn không hợp lệ, đặt mặc định Khoa Luật.");
                department = Department.LAW;
        }

        System.out.print("Năm học: ");
        int schoolYear = Integer.parseInt(scanner.nextLine());

        System.out.print("Chương trình đào tạo: ");
        String program = scanner.nextLine();

        System.out.print("Email: ");
        String email = scanner.nextLine();

        System.out.print("Số điện thoại: ");
        String phone = scanner.nextLine();

        System.out.print("Địa chỉ: ");
        String address = scanner.nextLine();

        System.out.println("Chọn tình trạng sinh viên:");
        System.out.println("1. Đang học");
        System.out.println("2. Đã tốt nghiệp");
        System.out.println("3. Đã thôi học");
        System.out.println("4. Tạm dừng học");
        int statusChoice = Integer.parseInt(scanner.nextLine());
        StudentStatus status;
        switch (statusChoice) {
            case 1:
                status = StudentStatus.STUDYING;
                break;
            case 2:
                status = StudentStatus.GRADUATED;
                break;
            case 3:
                status = StudentStatus.DROPPED_OUT;
                break;
            case 4:
                status = StudentStatus.TEMPORARY_STOP;
                break;
            default:
                System.out.println("Lựa chọn không hợp lệ, đặt mặc định Đang học.");
                status = StudentStatus.STUDYING;
        }

        try {
            Student student = new Student.StudentBuilder()
                    .setId(id)
                    .setName(name)
                    .setDob(dob)
                    .setGender(gender)
                    .setDepartment(department)
                    .setSchoolYear(schoolYear)
                    .setProgram(program)
                    .setEmail(email)
                    .setPhone(phone)
                    .setAddress(address)
                    .setStatus(status)
                    .build();
            studentList.add(student);
            System.out.println("Thêm sinh viên thành công!");
        } catch (IllegalArgumentException e) {
            System.out.println("Lỗi khi thêm sinh viên: " + e.getMessage());
        }
    }

    // 2. Xóa sinh viên dựa trên MSSV
    private static void removeStudent() {
        System.out.print("\nNhập mã số sinh viên cần xóa: ");
        String id = scanner.nextLine();
        boolean removed = studentList.removeIf(s -> s.getId().equals(id));
        if (removed) {
            System.out.println("Xóa sinh viên thành công!");
        } else {
            System.out.println("Không tìm thấy sinh viên với mã số " + id);
        }
    }

    // 3. Cập nhật thông tin sinh viên dựa trên MSSV
    private static void updateStudent() {
        System.out.print("\nNhập mã số sinh viên cần cập nhật: ");
        String id = scanner.nextLine();
        Student student = null;
        for (Student s : studentList) {
            if (s.getId().equals(id)) {
                student = s;
                break;
            }
        }
        if (student == null) {
            System.out.println("Không tìm thấy sinh viên với mã số " + id);
            return;
        }

        System.out.println("Chọn thông tin cần cập nhật:");
        System.out.println("1. Họ tên");
        System.out.println("2. Ngày sinh");
        System.out.println("3. Giới tính");
        System.out.println("4. Khoa");
        System.out.println("5. Năm học");
        System.out.println("6. Chương trình đào tạo");
        System.out.println("7. Email");
        System.out.println("8. Số điện thoại");
        System.out.println("9. Địa chỉ");
        System.out.println("10. Tình trạng sinh viên");
        System.out.print("Chọn: ");
        int updateChoice = Integer.parseInt(scanner.nextLine());
        switch (updateChoice) {
            case 1:
                System.out.print("Nhập họ tên mới: ");
                student.setName(scanner.nextLine());
                break;
            case 2:
                System.out.print("Nhập ngày sinh mới (dd/MM/yyyy): ");
                student.setDob(scanner.nextLine());
                break;
            case 3:
                System.out.print("Nhập giới tính (true: nam, false: nữ): ");
                student.setGender(Boolean.parseBoolean(scanner.nextLine()));
                break;
            case 4:
                System.out.println("Chọn khoa:");
                System.out.println("1. Khoa Luật");
                System.out.println("2. Khoa Tiếng Anh thương mại");
                System.out.println("3. Khoa Tiếng Nhật");
                System.out.println("4. Khoa Tiếng Pháp");
                int deptChoice = Integer.parseInt(scanner.nextLine());
                switch (deptChoice) {
                    case 1:
                        student.setDepartment(Department.LAW);
                        break;
                    case 2:
                        student.setDepartment(Department.BUSINESS_ENGLISH);
                        break;
                    case 3:
                        student.setDepartment(Department.JAPANESE);
                        break;
                    case 4:
                        student.setDepartment(Department.FRENCH);
                        break;
                    default:
                        System.out.println("Lựa chọn không hợp lệ.");
                }
                break;
            case 5:
                System.out.print("Nhập năm học mới: ");
                student.setSchoolYear(Integer.parseInt(scanner.nextLine()));
                break;
            case 6:
                System.out.print("Nhập chương trình đào tạo mới: ");
                student.setProgram(scanner.nextLine());
                break;
            case 7:
                System.out.print("Nhập email mới: ");
                try {
                    student.setEmail(scanner.nextLine());
                } catch (IllegalArgumentException e) {
                    System.out.println("Email không hợp lệ: " + e.getMessage());
                }
                break;
            case 8:
                System.out.print("Nhập số điện thoại mới: ");
                try {
                    student.setPhone(scanner.nextLine());
                } catch (IllegalArgumentException e) {
                    System.out.println("Số điện thoại không hợp lệ: " + e.getMessage());
                }
                break;
            case 9:
                System.out.print("Nhập địa chỉ mới: ");
                student.setAddress(scanner.nextLine());
                break;
            case 10:
                System.out.println("Chọn tình trạng sinh viên:");
                System.out.println("1. Đang học");
                System.out.println("2. Đã tốt nghiệp");
                System.out.println("3. Đã thôi học");
                System.out.println("4. Tạm dừng học");
                int statusChoice = Integer.parseInt(scanner.nextLine());
                switch (statusChoice) {
                    case 1:
                        student.setStatus(StudentStatus.STUDYING);
                        break;
                    case 2:
                        student.setStatus(StudentStatus.GRADUATED);
                        break;
                    case 3:
                        student.setStatus(StudentStatus.DROPPED_OUT);
                        break;
                    case 4:
                        student.setStatus(StudentStatus.TEMPORARY_STOP);
                        break;
                    default:
                        System.out.println("Lựa chọn không hợp lệ.");
                }
                break;
            default:
                System.out.println("Lựa chọn không hợp lệ.");
        }
        System.out.println("Cập nhật thông tin sinh viên thành công!");
    }

    // 4. Tìm kiếm sinh viên theo MSSV hoặc Họ tên
    private static void searchStudent() {
        System.out.println("\nTìm kiếm sinh viên theo:");
        System.out.println("1. Mã số sinh viên");
        System.out.println("2. Họ tên");
        System.out.print("Chọn: ");
        int searchChoice = Integer.parseInt(scanner.nextLine());
        System.out.print("Nhập từ khóa: ");
        String keyword = scanner.nextLine().toLowerCase();
        List<Student> results = new ArrayList<>();
        for (Student s : studentList) {
            if (searchChoice == 1) {
                if (s.getId().toLowerCase().contains(keyword)) {
                    results.add(s);
                }
            } else if (searchChoice == 2) {
                if (s.getName().toLowerCase().contains(keyword)) {
                    results.add(s);
                }
            }
        }
        if (results.isEmpty()) {
            System.out.println("Không tìm thấy sinh viên nào.");
        } else {
            System.out.println("Kết quả tìm kiếm:");
            for (Student s : results) {
                System.out.println(s);
            }
        }
    }
}
