# Proposal
## Project Title: One more thing

## Team members: Haike Yu, Jason Liu, Harriet Zhu

## Project Demonstration
https://www.youtube.com/watch?v=_o3oAmSUc6o

## Description of the web application:
In this project, we are going to design a web calendar called One-More-Thing. Every time our website is visited, it will ask the user to sign up or sign
in. Users can choose to sign up by username based or google auth. Each registered user will have a default personal calendars of their own. registered users can add, remove, update their calendars. Registered users can alse add,remove and modify events to their calendars. Our web also provides a group calendar. A registered user can invite any other user into his group calendar we called them participants. Participants can also add, remove and modify events to their calendars just like the owner. However, a participant can not delete the group calendar while the owner of the group calendar can. Additionally, the owner of a group calendar can remove any other user in the group calendar. Whenever a particular task date is approaching, our web will send an email to the user and all participants in the group to notify them of the date and the event that they need to finish.

## Challenge factors and key features
### - Non-trivial frontend
We used react for our frontend, some animation background, and popup window, morden alert, big calendar package, MUI package .... to maintain a better user
experience

### - Oauth
We provided two ways for users to sign up and sign in
- Google Oauth
- Normal username password

### - Workers (sending various reminder emails to users)
We used Bee-Queue worker, Redis, and SendGrid to send emails to owners and participants to remind them when and what event will need to be finished

### - Real-time interaction
We provided real-time interaction by Socket.io to make sure users can see changes in the group calendar in real-time.

## Other key features 
- Advanced frontend
- Basic calendar functions
- Keep user logged in by Cookie
- Authorization based on different user groups(owner or participant)
- Sign up with a traditional username and password
- Login/logout to accounts
- Hashed password in the backend
- Collaborative calendars for group events(multiple users can edit the same calenders with authorization control for each user's permission).
- Basic CURD operation of a personal calendar and group calendar
- Basic CURD operation of an event
- App Bar at the top to provide more information to the user
- Change password
- Change personal and group calendar title
- Optionally invite or remove participants
- Developed on https://one-more-thing.studio/ used AWS lightsail, name.com, and google cloud platform.

## Contribution
Harriet Zhu - Responsible for most of frontend design as well as Oauth login, did part of crud operations for events and calendars, and deployed the web
app using aws lightsail.

Haike Yu - Responsible for all of the backend which includes but not only authentication, authorization, REST CURD operations, API, and MongoDB... Also 
responsible for mailing feature implemented by bee-queue, Redis and SendGrid.

Yaowei Liu: Resolved tricky bugs and logistics at frontend, part of crud operations for events and calendars. Real time interaction with web socket. Connecting frontend with backend.

## Instruction to run our code locally
- Install Redis and run redis-server
- cd to backend folder run npm install then run nodemon app.js 
- You should see Listening on port 3000, Database Connected and Mongoose Connected in console
- cd to frontend folder end run npm install --force then run npm start
- Frontend is running on port 8000
- Now you can access our code on http://localhost:8000/

