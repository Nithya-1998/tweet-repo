package com.tweetapp.tweetservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @author Nithya T
 *
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Tweet not found")
public class TweetNotFoundException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public TweetNotFoundException(String message) {
		super(message);
	}

}
