package StudentManagement;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.lang.reflect.Type;
import java.io.OutputStreamWriter;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.FileInputStream;

public class StudentManagementSystem {
    // Danh sách lưu trữ sinh viên
    private static List<Student> studentList = new ArrayList<>();

    //Danh sách lưu trữ khoa
    private static List<Department> departmentList = new ArrayList<>();

    // Lấy danh sách khoa lên từ Department.txt
    private static void loadDepartmentsFromFile() {
        departmentList.clear();
        try (BufferedReader reader = new BufferedReader(new FileReader("Department.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length == 2) {
                    Department department = new Department(data[0].trim(), data[1].trim());
                    departmentList.add(department);
                }
            }
            
            // Nếu file trống hoặc không tồn tại, tạo danh sách mặc định
            if (departmentList.isEmpty()) {
                departmentList.add(new Department("LAW", "Khoa Luật"));
                departmentList.add(new Department("BUSINESS_ENGLISH", "Khoa Tiếng Anh thương mại"));
                departmentList.add(new Department("JAPANESE", "Khoa Tiếng Nhật"));
                departmentList.add(new Department("FRENCH", "Khoa Tiếng Pháp"));
                saveDepartmentsToFile();
            }
        } catch (IOException e) {
            System.out.println("Lỗi khi đọc tệp tin Department.txt: " + e.getMessage());
            // Tạo danh sách mặc định nếu có lỗi
            departmentList.add(new Department("LAW", "Khoa Luật"));
            departmentList.add(new Department("BUSINESS_ENGLISH", "Khoa Tiếng Anh thương mại"));
            departmentList.add(new Department("JAPANESE", "Khoa Tiếng Nhật"));
            departmentList.add(new Department("FRENCH", "Khoa Tiếng Pháp"));
            saveDepartmentsToFile();
        }
    }

    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        loadDepartmentsFromFile();
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
                    editDepartment();
                    break;
                case 6:
                    editStudentStatus();
                    break;
                case 7:
                    editProgram();
                    break;
                case 8:
                    handleImportExport();
                    break;
                case 9:
                    System.out.println("Thoát chương trình.");
                    break;
                default:
                    System.out.println("Chọn không hợp lệ. Vui lòng thử lại.");
            }
        } while (choice != 9);
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
        System.out.println("8. Import/Export dữ liệu");
        System.out.println("9. Thoát");
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
                        .setDepartment(findDepartmentByCode(data[4]))
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
                        student.getDepartment().getCode(),
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

        Department department = selectDepartment();

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
                student.setDepartment(selectDepartment());
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
                
            case 3: //Tìm theo khoa
                Department department = selectDepartment();
                for (Student s : studentList) {
                    if (s.getDepartment() == department) {
                        results.add(s);
                    }
                }
                break;
                
            case 4: // tìm theo khoa + tên
                department = selectDepartment();
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

    private static void editDepartment(){
        System.out.println("\nChỉnh sửa thông tin khoa:");
        System.out.println("1. Thêm khoa mới");
        System.out.println("2. Đổi tên khoa");
        System.out.print("Chọn chức năng: ");
        
        int choice;
        try {
            choice = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Lựa chọn không hợp lệ.");
            return;
        }

        switch (choice) {
            case 1:
                addNewDepartment();
                break;
            case 2:
                renameDepartment();
                break;
            default:
                System.out.println("Lựa chọn không hợp lệ.");
        }
    }

    // Lưu danh sách khoa xuống file
    private static void saveDepartmentsToFile() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("Department.txt", false))) {
            for (Department dept : departmentList) {
                writer.write(dept.toString());
                writer.newLine();
            }
            System.out.println("Lưu thông tin khoa thành công!");
        } catch (IOException e) {
            System.out.println("Lỗi khi ghi file Department.txt: " + e.getMessage());
        }
    }

    // Thêm khoa mới
    private static void addNewDepartment() {
        System.out.print("Nhập mã khoa (viết liền, không dấu): ");
        String deptCode = scanner.nextLine().toUpperCase();
        
        for (Department dept : departmentList) {
            if (dept.getCode().equals(deptCode)) {
                System.out.println("Mã khoa đã tồn tại!");
                return;
            }
        }

        System.out.print("Nhập tên khoa: ");
        String deptName = scanner.nextLine();

        Department newDept = new Department(deptCode, deptName);
        departmentList.add(newDept);
        saveDepartmentsToFile();
        System.out.println("Thêm khoa mới thành công!");
    }

    // Đổi tên khoa
    private static void renameDepartment() {
        System.out.println("Chọn khoa cần đổi tên:");
        Department dept = selectDepartment();
        if (dept != null) {
            System.out.print("Nhập tên mới cho khoa: ");
            String newName = scanner.nextLine();
            dept.setDisplayName(newName);
            saveDepartmentsToFile();
            System.out.println("Đổi tên khoa thành công!");
        }
    }

    // Chọn khoa từ danh sách
    private static Department selectDepartment() {
        System.out.println("Chọn khoa:");
        int index = 1;
        for (Department dept : departmentList) {
            System.out.println(index + ". " + dept.getDisplayName());
            index++;
        }
        
        int choice;
        try {
            choice = Integer.parseInt(scanner.nextLine());
            if (choice >= 1 && choice <= departmentList.size()) {
                return departmentList.get(choice - 1);
            } else {
                System.out.println("Lựa chọn không hợp lệ, đặt mặc định là khoa đầu tiên.");
                return departmentList.isEmpty() ? new Department("LAW", "Khoa Luật") : departmentList.get(0);
            }
        } catch (NumberFormatException e) {
            System.out.println("Lựa chọn không hợp lệ, đặt mặc định là khoa đầu tiên.");
            return departmentList.isEmpty() ? new Department("LAW", "Khoa Luật") : departmentList.get(0);
        }
    }

    // Tìm khoa theo mã
    private static Department findDepartmentByCode(String code) {
        for (Department dept : departmentList) {
            if (dept.getCode().equals(code)) {
                return dept;
            }
        }
        return departmentList.isEmpty() ? new Department("LAW", "Khoa Luật") : departmentList.get(0);
    }

    private static void handleImportExport() {
        System.out.println("\n------ Import/Export dữ liệu --------");
        System.out.println("1. Export sang CSV");
        System.out.println("2. Import từ CSV");
        System.out.println("3. Export sang JSON");
        System.out.println("4. Import từ JSON");
        System.out.println("5. Quay lại");
        System.out.print("Chọn chức năng: ");

        int choice;
        try {
            choice = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Lựa chọn không hợp lệ.");
            return;
        }

        switch (choice) {
            case 1:
                exportToCSV();
                break;
            case 2:
                importFromCSV();
                break;
            case 3:
                exportToJSON();
                break;
            case 4:
                importFromJSON();
                break;
            case 5:
                return;
            default:
                System.out.println("Lựa chọn không hợp lệ.");
        }
    }

    private static void exportToCSV() {
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(new FileOutputStream("students_export.csv"), "UTF-8"))) {
            // Ghi header
            writer.write("MSSV,Họ tên,Ngày sinh,Giới tính,Khoa,Năm học,Chương trình,Email,Số điện thoại," +
                    "Địa chỉ thường trú,Địa chỉ tạm trú,Địa chỉ nhận thư,Tình trạng,Giấy tờ tùy thân,Quốc tịch");
            writer.newLine();

            // Ghi dữ liệu
            for (Student student : studentList) {
                writer.write(String.join(",",
                        student.getId(),
                        student.getName(),
                        student.getDob(),
                        String.valueOf(student.isGender()),
                        student.getDepartment().getCode(),
                        String.valueOf(student.getSchoolYear()),
                        student.getProgram(),
                        student.getEmail(),
                        student.getPhone(),
                        formatAddress(student.getPermanentAddress()).replace(",", ";"),
                        formatAddress(student.getTemporaryAddress()).replace(",", ";"),
                        formatAddress(student.getMailingAddress()).replace(",", ";"),
                        student.getStatus().name(),
                        student.getIdentityDocument().toString().replace(",", ";"),
                        student.getNationality()));
                writer.newLine();
            }
            System.out.println("Xuất dữ liệu CSV thành công vào file students_export.csv!");
        } catch (IOException e) {
            System.out.println("Lỗi khi xuất file CSV: " + e.getMessage());
        }
    }

    private static void importFromCSV() {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new FileInputStream("students_import.csv"), "UTF-8"))) {
            String line = reader.readLine(); // Bỏ qua header
            if (line == null) {
                System.out.println("File CSV trống!");
                return;
            }

            List<Student> tempList = new ArrayList<>(); // Danh sách tạm để lưu sinh viên
            int lineNumber = 1; // Đếm số dòng để báo lỗi chính xác
            
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                try {
                    String[] data = line.split(",");
                    if (data.length < 15) {
                        System.out.println("Lỗi ở dòng " + lineNumber + ": Thiếu thông tin (cần 15 trường dữ liệu)");
                        continue;
                    }

                    // Kiểm tra và xử lý dữ liệu trống
                    for (int i = 0; i < data.length; i++) {
                        data[i] = data[i].trim();
                        if (data[i].isEmpty()) {
                            System.out.println("Lỗi ở dòng " + lineNumber + ": Trường dữ liệu thứ " + (i + 1) + " trống");
                            continue;
                        }
                    }

                    // Xử lý địa chỉ
                    String[] permAddr = data[9].split(";");
                    String[] tempAddr = data[10].split(";");
                    String[] mailAddr = data[11].split(";");
                    
                    Address permanentAddress = new Address(
                            permAddr.length > 0 ? permAddr[0] : "",
                            permAddr.length > 1 ? permAddr[1] : "",
                            permAddr.length > 2 ? permAddr[2] : "",
                            permAddr.length > 3 ? permAddr[3] : "",
                            permAddr.length > 4 ? permAddr[4] : "");
                    
                    Address temporaryAddress = new Address(
                            tempAddr.length > 0 ? tempAddr[0] : "",
                            tempAddr.length > 1 ? tempAddr[1] : "",
                            tempAddr.length > 2 ? tempAddr[2] : "",
                            tempAddr.length > 3 ? tempAddr[3] : "",
                            tempAddr.length > 4 ? tempAddr[4] : "");
                    
                    Address mailingAddress = new Address(
                            mailAddr.length > 0 ? mailAddr[0] : "",
                            mailAddr.length > 1 ? mailAddr[1] : "",
                            mailAddr.length > 2 ? mailAddr[2] : "",
                            mailAddr.length > 3 ? mailAddr[3] : "",
                            mailAddr.length > 4 ? mailAddr[4] : "");

                    // Xử lý giấy tờ tùy thân
                    String[] identityDoc = data[13].split(";");
                    if (identityDoc.length < 6) {
                        System.out.println("Lỗi ở dòng " + lineNumber + ": Thiếu thông tin giấy tờ tùy thân");
                        continue;
                    }

                    IdentityDocument identityDocument = new IdentityDocument(
                            identityDoc[0],
                            identityDoc[1],
                            identityDoc[2],
                            identityDoc[3],
                            identityDoc[4],
                            identityDoc[5]);

                    // Kiểm tra khoa có tồn tại
                    Department department = findDepartmentByCode(data[4]);
                    if (department == null) {
                        System.out.println("Lỗi ở dòng " + lineNumber + ": Không tìm thấy khoa với mã " + data[4]);
                        continue;
                    }

                    // Kiểm tra năm học
                    int schoolYear;
                    try {
                        schoolYear = Integer.parseInt(data[5]);
                        if (schoolYear <= 0) {
                            System.out.println("Lỗi ở dòng " + lineNumber + ": Năm học không hợp lệ");
                            continue;
                        }
                    } catch (NumberFormatException e) {
                        System.out.println("Lỗi ở dòng " + lineNumber + ": Năm học phải là số");
                        continue;
                    }

                    try {
                        Student student = new Student.StudentBuilder()
                                .setId(data[0])
                                .setName(data[1])
                                .setDob(data[2])
                                .setGender(Boolean.parseBoolean(data[3]))
                                .setDepartment(department)
                                .setSchoolYear(schoolYear)
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
                        
                        tempList.add(student);
                    } catch (IllegalArgumentException e) {
                        System.out.println("Lỗi ở dòng " + lineNumber + ": " + e.getMessage());
                    }
                } catch (Exception e) {
                    System.out.println("Lỗi ở dòng " + lineNumber + ": " + e.getMessage());
                }
            }

            if (!tempList.isEmpty()) {
                studentList.clear();
                studentList.addAll(tempList);
                saveStudentsToFile();
                System.out.println("Đã nhập thành công " + tempList.size() + " sinh viên từ file CSV!");
            } else {
                System.out.println("Không có dữ liệu hợp lệ để import!");
            }
        } catch (IOException e) {
            System.out.println("Lỗi khi đọc file CSV: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Lỗi không xác định: " + e.getMessage());
        }
    }

    private static void exportToJSON() {
        
    }

    private static void importFromJSON() {

    }
}