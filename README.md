# Spotify to Youtube

This is a project I created to convert a playlist on a user's Spotify account to a playlist on a user's Youtube account. 

This is still a WIP. Some areas that need work include:

* Details of using OAuth2 flow in an electron app with Youtube and Spotify. Currently, I am using the "Implicit Grant Flow" to avoid issues with credentials leaking, since credentials will ultimately need to be stored on the same machine as the electron app if we are using a simple architecture. For now, for additional safety, I am not including my own client ID/credentials in the repo. A consequence of this is that users will need to register their own "applications" on the Google and Youtube dev consoles as detailed below.

* Enforcing good style with non-restrictive linting

# Installation

## Requirements

* A Google account

* A Spotify account (premium or free)

* The git software

* Node.js, which can be downloaded here: https://nodejs.org/en/download/

## Downloading

In your computer's shell, run:
```
git clone https://github.com/nickspencer2/spotify2youtube.git
```

## Registering with Google/Youtube

Navigate to https://console.developers.google.com. Sign into an existing google account.

Click "Create Project". Enter a name, something similar to "Spotify to Youtube". Upon being redirected, click "Enable APIs and Services". 

In the search bar, search for "youtube" and select "Youtube Data API v3". Click "Enable". Upon being redirected, click "Create Credentials".

In the dropdown box under "Find out what kind of credentials you need", select "Youtube Data API v3". Under "Where will you be calling the API from", select "iOS". This is selected because this is the option which most closely follows the "Implicit Grant Flow" for OAuth2. Under "What data will you be accessing", select "User data".

Under "Create an OAuth 2.0 client ID", enter a suitable name. Under bundle ID, enter anything. Click "Create OAuth client ID".

Under "Set up the OAuth 2.0 consent screen", select your email address and enter a name you will recognize. For me, I simply entered "Spotify2Youtube". Click "I'll do this later".

On the credentials screen, copy the client ID of your OAuth2 client. Open the "google_credentials.template.json" file in a text editor in the cloned project. Paste the client ID inside the quotes on the right side of the colon after "client_id". Save the file and rename it to "google_credentials.json". 

### Note

For some reason, if a user uses an account that hasn't used youtube before for creating playlists (just a google account), then the Youtube API responds with an unauthorized response. 

## Registering with Spotify

Navigate to https://developer.spotify.com/dashboard and log in. Accept the terms of service. On the Spotify Developer Console, select "Create a client ID". In the form, enter in a name you will recognize. For me, I entered "Spotify to Youtube". Enter whatever description you want. Under "What are you building", select "Desktop App". Click "Next". Select "No" to the question "Are you developing a commercial integration?". Select all checkboxes and select "Submit". 

Once you are redirected to your app's page, click "Edit Settings". Under redirect URIs, enter "http://localhost:8888/spotifycallback" and click "Add" then "Save". 

Copy the Client ID. Open the "spotify_credentials.template.json" file in a text editor in the cloned project. Past the client ID inside the quotes on the right side of the colon after "client_id". Save the file and rename it to "spotify_credentials.json".

# Running

Make sure you followed all steps in the "Installation" section.

## Running with Node

In your computers shell, navigate to the root directory of the project (something similar to "cd spotify2youtube"). 

Enter

```
npm install
```
This will install the required packages for running the application. 

Enter

```
npm start
```

## Creating an executable

### Building

In your computers shell, navigate to the root directory of the project (something similar to "cd spotify2youtube"). 

Enter

```
npm install
```
This will install the required packages for building the application.

#### Windows
Enter
```
npm run package-win
```

The .exe file will be located in "Spotify2Youtube/release-builds/Spotify2Youtube-win32-ia32". The "win32-ia32" portion might be different depending on your OS. Do not copy this .exe file to another location. If you want to access it from somewhere else (i.e. the desktop), make a shortcut.

#### Mac
Enter
```
npm run package-mac
```

The executable will be located in "Spotify2Youtube/release-builds/Spotify2Youtube-..." (where "..." will be some string relating to your OS) and will be named similarly to "Spotify2Youtube". I have not tested whether moving the executable will break the app. 

#### Linux
Enter
```
npm run package-linux
```

The executable will be located in "Spotify2Youtube/release-builds/Spotify2Youtube-linux-x64" and will be named "Spotify2Youtube". I have not tested whether moving the executable will break the app.