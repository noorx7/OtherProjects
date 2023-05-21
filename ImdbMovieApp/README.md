Youtube Video showcasing the project:
https://www.youtube.com/watch?v=RrrxvxwbuCU



## Updated documentation:





To run our application:

- we need to install npm in two separate folders; Client and Server. To do this, we can run the command 'npm install' in each folder. Once npm is installed, we need to ensure that both the Client and Server are running. We can start the Server by running the command 'nodemon index.mjs', and we can start the Client by running the command 'npm run dev'. 

- We have added a file named 'nameBasics.tsv' to our branch, which needs to be uploaded to our database. Due to its large size, we removed some columns that are not required, retaining only the essential information. To import this data file into the database automatically, run the command 'mongoimport --db=imdb --type=tsv --headerline --collection=titleBasics title.basics.tsv' on the terminal.

- Once the application is running, the URL of the localhost where the application is hosted will be printed to the log. You can access the website using this URL and start using our application, Hardworking Ants.

- You can create an account and log in with your credentials. The account details you provide will be saved in our database, with your password encrypted using a hashing system for your privacy and security. 

Once you've logged in, you'll have the ability to perform the following tasks:

- Utilize the search button to browse our database for any movie.
- Modify your login credentials, including your email address and password.
- Add funds to your account using our Stripe library. If your credit card is eligible, it will process the payment and credit the funds to your account;              You can test this feature by using the random credit card number 4242 4242 4242 4242. For the expiration date, any future date will work, and              any 3-digit number will suffice for the security code.
- It is possible to upload and modify your profile image.
- It is possible to search friends, add friends and remove friends (other users in the database)
- You will be able to see the current time














-------------------------------------------------------------------------------------------------------------------
Documentation for project 2:
## Our KanBan board link where we organized the data of our features: https://github.com/users/GizemmEnsari/projects/6/views/1

#### How To Run
1-)First check out with git clone

2-) install the datasets from the website https://drive.google.com/drive/folders/1I5ODOmJYecWwGljcGdoVEPry30OpgRF7 , and unzip them in the server directory (for example where controller, middleware, and model reside)

2-)run 'npm install' from terminal to install the needed libraries

3-) import these from terminal:

'mongoimport --db=imdb --type=tsv --headerline --collection=nameBasics name.basics'

'mongoimport --db=imdb --type=tsv --headerline --collection=titleBasics title.basics'

4-) do 'npm test' to run the 10 mocha tests

#### Note: We finished working on the assignment on the 18th of march, and added last version of our files before the due date with the penalty, but unfortuately at the last pull request, we had a merging issue and because of that we pushed our code to the master branch 15 minutes late (at 12.15 am), please consider not giving us penalty, thank you.

We completed 8 server side features:

#### 1-) User log in
This is a function for handling user login. It first retrieves the user information from the database using the email address provided. If the user does not exist, it returns an error message. If the user exists, it checks whether the provided password matches the hashed password stored in the database. If the password is incorrect, it returns an error message. If the password is correct, it generates a JSON web token using the user's ID and a secret key, and returns the token along with the user object without the password field.


#### 2-) User Register
The register function is an asynchronous function that is used to create a new user. The function takes in the user details such as firstName, lastName, email, password, favourite and walletAmount from the request body. The function then checks if the email address already exists in the database, and returns an error message if it does. If the email address is not found in the database, the password is hashed using bcrypt (more on the next feature) and a new user is created and saved on the Database with the hashed password and other user details. The new user is also returned in the response.


#### 3-)Hashed Passwords
When a user creates a password in our system, it is hashed and stored in the database instead of the plain text password. When the user logs in, the password they enter is hashed and compared to the stored hash in the database. If the hashes match, the user is granted access. This ensures that even if a hacker gains access to the database, they cannot easily retrieve the passwords.

#### 4-) Adding/Removing a Movie From Favourite
These functions add/removes a movie from a user's favourites list. It first checks if the movie exists in the database and if the user exists. Then it finds the index of the movie in the user's favourites list, removes it if found, and saves the updated user data. If the movie is not found in the user's favourites list, it returns an error message. If any error occurs, it returns an internal server error message.

#### 5-) Updating the Email and Password
The updateCredentials function updates the email and/or password of a user. It first checks if the person is logged in with the isLogged middleware as only a logged user should be able to change their own email and password. If a new email is provided, it checks for duplication and updates the email. If a new password is provided, it hashes it and adds it to the updates object. It then updates the user's email and/or password in the database and generates a new JWT token with the updated user ID. It returns the token and the updated user data (with password removed). If any error occurs, it returns an internal server error message.


#### 6-) Movie Fetching
This part of code exports an asynchronous function movieFetchSearch that searches for movie titles based on a name and a genre. It creates a query object and uses the find method of the titleBasics model to search the titleBasics collection based on the primaryTitle field matching the name parameter using a regular expression. If the request includes a genre parameter, it adds it to the query. The function returns up to 10 documents that match the search criteria, with an exact match to the name parameter moved to the beginning of the result array. Finally, it returns a JSON response containing the message "Movie Document" and the array of up to 10 movie documents.

#### 7-) Adding a Movie to the Favourites
This code exports an asynchronous function addMovieToFavourite that adds a movie to a user's favourites. It first starts from isLogged middleware as only a logged user should be able to add movies to their favourite array. Then it retrieves the tconst parameter of the movie from the request and uses it to find the movie document in the titleBasics collection using the find method of the titleBasics model. If the movie does not exist, the function returns an error message. The function then retrieves the id of the user from the req.user object and uses it to find the corresponding user document in the users collection using the findById method of the User model. If the user does not exist, the function returns an error message. The function adds the tconst parameter to the user's favourite array and saves the user document. Finally, the function returns a JSON response with a message indicating that the movie has been added to the user's favourites.

#### 8-) Logging Out a User

Our logout function handles user logout requests. It uses the "Authorization" header to extract a token and checks if it starts with "Bearer". If it is a valid token, it is decoded using the "jwt" library and added to a blacklist to prevent its reuse. Finally, the function sends a response with a status code of 200 and a success message. If there is an error, it sends a response with a status code of 500 and an error message.


All of the 8 features are working and can be tested by Postman or npm test.                                                                


10 tests have been implemented in the folder called 'test', all of them are passing;

1-)  Register  a user

2-) Login a User

3-) Fetchings users information

4-) updating user e mail and password

5-) Get a users Wallet

6-) Fetch a movie from the database

7-) Fetch a movie by its name

8-) Add a movie to a Users Favourite

9-) Removing a movie from Users Favourite

10-) Updating a User Credentials



