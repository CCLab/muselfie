Muselfie is a mobile application written in [NativeScript](https://www.nativescript.org/) for [National Museum in Warsaw](http://www.mnw.art.pl/en/).

# Installation

1. Install NativeScript 4.0.x [as described in the official documentation](https://docs.nativescript.org/start/quick-setup.html).

2. Install the project's dependencies:

        tns install

# Running the app

To run the application use the `tns run android` command.

# Building a production version of the app

    tns build android --release --bundle --env.uglify --env.snapshot --key-store-path [keystore-file] --key-store-password [keystore-password] --key-store-alias muselfie --key-store-alias-password [keystore-password]
    
Where `[keystore-file]` is the path to the keystore used to sign the app, and `[keystore-password]` is the password for this keystore.
