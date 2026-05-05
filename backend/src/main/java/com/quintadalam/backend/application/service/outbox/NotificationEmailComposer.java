package com.quintadalam.backend.application.service.outbox;

import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.domain.model.NotificationOutboxEntry;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.repository.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class NotificationEmailComposer {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ReservationRepository reservationRepository;

    public NotificationEmailComposer(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public EmailEnvelope compose(NotificationOutboxEntry entry) {
        return switch (entry.getKind()) {
            case "PASSWORD_RESET_REQUEST" -> composePasswordReset(entry.getPayload());
            case "PAYMENT_SUCCESS", "RESERVATION_CONFIRMED" -> composeReservationConfirmation(entry.getReservationId());
            default -> throw new BusinessException(HttpStatus.BAD_REQUEST, "OUTBOX_KIND_UNSUPPORTED", "Tipo de notificación no soportado: " + entry.getKind());
        };
    }

    private EmailEnvelope composePasswordReset(Map<String, Object> payload) {
        String email = asText(payload.get("email"));
        String fullName = asText(payload.get("fullName"));
        String resetUrl = asText(payload.get("resetUrl"));

        if (email == null || resetUrl == null) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "OUTBOX_PAYLOAD_INVALID", "Payload de reset de contraseña incompleto.");
        }

        String safeName = escapeHtml(fullName == null || fullName.isBlank() ? "Huésped" : fullName);
        String safeResetUrl = escapeHtml(resetUrl);
        String html = """
            <html>
              <body style="font-family:Arial,Helvetica,sans-serif;color:#1F1F1F;background:#F7F7F7;margin:0;padding:0;">
                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="padding:24px 0;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="background:#FFFFFF;border-radius:8px;overflow:hidden;">
                        <tr><td style="background:#111111;color:#FFFFFF;padding:20px 28px;font-size:20px;font-weight:700;">Hotel Quinta Dalam</td></tr>
                        <tr>
                          <td style="padding:28px;">
                            <h1 style="margin:0 0 16px 0;font-size:24px;color:#111111;">Restablecer contraseña</h1>
                            <p style="font-size:15px;line-height:1.6;margin:0 0 16px 0;">Hola %s, recibimos una solicitud para restablecer tu contraseña.</p>
                            <p style="font-size:15px;line-height:1.6;margin:0 0 18px 0;">Este enlace es válido por 30 minutos y solo puede usarse una vez.</p>
                            <p style="margin:0 0 24px 0;">
                              <a href="%s" style="display:inline-block;padding:12px 20px;background:#111111;color:#FFFFFF;text-decoration:none;border-radius:6px;font-weight:600;">Restablecer contraseña</a>
                            </p>
                            <p style="font-size:13px;line-height:1.6;margin:0;color:#6D6D6D;">Si no solicitaste este cambio, ignora este mensaje.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            """.formatted(safeName, safeResetUrl);

        return new EmailEnvelope(email, "Restablece tu contraseña | Quinta Dalam", html);
    }

    private EmailEnvelope composeReservationConfirmation(UUID reservationId) {
        if (reservationId == null) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "OUTBOX_PAYLOAD_INVALID", "No existe reservationId para confirmación.");
        }

        Reservation reservation = reservationRepository.findByIdAndDeletedAtIsNull(reservationId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "RESERVATION_NOT_FOUND", "Reservación no encontrada para notificación."));

        String guestName = escapeHtml(reservation.getGuestFullName());
        String code = escapeHtml(reservation.getReservationCode());
        String roomName = escapeHtml(reservation.getRoom().getName());
        String checkIn = reservation.getCheckIn().format(DATE_FORMAT);
        String checkOut = reservation.getCheckOut().format(DATE_FORMAT);
        String total = formatMoney(reservation.getTotalAmount(), reservation.getCurrency());
        String createdAt = reservation.getCreatedAt().atZone(ZoneId.of("UTC")).toLocalDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm 'UTC'"));

        String html = """
            <html>
              <body style="font-family:Arial,Helvetica,sans-serif;color:#1F1F1F;background:#F7F7F7;margin:0;padding:0;">
                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="padding:24px 0;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="background:#FFFFFF;border-radius:8px;overflow:hidden;">
                        <tr><td style="background:#111111;color:#FFFFFF;padding:20px 28px;font-size:20px;font-weight:700;">Hotel Quinta Dalam</td></tr>
                        <tr>
                          <td style="padding:28px;">
                            <h1 style="margin:0 0 16px 0;font-size:24px;color:#111111;">Pago confirmado</h1>
                            <p style="font-size:15px;line-height:1.6;margin:0 0 16px 0;">Gracias %s, tu reservación quedó confirmada.</p>
                            <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px;">
                              <tr><td style="padding:8px 0;color:#6D6D6D;">Folio</td><td style="padding:8px 0;text-align:right;font-weight:600;">%s</td></tr>
                              <tr><td style="padding:8px 0;color:#6D6D6D;">Suite</td><td style="padding:8px 0;text-align:right;">%s</td></tr>
                              <tr><td style="padding:8px 0;color:#6D6D6D;">Check-in</td><td style="padding:8px 0;text-align:right;">%s</td></tr>
                              <tr><td style="padding:8px 0;color:#6D6D6D;">Check-out</td><td style="padding:8px 0;text-align:right;">%s</td></tr>
                              <tr><td style="padding:8px 0;color:#6D6D6D;">Total pagado</td><td style="padding:8px 0;text-align:right;font-weight:700;">%s</td></tr>
                            </table>
                            <p style="font-size:12px;line-height:1.5;margin:20px 0 0 0;color:#8A8A8A;">Emitido el %s</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            """.formatted(guestName, code, roomName, checkIn, checkOut, total, createdAt);

        return new EmailEnvelope(reservation.getGuestEmail(), "Reservación confirmada " + reservation.getReservationCode(), html);
    }

    private String asText(Object value) {
        if (value == null) {
            return null;
        }
        return String.valueOf(value);
    }

    private String formatMoney(BigDecimal amount, String currency) {
        NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("es", "MX"));
        format.setCurrency(java.util.Currency.getInstance(currency == null ? "MXN" : currency));
        return format.format(amount == null ? BigDecimal.ZERO : amount);
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;");
    }

    public record EmailEnvelope(String to, String subject, String htmlBody) {
    }
}
