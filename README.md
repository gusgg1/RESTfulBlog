## A simple blog app with Express, EJS, MongoDB and more...

* This is a RESTful application.
  * Creating, editing, updating, deleting following the RESTful pattern with get, post, put and delete.
* Created with [Semantic UI](https://semantic-ui.com/).
* It allows user to post a blog with its title, image URL, and text.
  * If user choses not to provide an URL then a default image will be displayed.
* The app uses MongoDB as its database.
* The app allows the user to use markdown syntax, however I use `express-sanitizer` to remove any scripts to protect the app. 