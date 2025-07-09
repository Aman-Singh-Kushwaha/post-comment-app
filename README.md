# Post Comment App


## Key Features requirement:
- User Authentication with encryption and hashing
- Post Creation, Edit, Delete (Later in Rich Text Editor)
- Comments in Post Page
- Post only feed page


## UI Pages:
/ -> Dashboard Posts Feed

(auth)
/login -> Login
/register -> signup

(post page)
/post/ -> Create Post
/post/[id]  -> Post Page with comments

## API Endpoints
POST /auth/login    --> takes username, encryptedPassword ->  returns token,user
POST /auth/register --> takes username, password   -> returns token, user

GET /post  --> no authentication required -> returns array of all posts in DESC
GET /post/:postid --> no authentication required  -> returns post object
POST /post/   --> authorization token required, body post content  -> returns post object 
PATCH /post/:postid --> auth token req, body: post content -> return post object
DELETE /post/:postid --> auth token req --> no content

GET /comments/:postid --> no token required  -> returns all comments with matching postid and parentid is null
GET /comments/:postid/replies/:commentid  --> no token required -> returns comments with matching postid and parentid equals commentid
