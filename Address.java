package StudentManagement;

public class Address {
    private String street;
    private String ward;
    private String district;
    private String city;
    private String country;


    public Address() {
    }

    public Address(String street, String ward, String district, String city, String country) {
        this.street = street;
        this.ward = ward;
        this.district = district;
        this.city = city;
        this.country = country;
    }

    public String getStreet() {
        return street;
    }
    
    public String getWard() {
        return ward;
    }

    public String getDistrict() {
        return district;
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    @Override
    public String toString() {
        return street + ", " + ward + ", " + district + ", " + city + ", " + country;
    }    
}
