package com.tweetapp.authenticateservice.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.tweetapp.authenticateservice.service.AppUserDetailService;



/**
 * @author Nithya T 
 *
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	public static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfig.class);
	@Autowired
	AppUserDetailService appUserDetailsService;

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		System.out.println(auth.userDetailsService(appUserDetailsService).passwordEncoder(passwordEncoder()));
		auth.userDetailsService(appUserDetailsService).passwordEncoder(passwordEncoder());
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		LOGGER.info("Start encoding");
		System.out.println(new BCryptPasswordEncoder());
		return new BCryptPasswordEncoder();
	}


	/*
	 * @Override protected void configure(HttpSecurity httpSecurity) throws
	 * Exception {
	 * httpSecurity.csrf().disable().httpBasic().and().authorizeRequests().
	 * antMatchers("/countries").hasRole("USER")
	 * .antMatchers("/authenticate").hasAnyRole("USER", "ADMIN"); }
	 */
	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		httpSecurity.cors();
		httpSecurity.csrf().disable().httpBasic().and().authorizeRequests()
		.antMatchers("/swagger-ui.html").permitAll()
		.antMatchers("/api/v1.0/tweets/").permitAll()
//		.hasAnyRole("USER", "ADMIN")
				.anyRequest().authenticated()
				.and().addFilter(new JwtAuthorizationFilter(authenticationManager()));
	}
}
