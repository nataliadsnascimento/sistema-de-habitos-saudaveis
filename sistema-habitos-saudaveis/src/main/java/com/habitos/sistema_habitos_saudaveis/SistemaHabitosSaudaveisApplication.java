package com.habitos.sistema_habitos_saudaveis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration; // <-- Importar este

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}) // <-- Adicionar este
public class SistemaHabitosSaudaveisApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaHabitosSaudaveisApplication.class, args);
    }
}