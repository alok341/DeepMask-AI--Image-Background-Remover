package com.alok.RemoveBg.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Collections;

@Component
@RequiredArgsConstructor
@Slf4j  // Add this annotation for logging
public class ClerkJwtAuthFilter extends OncePerRequestFilter {

    @Value("${clerk.issuer}")
    private String clerkIssuer;

    private final ClerkJwksProvider jwksProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if(request.getRequestURI().contains("/api/webhooks")) {
            filterChain.doFilter(request,response);
            return;
        }


        String authHeader = request.getHeader("Authorization");

        log.info("Auth header: {}", authHeader);

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.error("Authorization header missing or invalid");
            response.sendError(HttpServletResponse.SC_FORBIDDEN,"Authorization header missing");
            return;
        }

        try{
            String token = authHeader.substring(7);
            log.info("Token: {}", token);

            // Log token parts
            String[] chunks = token.split("\\.");
            log.info("Token has {} parts", chunks.length);

            if (chunks.length < 2) {
                throw new Exception("Invalid token format");
            }

            String headerJSON = new String(Base64.getUrlDecoder().decode(chunks[0]));
            String payloadJSON = new String(Base64.getUrlDecoder().decode(chunks[1]));

            log.info("Token header: {}", headerJSON);
            log.info("Token payload: {}", payloadJSON);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode headerNode = mapper.readTree(headerJSON);
            String kid = headerNode.get("kid").asText();
            log.info("Token KID: {}", kid);

            PublicKey publicKey = jwksProvider.getPublicKey(kid);
            log.info("Public key retrieved successfully");

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .setAllowedClockSkewSeconds(60)
                    .requireIssuer(clerkIssuer)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            log.info("Token validated successfully. Subject: {}", claims.getSubject());

            String clerkUserId = claims.getSubject();

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    clerkUserId,null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request,response);
        } catch (Exception e) {
            log.error("JWT validation failed: ", e);
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid JWT Token: " + e.getMessage());
            return;
        }
    }
}