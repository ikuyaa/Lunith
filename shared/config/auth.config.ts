/* These are not .env variables so we can use them in the frontend as constants. */

//User
export const ENABLE_USER_EMAIL_CHANGING = true;

//Password
export const MAX_PASSWORD_LENGTH = 64;
export const MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_RESET_TOKEN_EXPIRE = 1; //In hours

//Email
export const ENABLE_EMAIL_SIGNUP = true;
export const REQUIRE_EMAIL_VERIFICATION = true;

//Signup
export const MIN_SIGNUP_AGE = 13;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 20;
export const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;


//Rate limiting 
export const RATE_LIMITING_ENABLED = true;  
export const RATE_LIMITING_MAX_REQUESTS = 100;
export const RATE_LIMITING_WINDOW = 10;    

//Cookie Cache
export const COOKIE_CACHE_ENABLED = true; //Enable cookie cache for session
export const COOKIE_CACHE_MAX_AGE = 5; //In minutes     