# Post Comment App


## Key Features
-   User Authentication (Register/Login)
-   Post Creation, Editing, and Deletion
-   Rich Text Editor for post content
-   Nested (threaded) comments on posts
-   A main feed to view all posts

## UI Pages:
/ -> Dashboard Posts Feed

(auth)
/login -> Login
/register -> signup

(post page)
/post/ -> Create Post
/post/[id]  -> Post Page with comments

## API Endpoints

### Auth

**POST** `/auth/register`
-   **Description:** Registers a new user.
-   **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
-   **Response Body (Success):**
    ```json
    {
      "id": "uuid",
      "username": "string",
      "createdAt": "date-time"
    }
    ```

**POST** `/auth/login`
-   **Description:** Logs in an existing user.
-   **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
-   **Response Body (Success):**
    ```json
    {
      "access_token": "string"
    }
    ```

### Posts

**GET** `/posts`
-   **Description:** Retrieves a list of all posts.
-   **Response Body (Success):**
    ```json
    [
      {
        "id": "uuid",
        "title": "string",
        "content": "string (html)",
        "createdAt": "date-time",
        "updatedAt": "date-time",
        "author": {
          "id": "uuid",
          "username": "string",
          "createdAt": "date-time"
        }
      }
    ]
    ```

**GET** `/posts/:id`
-   **Description:** Retrieves a single post by its ID.
-   **Response Body (Success):**
    ```json
    {
      "id": "uuid",
      "title": "string",
      "content": "string (html)",
      "createdAt": "date-time",
      "updatedAt": "date-time",
      "author": {
        "id": "uuid",
        "username": "string",
        "createdAt": "date-time"
      }
    }
    ```

**POST** `/posts`
-   **Description:** Creates a new post. (Requires Bearer Token)
-   **Request Body:**
    ```json
    {
      "title": "string",
      "content": "string (html)"
    }
    ```
-   **Response Body (Success):** The newly created post object.

**PATCH** `/posts/:id`
-   **Description:** Updates an existing post. (Requires Bearer Token)
-   **Request Body:**
    ```json
    {
      "title": "string",
      "content": "string (html)"
    }
    ```
-   **Response Body (Success):** The updated post object.

**DELETE** `/posts/:id`
-   **Description:** Deletes a post. (Requires Bearer Token)
-   **Response:** `204 No Content`

### Comments

**GET** `/comments/:postId`
-   **Description:** Retrieves all top-level comments for a specific post.
-   **Response Body (Success):**
    ```json
    [
      {
        "id": "uuid",
        "content": "string (html)",
        "parentId": null,
        "isEdited": false,
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "date-time",
        "updatedAt": "date-time",
        "author": {
          "id": "uuid",
          "username": "string"
        },
        "childrenCount": "string"
      }
    ]
    ```

**GET** `/comments/:postId/replies/:commentId`
-   **Description:** Retrieves all replies for a specific parent comment.
-   **Response Body (Success):** An array of comment objects (same structure as above).

**POST** `/comments`
-   **Description:** Creates a new comment or a reply. (Requires Bearer Token)
-   **Request Body:**
    ```json
    {
      "content": "string (html)",
      "postId": "uuid",
      "parentId": "uuid" // Optional
    }
    ```
-   **Response Body (Success):** The newly created comment object.