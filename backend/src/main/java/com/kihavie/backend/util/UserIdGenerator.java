package com.kihavie.backend.util;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import java.io.Serializable;

public class UserIdGenerator implements IdentifierGenerator {

    private static final String PREFIX = "kih-usr-";

    @Override
    public Object generate(SharedSessionContractImplementor session, Object object) {
        String maxId = session
                .createNativeQuery("SELECT id FROM users ORDER BY id DESC LIMIT 1", String.class)
                .uniqueResultOptional()
                .orElse(null);

        int nextNum = 1;
        if (maxId != null && maxId.startsWith(PREFIX)) {
            String numPart = maxId.substring(PREFIX.length()).replace("-", "");
            try {
                nextNum = Integer.parseInt(numPart) + 1;
            } catch (NumberFormatException e) {
                nextNum = 1;
            }
        }

        int group = nextNum / 1000;
        int seq = nextNum % 1000;

        return PREFIX + String.format("%03d-%03d", group, seq);
    }
}
