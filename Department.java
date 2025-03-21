package StudentManagement;

public class Department {
    private String code;
    private String displayName;

    public Department(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Department that = (Department) obj;
        return code.equals(that.code);
    }
    
    @Override
    public String toString() {
        return code + "," + displayName;
    }
}