# Time Travel

## Description

Web application where users meet to make or attend Time Travel events.
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault. 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault.
- **homepage** - As a user I want to be able to access the homepage so i can sign in or log in.
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend.
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account.
- **events list** - As a user I want to see all the events available so that I can choose which ones I want to attend.
- **events create** - As a user I want to create an event so that I can invite others to attend.
- **events delete** - As a user i want to delete an event i'm attending in case i added it by mistake or i changed my mind.
- **events detail** - As a user I want to see the event details and attendee list of one event so that I can decide if I want to attend.
- **event attend** - As a user I want to be able to attend to event so that the organizers can count me in.
- **profile** - As a user I want to check my profile where i see my description and attending events.
@todo - check what is in the backlog

## MVP

- Make the different routes work.
- Use relations between models.
- CRUD.
    - Create.
        - Sign in.
        - Create event.
    - Read.
        - User can see all events.
        - User can see attendees of events.
        - User can see his/her events.
    - Update.
        - User can attend an event.
        - User can change his/her status on events (attend / don't attend).

- Log out.
- Create partials.
- Validate & protect routes.
- HTML.
- Basic CSS.


@todo - explain a little bit more

## Backlog

List of other features outside of the MVPs scope

Perfect CSS. 

Edit events (only administrator).
Delete events (only administrator).

User profile:
- see my profile.
- upload my profile picture.
- see other users profile.
- list of events created by the user.
- list events the user is attending.

Geo Location:
- add geolocation to events when creating.
- show event in a map in event detail page.
- show all events in a map in the event list page.

Comments:
- add comments to events.

Homepage
- ...


## ROUTES:
@todo - validation & authorization

**First page (index with sign in / log in buttons)**
- GET / 
  - renders:  index  (the homepage : sign in & log in)
  - validation: logged in redirect -> events   : no log in -> "/"  


**Sign Up**
- GET /signup
  - renders:   auth/signup form 
  - validation: logged in redirects -> events   : no log in -> "/"

- POST /signup
    (before check if user completes form, and user & password are fulfilled)
  - redirects:  /user/favorites
  - body:
    - username
    - password

**Sign up second screen (favorites)**
- GET /profile/favorites
    - renders:   user/profile/favorites (favourites form eras).
    - validation: logged in redirects -> events.     no log in -> "/"

- POST /profile/favorites
    - redirects:  /user/profile
    - body:
        - Era.

**Sign up third screen (user profile: description - email)**
-  GET /profile
    - renders:    user/profile/profile form.
    - validation:  logged in redirects -> events.   no log in -> "/"
    
- POST /user/profile
    - redirects:  /events
    - body:
        - Description.
        - Mail.

**Log in**
- GET /login
  - renders:    auth/login (the login form).
  - validation: logged in redirects -> events.

- POST /login
  - redirects to /events/index
  - body:
    - username
    - password


**Log Out (button on navbar)** 
- POST /logout
  - body: (empty)
  - deletes the user from the session
  - redirects: /index

**main/index page. options for explore, your events, create**
- GET /events
  - renders:    main/index (main events page for exploring, access your events and create them).
  - validation:  no log in redirects -> "/"

**eventslist. page with all events**
- GET /events/explore
    - renders:   events/eventslist.
    - validation: no log in redirects -> "/"

**create event page**
- GET /events/create
    - renders:   events/create (the create event page with form).
    - validation: no log in redirects -> "/"

- POST events/create    
  - redirects:  /events/:id
  - body: 
    - era
    - date
    - description
    - url photo

**event detail. where user can add it to his/her own**
- GET /events/:id
  - renders:    events/:id (the event detail page).
  - includes the list of attendees
  - attend button if user not attending yet
  - if i am the user that creates the event i would have a button to edit
  - validation: no log in redirects -> "/"

- POST events/:id/attend 
  - redirects:   /user/profile/events
  - body: (empty - the user is already stored in the session)

**profile. user profile (description and attending events)**
- GET /profile/me
  - renders:   user/profile/me
  - validation: no log in redirects -> "/"


## Models

User model
 
```
username: String
password: String
preferences: Array
picture: String
description: String
```

Event model

```
owner: ObjectId<User>
name: String
description: String
picture: String
era: String
date: Date
location: {
    lat: String,
    long: String
}
attendees: [ObjectId<User>]
``` 

## Links

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/RaulCote/time-travel/)

[Deploy Link](https://timetravelapp.herokuapp.com/)

### Slides

The url to your presentation slides

[Slides Link](https://slides.com/raulcote/time-travel/)
