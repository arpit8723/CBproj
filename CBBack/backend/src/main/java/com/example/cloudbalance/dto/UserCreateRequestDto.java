    package com.example.cloudbalance.dto;

    import jakarta.validation.constraints.Email;
    import jakarta.validation.constraints.NotBlank;
    import jakarta.validation.constraints.Size;
    import lombok.Getter;
    import lombok.Setter;
    import java.util.Set;

    @Getter
    @Setter
    public class UserCreateRequestDto {

        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        private String password;
        private String role;
        private Set<Long> accountIds;


    }
