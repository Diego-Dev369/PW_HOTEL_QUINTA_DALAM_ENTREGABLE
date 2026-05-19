package com.quintadalam.backend.api.controller;

import com.quintadalam.backend.application.service.ChannelIcalExportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/api/public")
public class PublicIcalExportController {

    private final ChannelIcalExportService channelIcalExportService;
    private final String icalExportToken;

    public PublicIcalExportController(
        ChannelIcalExportService channelIcalExportService,
        @Value("${app.ical.export-token:}") String icalExportToken
    ) {
        this.channelIcalExportService = channelIcalExportService;
        this.icalExportToken = icalExportToken;
    }

    /**
     * Exportación de bloqueos operativos (sin token en esta versión). En producción, proteger detrás Nginx ACL o token rotativo.
     */
    @GetMapping(value = "/ical/export", produces = "text/calendar")
    public ResponseEntity<String> export(
        @RequestParam(required = false, name = "token") String token,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate to
    ) {
        if (!StringUtils.hasText(icalExportToken)) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "iCal export no configurado.");
        }
        if (!icalExportToken.equals(token)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Token iCal inválido.");
        }

        String body = channelIcalExportService.exportBlockingCalendar(from, to);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("text/calendar; charset=UTF-8"))
            .header("Content-Disposition", "inline; filename=\"quinta-dalam-blocking.ics\"")
            .body(body);
    }
}
