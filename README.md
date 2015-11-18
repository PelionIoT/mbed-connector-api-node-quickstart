# mbed Device Connector Node.js Quickstart

Example Node.js express app that talks to the mbed Device Connector.

## Getting Started

This example assumes that you have an mbed Client connected to mbed Device Connector.

If you have an mbed, you can use the [mbed Client Example](https://github.com/ARMmbed/mbed-client-examples).

If you don't have an mbed, you can use a Linux device instead. Checkout the [mbed Client Linux Example](https://github.com/ARMmbed/mbed-client-linux-example).

## Configuring the App

Before running the app, you need to edit a few lines in `app.js`.

Open `app.js` and find the following lines:

```
/* BEGIN EDITS */
//var mbedConnectorAccessKey = "Your Access Key";
//var endpointName = "Your endpoint name";
var port = 3000;
/* END EDITS */
```

Uncomment `mbedConnectorAccessKey` and replace `Your Access Key` with your Access Key you created in mbed Device Connector. If you do not have an Access Key, see the section [Creating an Access Key](#creating-an-access-key).

Uncomment `endpointName` and replace `Your endpoint name` with your endpoint's name you saw in mbed Device Connector. If you don't know your endpoint's name, see the section [Finding your Endpoint's Name](#finding-your-endpoints-name).

You can usually leave `port` set to 3000. However, if you know you have another application running on that port or if you receive errors when starting the app, change this to another number (ex. 3001, 3002, etc.).

## Running the App

Once you've [configured the app](#configuring-the-app), you can run it by using the following command:

```
node app.js
```

You should receive the following output:

```
mbed Device Connector Quickstart listening at http://localhost:3000
```

Copy and paste the printed URL into your browser and you should see a page listing the number of "Button Presses".

If you're running the mbed Client on an mbed, press the button indicated in the [mbed Client Example](https://github.com/ARMmbed/mbed-client-examples#testing) testing section.

If you're running the mbed Client on Linux, the "button presses" should increment every 10 seconds.

Refreshing the page will update the "Button Presses" value.

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
