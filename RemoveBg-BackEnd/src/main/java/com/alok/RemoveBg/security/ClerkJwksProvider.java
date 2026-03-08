package com.alok.RemoveBg.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigInteger;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class ClerkJwksProvider {

    @Value("${clerk.jwks-url}")
    private String jwksUrl;

    private final Map<String, PublicKey> keyCache = new HashMap<>();
    private long lastTimeFetch = 0;
    private static final long CACHE_TTL = 3600000;

    public PublicKey getPublicKey(String kid) throws Exception {
        log.info("Getting public key for kid: {}", kid);
        log.info("Cache contains keys: {}", keyCache.keySet());

        if(keyCache.containsKey(kid) && System.currentTimeMillis() - lastTimeFetch < CACHE_TTL) {
            log.info("Returning cached key for kid: {}", kid);
            return keyCache.get(kid);
        }
        log.info("Refreshing keys from JWKS URL: {}", jwksUrl);
        refreshKeys();

        if (!keyCache.containsKey(kid)) {
            log.error("Key with kid {} not found after refresh", kid);
            throw new Exception("Key not found for kid: " + kid);
        }

        return keyCache.get(kid);
    }

    private void refreshKeys() throws Exception {
        log.info("Fetching JWKS from: {}", jwksUrl);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jwks = mapper.readTree(new URL(jwksUrl).openStream());
        JsonNode keys = jwks.get("keys");

        log.info("Found {} keys in JWKS", keys.size());

        for(JsonNode keyNode : keys) {
            String kid = keyNode.get("kid").asText();
            String kty = keyNode.get("kty").asText();
            String alg = keyNode.get("alg").asText();

            log.info("Processing key - kid: {}, kty: {}, alg: {}", kid, kty, alg);

            if("RSA".equals(kty) && "RS256".equals(alg)) {
                String n = keyNode.get("n").asText();
                String e = keyNode.get("e").asText();

                PublicKey publickey = createPublicKey(n, e);
                keyCache.put(kid, publickey);
                log.info("Added key to cache for kid: {}", kid);
            }
        }
        lastTimeFetch = System.currentTimeMillis();
        log.info("Keys refreshed. Cache now contains: {}", keyCache.keySet());
    }

    private PublicKey createPublicKey(String modulus, String exponent) throws Exception {
        byte[] modulusBytes = Base64.getUrlDecoder().decode(modulus);
        byte[] exponentBytes = Base64.getUrlDecoder().decode(exponent);

        BigInteger modulusBigInt = new BigInteger(1, modulusBytes);
        BigInteger exponentBigInt = new BigInteger(1, exponentBytes);

        RSAPublicKeySpec spec = new RSAPublicKeySpec(modulusBigInt, exponentBigInt);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return factory.generatePublic(spec);
    }
}