package com.quintadalam.backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Requiere variables de infraestructura (DB/JWT/Stripe) para levantar el contexto completo.")
class QuintaDalamApplicationTests {

    @Test
    void contextLoads() {
    }
}
