package com.quintadalam.backend.common.util;

import java.time.Instant;

public final class Utc {

    private Utc() {
    }

    public static Instant now() {
        return Instant.now();
    }
}
