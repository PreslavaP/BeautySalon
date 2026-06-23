package com.example.beautysalon.controller;

import com.example.beautysalon.model.ServiceModel;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        List<ServiceModel> services = new ArrayList<>();

        services.add(new ServiceModel("Класически маникюр", 30.0));
        services.add(new ServiceModel("Педикюр", 45.0));
        services.add(new ServiceModel("Гел лак", 40.0));
        services.add(new ServiceModel("Ноктопластика", 60.0));

        model.addAttribute("servicesList", services);

        return "index";
    }
}