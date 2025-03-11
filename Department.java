package StudentManagement;

public enum Department{
    LAW("Khoa Luật"),
    BUSINESS_ENGLISH("Khoa Tiếng Anh thương mại"),
    JAPANESE("Khoa Tiếng Nhật"),
    FRENCH("Khoa Tiếng Pháp");

    private final String displayName;

    Department(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}