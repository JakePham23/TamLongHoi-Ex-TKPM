package StudentManagement;

public class IdentityDocument {
    private String documentType; // nhận 3 giá trị "CMND", "CCCD", "Passport"
    private String documentNumber;
    private String issueDate;
    private String expiryDate;
    private String issuePlace;
    private String issueCountry;
    private boolean hasChip; // Chỉ dùng cho CCCD
    private String notes; // Chỉ dùng cho Passport

    public IdentityDocument(String documentType, String documentNumber, String issueDate, 
                          String expiryDate, String issuePlace, String issueCountry) {
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.issuePlace = issuePlace;
        this.issueCountry = issueCountry;
    }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    
    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }
    
    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
    
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    
    public String getIssuePlace() { return issuePlace; }
    public void setIssuePlace(String issuePlace) { this.issuePlace = issuePlace; }
    
    public String getIssueCountry() { return issueCountry; }
    public void setIssueCountry(String issueCountry) { this.issueCountry = issueCountry; }
    
    public boolean isHasChip() { return hasChip; }
    public void setHasChip(boolean hasChip) { this.hasChip = hasChip; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public String toString() {
        return documentType + ", " + documentNumber + ", " + issueDate + ", " + expiryDate + ", " +
               issuePlace + ", " + issueCountry +
               (documentType.equals("CCCD") ? ", " + hasChip : "") +
               (documentType.equals("Passport") ? ", " + notes : "");
    }
} 