package com.tweetapp.authenticateservice.controller;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.catalina.security.SecurityConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tweetapp.authenticateservice.bean.User;
import com.tweetapp.authenticateservice.exception.Message;
import com.tweetapp.authenticateservice.repository.UserRepository;
import com.tweetapp.authenticateservice.security.AppUser;
import com.tweetapp.authenticateservice.service.AppUserDetailService;

import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


/**
 * @author Nithya T
 *
 */
@RestController
@RequestMapping("/api/v1.0/tweets")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {
	public static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfig.class);
	@Autowired
	UserRepository userRepository;

	@Autowired
	AppUserDetailService appUserDetailsService;

	@Operation(summary = "This is to get jwt token for that loginId")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200",
					description = "Authenticated and token generated successfully",
					content = {@Content(mediaType = "application/json")}),
			@ApiResponse(responseCode = "401",
			description = "User not found/unauthorized",
			content = @Content),
			@ApiResponse(responseCode = "500",
			description = "Currently service is not available",
			content = @Content)
	})
	@GetMapping("/login")
	public Map<String, String> authenticate(@RequestHeader("Authorization") String authHeader) {
		HashMap<String, String> map = new HashMap<>();
		String user = getUser(authHeader);
		String[] name = user.split(":");
		String token = generateJwt(user);
		map.put("user", name[0]);
		String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toArray()[0].toString();
		AppUser users =  (AppUser) appUserDetailsService.loadUserByUsername(name[0]);
		User user1 = appUserDetailsService.getUserById(name[0]);
		user1.setLoggedIn(true);
		userRepository.save(user1);
		map.put("role", role);
		map.put("token", token);
		map.put("isLoggedIn", "true");
		return map;
	}

	private String getUser(String authHeader) {
		String encoded = authHeader.substring(6).toString();
		Base64.Decoder decoder = Base64.getMimeDecoder();
		String decoded = new String(decoder.decode(encoded));
		return decoded;
	}

	private String generateJwt(String user) {

		JwtBuilder builder = Jwts.builder();
		builder.setSubject(user);

		// Set the token issue time as current time
		builder.setIssuedAt(new Date());

		// Set the token expiry as 20 minutes from now
		builder.setExpiration(new Date((new Date()).getTime() + 1200000));
		builder.signWith(SignatureAlgorithm.HS256, "secretkey");

		String token = builder.compact();

		return token;

	}
	
}
