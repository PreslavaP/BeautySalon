package com.example.beautysalon.model;

public class ServiceModel {
    private String name;
    private double price;
    private String duration;
    private String category;

    public ServiceModel(String name, double price, String duration, String category) {
        this.name = name;
        this.price = price;
        this.duration = duration;
        this.category = category;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}