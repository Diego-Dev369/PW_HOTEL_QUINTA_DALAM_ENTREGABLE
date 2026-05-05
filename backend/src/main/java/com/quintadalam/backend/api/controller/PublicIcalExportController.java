package com.quintadalam.backend.api.controller;

import com.quintadalam.backend.application.service.ChannelIcalExportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicIcalExportController {

    private final ChannelIcalExportService channelIcalExportService;

    public PublicIcalExportController(ChannelIcalExportService channelIcalExportService) {
        this.channelIcalExportService = channelIcalExportService;
    }

    /**
     * Exportación de bloqueos operativos (sin token en esta versión). En producción, proteger detrás Nginx ACL o token rotativo.
     */
    @GetMapping(value = "/ical/export", produces = "text/calendar")
    public ResponseEntity<String> export(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate to
    ) {
        String body = channelIcalExportService.exportBlockingCalendar(from, to);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("text/calendar; charset=UTF-8"))
            .header("Content-Disposition", "inline; filename=\"quinta-dalam-blocking.ics\"")
            .body(body);
    }
}
