package com.example.beautysalon.controller;

import com.example.beautysalon.model.User;
import com.example.beautysalon.repository.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Controller
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterForm() {
        return "register";
    }

    @GetMapping("/booking")
    public String showBookingForm() {
        return "booking";
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam String username,
                               @RequestParam String email,
                               @RequestParam String password) {

        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            return "redirect:/register?error=UsernameTaken";
        }

        User newUser = new User(username, email, password, "USER");
        userRepository.save(newUser);

        return "redirect:/login?success=Registered";
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String username,
                            @RequestParam String password) {

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();

            if ("ADMIN".equals(user.getRole())) {
                return "redirect:/admin/dashboard";
            }

            return "redirect:/booking";
        }

        return "redirect:/login?error=InvalidCredentials";
    }
}