package StudentManagement;


public enum StudentStatus {
    STUDYING("Đang học"),
    GRADUATED("Đã tốt nghiệp"),
    DROPPED_OUT("Đã thôi học"),
    TEMPORARY_STOP("Tạm dừng học");

    private final String displayName;

    StudentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}