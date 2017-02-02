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

If you have an mbed, you can use the [mbed Client Example](https://github.com/ARMmbed/mbed-os-example-client).

## Configuring the App

Before running the app, you need to set some config options. This is done through environment variables or by creating a `.env` file in the root of the project.

The following variables are available to be configured:

- **ACCESS_KEY** - *(required)* Set this to your Access Key you created in mbed Device Connector. If you do not have an Access Key, see the section [Creating an Access Key](#creating-an-access-key)
- **PORT** - Set this to override the default port for the app. The default port is **8080**.

The `.env` file format is as follows:

```
ACCESS_KEY=<My Access Key>
PORT=8080
```

See the [dotenv](https://github.com/motdotla/dotenv) project page for more information on `.env` configuration.


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
mbed Device Connector Quickstart listening at http://localhost:8080
```

Copy and paste the printed URL into your browser and you should see a page listing all of your connected mbed Clients.

See the instructions in the [mbed Client example](https://github.com/ARMmbed/mbed-os-example-client#testing-the-application) testing section to update the endpoint's button resource.

## Appendix

### Creating an Access Key

1. Login to your account at [https://connector.mbed.com](https://connector.mbed.com).
2. Under **My applications**, click **Access keys**.
3. Click **Create New Access Key**. When prompted, enter a name for the access key (ex. "Quickstart") and click **ADD**.
4. Copy the access key you just created and use it when you're [configuring your app](#configuring-the-app).
