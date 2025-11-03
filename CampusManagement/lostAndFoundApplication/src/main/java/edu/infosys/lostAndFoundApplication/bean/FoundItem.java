package edu.infosys.lostAndFoundApplication.bean;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class FoundItem {

    @Id
    private String foundItemId;
    private String username;
    private String userEmail;
    private String itemName;
    private String category;
    private String color;
    private String brand;
    private String location;
    private String foundDate;
    private Boolean status;

    @Column(length = 512)
    private String imageUrl;

    public FoundItem() {
        super();
    }

    public FoundItem(String foundItemId, String username, String userEmail, String itemName, String category, String color, String brand, String location, String foundDate, String imageUrl,Boolean status) {
        this.foundItemId = foundItemId;
        this.username = username;
        this.userEmail = userEmail;
        this.itemName = itemName;
        this.category = category;
        this.color = color;
        this.brand = brand;
        this.location = location;
        this.foundDate = foundDate;
        this.imageUrl = imageUrl;
        this.status=false;
    }

    
    public String getFoundItemId() { return foundItemId; }
    public void setFoundItemId(String foundItemId) { this.foundItemId = foundItemId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getFoundDate() { return foundDate; }
    public void setFoundDate(String foundDate) { this.foundDate = foundDate; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}


}