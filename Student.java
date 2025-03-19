package StudentManagement;

public class Student {
    private String id;
    private String name;
    private String dob;
    private boolean gender;
    private Department department;
    private int schoolYear;
    private String program;
    private String email;
    private String phone;
    private Address permanentAddress;
    private Address temporaryAddress;
    private Address mailingAddress;
    private StudentStatus status;
    private IdentityDocument identityDocument;
    private String nationality;

    public Student(StudentBuilder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.dob = builder.dob;
        this.gender = builder.gender;
        this.department = builder.department;
        this.schoolYear = builder.schoolYear;
        this.program = builder.program;
        this.email = builder.email;
        this.phone = builder.phone;
        this.permanentAddress = builder.permanentAddress;
        this.temporaryAddress = builder.temporaryAddress;
        this.mailingAddress = builder.mailingAddress;
        this.status = builder.status;
        this.identityDocument = builder.identityDocument;
        this.nationality = builder.nationality;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDob() { return dob; }
    public boolean isGender() { return gender; }
    public Department getDepartment() { return department; }
    public int getSchoolYear() { return schoolYear; }
    public String getProgram() { return program; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public Address getPermanentAddress() { return permanentAddress; }
    public Address getTemporaryAddress() { return temporaryAddress; }
    public Address getMailingAddress() { return mailingAddress; }
    public StudentStatus getStatus() { return status; }
    public IdentityDocument getIdentityDocument() { return identityDocument; }
    public String getNationality() { return nationality; }
    
    public void setName(String name) {
        this.name = name;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public void setDepartment(Department department) {
        if (!Student.isDepartment(department)) {
            throw new IllegalArgumentException("Tên khoa không được để trống");
        }
        this.department = department;
    }

    public void setSchoolYear(int schoolYear) {
        this.schoolYear = schoolYear;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public void setEmail(String email) {
        if (!Student.isEmailAddress(email)) {
            throw new IllegalArgumentException("Định dạng email không hợp lệ");
        }
        this.email = email;
    }

    public void setPhone(String phone) {
        if (!Student.isPhone(phone)) {
            throw new IllegalArgumentException("Số điện thoại không hợp lệ");
        }
        this.phone = phone;
    }

    public void setPermanentAddress(Address PermanentAddress) {
        this.permanentAddress = PermanentAddress;
    }

    public void setTemporaryAddress(Address TemporaryAddress) {
        this.temporaryAddress = TemporaryAddress;
    }

    public void setMailingAddress(Address MailingAddress) {
        this.mailingAddress = MailingAddress;
    }

    public void setStatus(StudentStatus status) {
        if (!Student.isStatus(status)) {
            throw new IllegalArgumentException("Tình trạng sinh viên không được để trống");
        }
        this.status = status;
    }

    public void setIdentityDocument(IdentityDocument identityDocument) {
        this.identityDocument = identityDocument;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }
    
    private static boolean isEmailAddress(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }
    
    private static boolean isPhone(String phone) {
        return phone != null && phone.matches("^\\d{10,15}$");
    }
    
    private static boolean isDepartment(Department department) {
        return department != null;
    }
    
    private static boolean isStatus(StudentStatus status) {
        return status != null;
    }
    
    // Builder Pattern
    public static class StudentBuilder {
        private String id;
        private String name;
        private String dob;
        private boolean gender;
        private Department department;
        private int schoolYear;
        private String program;
        private String email;
        private String phone;
        private Address permanentAddress;
        private Address temporaryAddress;
        private Address mailingAddress;
        private StudentStatus status;
        private IdentityDocument identityDocument;
        private String nationality;

        public StudentBuilder setId(String id) {
            this.id = id;
            return this;
        }

        public StudentBuilder setName(String name) {
            this.name = name;
            return this;
        }

        public StudentBuilder setDob(String dob) {
            this.dob = dob;
            return this;
        }

        public StudentBuilder setGender(boolean gender) {
            this.gender = gender;
            return this;
        }

        public StudentBuilder setDepartment(Department department) {
            this.department = department;
            return this;
        }

        public StudentBuilder setSchoolYear(int schoolYear) {
            this.schoolYear = schoolYear;
            return this;
        }

        public StudentBuilder setProgram(String program) {
            this.program = program;
            return this;
        }

        public StudentBuilder setEmail(String email) {
            this.email = email;
            return this;
        }

        public StudentBuilder setPhone(String phone) {
            this.phone = phone;
            return this;
        }

        public StudentBuilder setPermanentAddress(Address permanentAddress) {
            this.permanentAddress = permanentAddress;
            return this;
        }

        public StudentBuilder setTemporaryAddress(Address temporaryAddress) {
            this.temporaryAddress = temporaryAddress;
            return this;
        }

        public StudentBuilder setMailingAddress(Address mailingAddress) {
            this.mailingAddress = mailingAddress;
            return this;
        }

        public StudentBuilder setStatus(StudentStatus status) {
            this.status = status;
            return this;
        }

        public StudentBuilder setIdentityDocument(IdentityDocument identityDocument) {
            this.identityDocument = identityDocument;
            return this;
        }

        public StudentBuilder setNationality(String nationality){
            this.nationality = nationality;
            return this;
        }

        public Student build() {
            if (!Student.isEmailAddress(this.email)) {
                throw new IllegalArgumentException("Định dạng email không hợp lệ");
            }
            if (!Student.isPhone(this.phone)) {
                throw new IllegalArgumentException("Số điện thoại không hợp lệ");
            }
            if (!Student.isDepartment(this.department)) {
                throw new IllegalArgumentException("Tên khoa không được để trống");
            }
            if (!Student.isStatus(this.status)) {
                throw new IllegalArgumentException("Tình trạng sinh viên không được để trống");
            }
            return new Student(this);
        }
    }

    @Override
    public String toString() {
        return "Student{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", dob='" + dob + '\'' +
                ", gender=" + (gender ? "Male" : "Female") +
                ", department=" + department.getDisplayName() +
                ", schoolYear=" + schoolYear +
                ", program='" + program + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", permanent address='" + permanentAddress + '\'' +
                ", temporaryAddress='" + temporaryAddress + '\'' +
                ", mailingAddress='" + mailingAddress + '\'' +
                ", status=" + status.getDisplayName() +
                ", identityDocument=" + identityDocument +
                ", nationality=" + nationality +
                '}';
    }

    
}
