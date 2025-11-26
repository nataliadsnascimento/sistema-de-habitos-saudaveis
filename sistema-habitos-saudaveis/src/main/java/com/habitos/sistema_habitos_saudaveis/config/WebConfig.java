package com.habitos.sistema_habitos_saudaveis.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Habilita a comunicação de qualquer origem (*) para todos os seus endpoints (/**)
        // Isso é essencial para que o seu index.html local possa acessar o servidor 8080 sem bloqueio CORS.
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}