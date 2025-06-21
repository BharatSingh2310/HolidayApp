package com.example.holidayapp;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;

@RestController
@RequestMapping("/api")
public class HolidayController {
    private final WebClient webClient = WebClient.create("https://date.nager.at/api/v3");

    @GetMapping("/countries")
    public Mono<List<Country>> getCountries() {
        return webClient.get()
                .uri("/AvailableCountries")
                .retrieve()
                .bodyToFlux(Country.class)
                .collectList();
    }

    @GetMapping("/holidays/{countryCode}/{year}")
    public Mono<List<Holiday>> getHolidays(@PathVariable String countryCode, @PathVariable int year) {
        return webClient.get()
                .uri("/PublicHolidays/{year}/{countryCode}", year, countryCode)
                .retrieve()
                .bodyToFlux(Holiday.class)
                .collectList();
    }
}