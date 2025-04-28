package com.example.cloudbalance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication(exclude = {
		org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration.class
})

public class CloudBalanceApplication {
	public static void main(String[] args) {
		SpringApplication.run(CloudBalanceApplication.class, args);
	}
}