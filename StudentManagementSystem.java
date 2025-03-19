package StudentManagement;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class StudentManagementSystem {
    // Danh sách lưu trữ sinh viên
    private static List<Student> studentList = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        loadStudentsFromFile();
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

    // Lấy danh sách sinh viên lên từ students.txt
    private static void loadStudentsFromFile() {
        try (BufferedReader reader = new BufferedReader(new FileReader("students.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(";");
                String[] permAddr = data[9].split(",");
                String[] tempAddr = data[10].split(",");
                String[] mailAddr = data[11].split(",");
                Address permanentAddress = new Address(
                    permAddr.length > 0 ? permAddr[0] : null,
                    permAddr.length > 1 ? permAddr[1] : null,
                    permAddr.length > 2 ? permAddr[2] : null,
                    permAddr.length > 3 ? permAddr[3] : null,
                    permAddr.length > 4 ? permAddr[4] : null
                );
                Address temporaryAddress = new Address(
                    tempAddr.length > 0 ? tempAddr[0] : null,
                    tempAddr.length > 1 ? tempAddr[1] : null,
                    tempAddr.length > 2 ? tempAddr[2] : null,
                    tempAddr.length > 3 ? tempAddr[3] : null,
                    tempAddr.length > 4 ? tempAddr[4] : null
                );
                Address mailingAddress = new Address(
                    mailAddr.length > 0 ? mailAddr[0] : null,
                    mailAddr.length > 1 ? mailAddr[1] : null,
                    mailAddr.length > 2 ? mailAddr[2] : null,
                    mailAddr.length > 3 ? mailAddr[3] : null,
                    mailAddr.length > 4 ? mailAddr[4] : null
                );
                Student student = new Student.StudentBuilder()
                        .setId(data[0])
                        .setName(data[1])
                        .setDob(data[2])
                        .setGender(Boolean.parseBoolean(data[3]))
                        .setDepartment(Department.valueOf(data[4]))
                        .setSchoolYear(Integer.parseInt(data[5]))
                        .setProgram(data[6])
                        .setEmail(data[7])
                        .setPhone(data[8])
                        .setPermanentAddress(permanentAddress)
                        .setTemporaryAddress(temporaryAddress)
                        .setMailingAddress(mailingAddress)
                        .setStatus(StudentStatus.valueOf(data[12]))
                        .build();
                studentList.add(student);
            }
        } catch (IOException e) {
            System.out.println("Lỗi khi đọc tệp tin: " + e.getMessage());
        }
    }

    // Định dạng địa chỉ thành chuỗi
    private static String formatAddress(Address address) {
        return String.join(",", 
            address.getStreet(), 
            address.getWard(), 
            address.getDistrict(), 
            address.getCity(), 
            address.getCountry()
        );
    }
    

    // Lưu danh sách xuống file
    private static void saveStudentsToFile() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("students.txt"))) {
            for (Student student : studentList) {
                writer.write(String.join(";",
                        student.getId(),
                        student.getName(),
                        student.getDob(),
                        String.valueOf(student.isGender()),
                        student.getDepartment().name(),
                        String.valueOf(student.getSchoolYear()),
                        student.getProgram(),
                        student.getEmail(),
                        student.getPhone(),
                        formatAddress(student.getPermanentAddress()),
                        formatAddress(student.getTemporaryAddress()),
                        formatAddress(student.getMailingAddress()),
                        student.getStatus().name()));
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("Lỗi khi ghi tệp tin: " + e.getMessage());
        }
    }

    // Nhập địa chỉ từ bàn phím
    private static Address inputAddress() {
        System.out.print("Nhập tên đường: ");
        String street = scanner.nextLine();
        System.out.print("Nhập phường/xã: ");
        String ward = scanner.nextLine();
        System.out.print("Nhập quận/huyện: ");
        String district = scanner.nextLine();
        System.out.print("Nhập thành phố: ");
        String city = scanner.nextLine();
        System.out.print("Nhập quốc gia: ");
        String country = scanner.nextLine();
        return new Address(street, ward, district, city, country);
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

        System.out.print("Địa chỉ thường trú: ");
        Address permanentAddress = inputAddress();

        System.out.println("Địa chỉ tạm trú: ");
        Address temporaryAddress = inputAddress();

        System.out.println("Địa chỉ nhận thư: ");
        Address mailingAddress = inputAddress();

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
                    .setAddress(permanentAddress)
                    .setTemporaryAddress(temporaryAddress)
                    .setMailingAddress(mailingAddress)
                    .setStatus(status)
                    .build();
            studentList.add(student);
            saveStudentsToFile(); // Lưu danh sách sinh viên xuống file
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
            saveStudentsToFile();// Lưu danh sách sinh viên xuống file
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
        System.out.println("9. Địa chỉ thường trú");
        System.out.println("10. Địa chỉ tạm trú");
        System.out.println("11. Địa chỉ nhận thư");
        System.out.println("12. Tình trạng sinh viên");
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
                student.setAddress();
                break;
            case 10:
                System.out.print("Nhập địa chỉ tạm trú mới: ");
                student.setTemporaryAddress(scanner.nextLine());
                break;
            case 11:
                System.out.print("Nhập địa chỉ gửi thư mới: ");
                student.setMailingAddress(scanner.nextLine());
                break;
            case 12:
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
        saveStudentsToFile(); // Lưu danh sách sau khi cập nhật
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
