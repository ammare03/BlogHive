package com.example.a013.bloghive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class BlogHiveApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlogHiveApplication.class, args);
    }

}
