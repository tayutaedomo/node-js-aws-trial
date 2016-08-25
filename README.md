# node-js-aws-trial
Try aws-sdk


# Setup on your local
You need Node.js and npm.

Get source code, install modules and start app.
```
$ git clone git@github.com:tayutaedomo/node-js-aws-trial.git
$ cd node-js-aws-trial
$ npm install
$ export AWS_ACCESS_KEY_ID=<your access key>
$ export AWS_SECRET_ACCESS_KEY=<your secret key>
$ bin/www
```

Your app should now be running on [http://localhost:3000](http://localhost:3000).


# CloudFront
You can confirm CloudFront trial on local only.  

Before local confirmation, You should set environment variable and deploy CloudFront KeyPair file.

```
$ export CLOUDFRONT_KEYPARE_ID=<your keypair id>

$ cd node-js-aws-trial
$ mkdir cert
$ cp <your private key file path> cert/
```

