# mbed Device Connector Node.js Quickstart

Example Node.js express app that talks to the mbed Device Connector.

## Getting Started

### Installing Node.js and npm

You need to have Node.js and npm installed.

To check if you have them installed, open a terminal or command prompt and run the following commands:

```
node --version
npm --version
```

If you see an number output similar to x.x.x for each command, then they are both installed and you can continue to the next section.

To install on Windows or Mac, you can download the installer [here](https://nodejs.org/en/download).

To install on Linux, you can use a package manager. Instructions for installing Node.js on your distribution can be found [here](https://nodejs.org/en/download/package-manager)

### Running mbed Client

This example assumes that you have an mbed Client connected to mbed Device Connector.

If you have an mbed, you can use the [mbed Client Example](https://github.com/ARMmbed/mbed-client-examples).

## Configuring the App

Before running the app, you need to edit a few lines in `app.js`.

Open `app.js` and find the following lines:

```
// CONFIG (change these)
var accessKey = "<Access Key>";
var port = process.env.PORT || 3000;
```

Replace `<Access Key>` with your Access Key you created in mbed Device Connector. If you do not have an Access Key, see the section [Creating an Access Key](#creating-an-access-key). Your Access Key can also be changed through an environment variable named `ACCESS_KEY`.

You can usually leave `port` set to 3000. However, if you know you have another application running on that port or if you receive errors when starting the app, change this to another number (ex. 3001, 3002, etc.). The port can also be changed through an environment variable named `PORT`.

## Running the App

Once you've [configured the app](#configuring-the-app), you need to install its dependencies. Open a terminal or command prompt and run this command:
```
npm install
```

You can now run the app by using the following command:

```
node app.js
```

You should receive the following output:

```
mbed Device Connector Quickstart listening at http://localhost:3000
```

Copy and paste the printed URL into your browser and you should see a page listing all of your connected mbed Clients.

If you're running the mbed Client on an mbed, press the button indicated in the [mbed Client Example](https://github.com/ARMmbed/mbed-client-examples#testing) testing section.

## Appendix

### Creating an Access Key

1. Login to your account at [https://connector.mbed.com](https://connector.mbed.com).
2. Under **My applications**, click **Access keys**.
3. Click **Create New Access Key**. When prompted, enter a name for the access key (ex. "Quickstart") and click **ADD**.
4. Copy the access key you just created and use it when you're [configuring your app](#configuring-the-app).

### Finding Your Endpoint's Name

1. Login to your account at [https://connector.mbed.com](https://connector.mbed.com).
2. Under **My devices**, click **Connected devices**.
3. Find your endpoint in the list. Copy its name and use it when you're [configuring your app](#configuring-the-app).
