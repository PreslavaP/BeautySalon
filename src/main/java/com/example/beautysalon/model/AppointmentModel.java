package com.example.beautysalon.model;

public class AppointmentModel {
    private String clientName;
    private String clientPhone;
    private String selectedService;
    private String date;
    private String time;

    public AppointmentModel() {
    }

    public AppointmentModel(String clientName, String clientPhone, String selectedService, String date, String time) {
        this.clientName = clientName;
        this.clientPhone = clientPhone;
        this.selectedService = selectedService;
        this.date = date;
        this.time = time;
    }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public String getSelectedService() { return selectedService; }
    public void setSelectedService(String selectedService) { this.selectedService = selectedService; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}
