package com.quintadalam.backend;

import com.quintadalam.backend.config.RateLimitProperties;
import com.quintadalam.backend.config.StripeProperties;
import com.quintadalam.backend.config.AppMailProperties;
import com.quintadalam.backend.config.OutboxWorkerProperties;
import com.quintadalam.backend.config.AppFrontendProperties;
import com.quintadalam.backend.security.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties({
    JwtProperties.class,
    RateLimitProperties.class,
    StripeProperties.class,
    AppMailProperties.class,
    OutboxWorkerProperties.class,
    AppFrontendProperties.class
})
public class QuintaDalamApplication {

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(QuintaDalamApplication.class, args);
    }
}
