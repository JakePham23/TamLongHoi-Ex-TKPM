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
                    break;
                case 6:
                    editStudentStatus();
                    break;
                case 7:
                    editProgram();
                    break;
                case 8:
                    System.out.println("Thoát chương trình.");
                    break;
                default:
                    System.out.println("Chọn không hợp lệ. Vui lòng thử lại.");
            }
        } while (choice != 8);
    }

    private static void showMenu() {
        System.out.println("\n=== Hệ thống quản lý sinh viên ===");
        System.out.println("1. Thêm sinh viên mới");
        System.out.println("2. Xóa sinh viên");
        System.out.println("3. Cập nhật thông tin sinh viên");
        System.out.println("4. Tìm kiếm sinh viên");
        System.out.println("5. Chỉnh sửa khoa");
        System.out.println("6. Chỉnh sửa tình trạng sinh viên");
        System.out.println("7. Chỉnh sửa chương trình");
        System.out.println("8. Thoát");
        System.out.print("Chọn chức năng: ");
    }

    // Lấy danh sách sinh viên lên từ students.txt
    private static void loadStudentsFromFile() {
        try (BufferedReader reader = new BufferedReader(new FileReader("students.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(";");

                // Tạo đối tượng Address cho địa chỉ thường trú, tạm trú, nhận thư
                String[] permAddr = data[9].split(",");
                String[] tempAddr = data[10].split(",");
                String[] mailAddr = data[11].split(",");
                Address permanentAddress = new Address(
                        permAddr.length > 0 ? permAddr[0] : null,
                        permAddr.length > 1 ? permAddr[1] : null,
                        permAddr.length > 2 ? permAddr[2] : null,
                        permAddr.length > 3 ? permAddr[3] : null,
                        permAddr.length > 4 ? permAddr[4] : null);
                Address temporaryAddress = new Address(
                        tempAddr.length > 0 ? tempAddr[0] : null,
                        tempAddr.length > 1 ? tempAddr[1] : null,
                        tempAddr.length > 2 ? tempAddr[2] : null,
                        tempAddr.length > 3 ? tempAddr[3] : null,
                        tempAddr.length > 4 ? tempAddr[4] : null);
                Address mailingAddress = new Address(
                        mailAddr.length > 0 ? mailAddr[0] : null,
                        mailAddr.length > 1 ? mailAddr[1] : null,
                        mailAddr.length > 2 ? mailAddr[2] : null,
                        mailAddr.length > 3 ? mailAddr[3] : null,
                        mailAddr.length > 4 ? mailAddr[4] : null);

                String[] identityDoc = data[13].split(",");
                if (identityDoc.length < 6) {
                    System.out.println(
                            "Dữ liệu IdentityDocument không hợp lệ, bỏ qua: " + String.join(",", identityDoc));
                    return;
                }

                IdentityDocument identityDocument = new IdentityDocument(
                        identityDoc[0], identityDoc[1], identityDoc[2], identityDoc[3], identityDoc[4], identityDoc[5]);

                if (identityDoc[0].equals("CCCD") && identityDoc.length > 6) {
                    identityDocument.setHasChip(Boolean.parseBoolean(identityDoc[6]));
                } else if (identityDoc[0].equals("Passport") && identityDoc.length > 6) {
                    identityDocument.setNotes(identityDoc[6]);
                }

                // Tạo đối tượng Student
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
                        .setIdentityDocument(identityDocument)
                        .setNationality(data[14])
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
                address.getCountry());
    }

    // Lưu danh sách xuống file
    private static void saveStudentsToFile() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("students.txt", false))) {
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
                        student.getStatus().name(),
                        student.getIdentityDocument().toString(),
                        student.getNationality()));

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

    // Nhập giấy tờ tùy thân từ bàn phím
    private static IdentityDocument inputIdentityDocument() {
        System.out.println("Chọn loại giấy tờ:");
        System.out.println("1. CMND");
        System.out.println("2. CCCD");
        System.out.println("3. Passport");
        int docTypeChoice = Integer.parseInt(scanner.nextLine());
        while (docTypeChoice < 1 || docTypeChoice > 3) {
            System.out.println("Lựa chọn không hợp lệ, vui lòng chọn lại.");
            docTypeChoice = Integer.parseInt(scanner.nextLine());
        }
        IdentityDocument identityDocument = null;
        switch (docTypeChoice) {
            case 1: {
                System.out.print("Nhập số CMND: ");
                String documentNumber = scanner.nextLine();
                System.out.print("Ngày cấp (dd/MM/yyyy): ");
                String issueDate = scanner.nextLine();
                System.out.print("Ngày hết hạn (dd/MM/yyyy): ");
                String expiryDate = scanner.nextLine();
                System.out.print("Nơi cấp: ");
                String issuePlace = scanner.nextLine();
                System.out.print("Quốc gia cấp: ");
                String issueCountry = scanner.nextLine();
                identityDocument = new IdentityDocument("CMND", documentNumber, issueDate, expiryDate, issuePlace, issueCountry);
                break;
            }
            case 2: {
                System.out.print("Nhập số CCCD: ");
                String documentNumber = scanner.nextLine();
                System.out.print("Ngày cấp (dd/MM/yyyy): ");
                String issueDate = scanner.nextLine();
                System.out.print("Ngày hết hạn (dd/MM/yyyy): ");
                String expiryDate = scanner.nextLine();
                System.out.print("Nơi cấp: ");
                String issuePlace = scanner.nextLine();
                System.out.print("Quốc gia cấp: ");
                String issueCountry = scanner.nextLine();
                System.out.print("Có gắn chip (true: có, false: không): ");
                boolean hasChip = Boolean.parseBoolean(scanner.nextLine());
                identityDocument = new IdentityDocument("CCCD", documentNumber, issueDate, expiryDate, issuePlace, issueCountry);
                identityDocument.setHasChip(hasChip);
                break;
            }
            case 3: {
                System.out.print("Nhập số Passport: ");
                String documentNumber = scanner.nextLine();
                System.out.print("Ngày cấp (dd/MM/yyyy): ");
                String issueDate = scanner.nextLine();
                System.out.print("Ngày hết hạn (dd/MM/yyyy): ");
                String expiryDate = scanner.nextLine();
                System.out.print("Nơi cấp: ");
                String issuePlace = scanner.nextLine();
                System.out.print("Quốc gia cấp: ");
                String issueCountry = scanner.nextLine();
                System.out.print("Ghi chú: ");
                String notes = scanner.nextLine();
                identityDocument = new IdentityDocument("Passport", documentNumber, issueDate, expiryDate, issuePlace, issueCountry);
                identityDocument.setNotes(notes);
                break;
            }
            default:
        }
        return identityDocument;
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

        IdentityDocument identityDocument = inputIdentityDocument();

        System.out.println("Quốc tịch: ");
        String nationality = scanner.nextLine();

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
                    .setPermanentAddress(permanentAddress)
                    .setTemporaryAddress(temporaryAddress)
                    .setMailingAddress(mailingAddress)
                    .setStatus(status)
                    .setIdentityDocument(identityDocument)
                    .setNationality(nationality)
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
        System.out.println("13. Giấy tờ tùy thân");
        System.out.println("14. Quốc tịch");
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
                System.out.print("Nhập địa chỉ thường trú mới: ");
                Address permanentAddress = inputAddress();
                student.setPermanentAddress(permanentAddress);
                break;
            case 10:
                System.out.print("Nhập địa chỉ tạm trú mới: ");
                Address temporaryAddress = inputAddress();
                student.setTemporaryAddress(temporaryAddress);
                break;
            case 11:
                System.out.print("Nhập địa chỉ gửi thư mới: ");
                Address mailingAddress = inputAddress();
                student.setMailingAddress(mailingAddress);
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
            case 13:
                IdentityDocument identityDocument = inputIdentityDocument();
                student.setIdentityDocument(identityDocument);
                break;
            case 14:
                System.out.print("Nhập quốc tịch mới: ");
                student.setNationality(scanner.nextLine());
                break;
            default:
                System.out.println("Lựa chọn không hợp lệ.");
        }
        saveStudentsToFile(); // Lưu danh sách sau khi cập nhật
        System.out.println("Cập nhật thông tin sinh viên thành công!");
    }

    // 4. Tìm kiếm sinh viên
    private static void searchStudent() {
        System.out.println("\nTìm kiếm sinh viên theo:");
        System.out.println("1. Mã số sinh viên");
        System.out.println("2. Họ tên");
        System.out.println("3. Khoa");
        System.out.println("4. Khoa + Họ tên");
        System.out.print("Chọn: ");
        int searchChoice = Integer.parseInt(scanner.nextLine());
        
        List<Student> results = new ArrayList<>();
        
        switch (searchChoice) { // tìm theo mssv
            case 1:
                System.out.print("Nhập mã số sinh viên: ");
                String id = scanner.nextLine().toLowerCase();
                for (Student s : studentList) {
                    if (s.getId().toLowerCase().contains(id)) {
                        results.add(s);
                    }
                }
                break;
                
            case 2: //tìm theo tên
                System.out.print("Nhập họ tên: ");
                String name = scanner.nextLine().toLowerCase();
                for (Student s : studentList) {
                    if (s.getName().toLowerCase().contains(name)) {
                        results.add(s);
                    }
                }
                break;
                
            case 3: //Timf theo khoa
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
                        System.out.println("Lựa chọn không hợp lệ.");
                        return;
                }
                for (Student s : studentList) {
                    if (s.getDepartment() == department) {
                        results.add(s);
                    }
                }
                break;
                
            case 4: // tìm theo khoa + tên
                System.out.println("Chọn khoa:");
                System.out.println("1. Khoa Luật");
                System.out.println("2. Khoa Tiếng Anh thương mại");
                System.out.println("3. Khoa Tiếng Nhật");
                System.out.println("4. Khoa Tiếng Pháp");
                deptChoice = Integer.parseInt(scanner.nextLine());
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
                        System.out.println("Lựa chọn không hợp lệ.");
                        return;
                }
                System.out.print("Nhập họ tên: ");
                name = scanner.nextLine().toLowerCase();
                for (Student s : studentList) {
                    if (s.getDepartment() == department && s.getName().toLowerCase().contains(name)) {
                        results.add(s);
                    }
                }
                break;
                
            default:
                System.out.println("Lựa chọn không hợp lệ.");
                return;
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
    
    private static void editProgram() {
        System.out.println("Nhập mã số sinh viên cần chỉnh sửa chương trình: ");
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
        System.out.println("Nhập chương trình mới: ");
        student.setProgram(scanner.nextLine());
        saveStudentsToFile();
        System.out.println("Chỉnh sửa chương trình học của sinh viên thành công!");
    }
    
    private static void editStudentStatus(){
        System.out.println("Nhập mã số sinh viên cần chỉnh sửa tình trạng: ");
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
        saveStudentsToFile();
        System.out.println("Chỉnh sửa tình trạng sinh viên thành công!");
    }
}